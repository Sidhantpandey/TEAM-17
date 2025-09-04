import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class NotificationService {
  /**
   * Get all notifications for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Notifications with pagination info
   */
  async getUserNotifications(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(unreadOnly && { isRead: false })
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              displayName: true
            }
          }
        }
      }),
      prisma.notification.count({ where })
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} Updated notification
   */
  async markAsRead(notificationId, userId) {
    // Verify the notification belongs to the user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new Error('Notification not found or access denied');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Update result
   */
  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  /**
   * Get unread notification count for a user
   * @param {string} userId - User ID
   * @returns {Promise<number>} Count of unread notifications
   */
  async getUnreadCount(userId) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  /**
   * Create a new notification
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Object>} Created notification
   */
  async createNotification(notificationData) {
    const { userId, type, title, message, postId, replyId } = notificationData;

    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        postId,
        replyId
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true
          }
        }
      }
    });
  }

  /**
   * Update user notification preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - Notification preferences
   * @returns {Promise<Object>} Updated user
   */
  async updateNotificationPreferences(userId, preferences) {
    // Validate preferences structure
    const validPrefs = {
      replies: Boolean(preferences.replies),
      mentions: Boolean(preferences.mentions),
      moderation: Boolean(preferences.moderation),
      system: Boolean(preferences.system)
    };

    return await prisma.user.update({
      where: { id: userId },
      data: {
        notificationPrefs: validPrefs
      },
      select: {
        id: true,
        displayName: true,
        notificationPrefs: true
      }
    });
  }

  /**
   * Get user notification preferences
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User preferences
   */
  async getNotificationPreferences(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        notificationPrefs: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} Deleted notification
   */
  async deleteNotification(notificationId, userId) {
    // Verify the notification belongs to the user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new Error('Notification not found or access denied');
    }

    return await prisma.notification.delete({
      where: { id: notificationId }
    });
  }

  /**
   * Create a reply notification
   * @param {string} postAuthorId - ID of the post author
   * @param {string} replyAuthorId - ID of the reply author
   * @param {string} postId - Post ID
   * @param {string} replyId - Reply ID
   * @param {string} postTitle - Post title
   * @returns {Promise<Object|null>} Created notification or null if same user
   */
  async createReplyNotification(postAuthorId, replyAuthorId, postId, replyId, postTitle) {
    // Don't notify if user is replying to their own post
    if (postAuthorId === replyAuthorId) {
      return null;
    }

    // Check if user wants reply notifications
    const user = await prisma.user.findUnique({
      where: { id: postAuthorId },
      select: { notificationPrefs: true }
    });

    const prefs = user?.notificationPrefs || {};
    if (!prefs.replies) {
      return null;
    }

    return await this.createNotification({
      userId: postAuthorId,
      type: 'REPLY',
      title: 'New reply to your post',
      message: `Someone replied to your post "${postTitle}"`,
      postId,
      replyId
    });
  }

  /**
   * Extract mentions from content and create notifications
   * @param {string} content - Content to scan for mentions
   * @param {string} authorId - ID of the user creating the content
   * @param {string} postId - Post ID
   * @param {string} replyId - Reply ID (optional)
   * @returns {Promise<Array>} Array of created notifications
   */
  async createMentionNotifications(content, authorId, postId, replyId = null) {
    // Extract mentions using regex (e.g., @username)
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    if (mentions.length === 0) {
      return [];
    }

    // Find users by display name
    const mentionedUsers = await prisma.user.findMany({
      where: {
        displayName: {
          in: mentions
        },
        id: {
          not: authorId // Don't notify the author
        }
      },
      select: {
        id: true,
        displayName: true,
        notificationPrefs: true
      }
    });

    const notifications = [];

    for (const user of mentionedUsers) {
      const prefs = user.notificationPrefs || {};
      if (prefs.mentions !== false) {
        const notification = await this.createNotification({
          userId: user.id,
          type: 'MENTION',
          title: 'You were mentioned',
          message: `You were mentioned in a ${replyId ? 'reply' : 'post'}`,
          postId,
          replyId
        });
        notifications.push(notification);
      }
    }

    return notifications;
  }

  /**
   * Create moderation notification
   * @param {string} userId - User ID to notify
   * @param {string} action - Moderation action taken
   * @param {string} contentType - Type of content (post/reply)
   * @param {string} postId - Post ID
   * @param {string} replyId - Reply ID (optional)
   * @returns {Promise<Object|null>} Created notification or null
   */
  async createModerationNotification(userId, action, contentType, postId, replyId = null) {
    // Check if user wants moderation notifications
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPrefs: true }
    });

    const prefs = user?.notificationPrefs || {};
    if (!prefs.moderation) {
      return null;
    }

    const actionMessages = {
      APPROVE: `Your ${contentType} has been approved`,
      EDIT: `Your ${contentType} has been edited by a moderator`,
      REMOVE: `Your ${contentType} has been removed`,
      FLAG: `Your ${contentType} has been flagged for review`
    };

    return await this.createNotification({
      userId,
      type: 'MODERATION',
      title: 'Content moderation update',
      message: actionMessages[action] || `Moderation action taken on your ${contentType}`,
      postId,
      replyId
    });
  }

  /**
   * Create system notification
   * @param {string} userId - User ID to notify
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @returns {Promise<Object|null>} Created notification or null
   */
  async createSystemNotification(userId, title, message) {
    // Check if user wants system notifications
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPrefs: true }
    });

    const prefs = user?.notificationPrefs || {};
    if (!prefs.system) {
      return null;
    }

    return await this.createNotification({
      userId,
      type: 'SYSTEM',
      title,
      message
    });
  }

  /**
   * Get notification with navigation context
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} Notification with navigation info
   */
  async getNotificationWithNavigation(notificationId, userId) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true
          }
        }
      }
    });

    if (!notification) {
      throw new Error('Notification not found or access denied');
    }

    // Add navigation context
    const navigationContext = {
      canNavigate: !!(notification.postId || notification.replyId),
      navigateToPost: notification.postId,
      navigateToReply: notification.replyId,
      navigationType: notification.replyId ? 'reply' : 'post'
    };

    return {
      ...notification,
      navigation: navigationContext
    };
  }
}

export default new NotificationService();