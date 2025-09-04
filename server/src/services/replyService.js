import { PrismaClient } from '@prisma/client';
import { autoFlagContent } from './moderationService.js';
import notificationService from './notificationService.js';

const prisma = new PrismaClient();

// Reply service layer
class ReplyService {
  // Content flagging keywords for automatic moderation (same as PostService)
  static INAPPROPRIATE_KEYWORDS = [
    'suicid', 'kill myself', 'end it all', 'self-harm', 'self harm', 'cutting',
    'hate myself', 'worthless', 'better off dead', 'no point living'
  ];

  static async createReply(replyData) {
    const { content, authorId, postId, parentId } = replyData;

    // Validate required fields
    if (!content || !authorId || !postId) {
      throw new Error('Missing required fields: content, authorId, postId');
    }

    // Check if post exists and is approved
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            notificationPrefs: true
          }
        }
      }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (!post.isApproved) {
      throw new Error('Cannot reply to unapproved post');
    }

    // If parentId is provided, check if parent reply exists
    let parentReply = null;
    if (parentId) {
      parentReply = await prisma.reply.findUnique({
        where: { id: parentId },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              notificationPrefs: true
            }
          }
        }
      });

      if (!parentReply) {
        throw new Error('Parent reply not found');
      }

      if (parentReply.postId !== postId) {
        throw new Error('Parent reply does not belong to the specified post');
      }
    }

    try {
      // Create the reply
      const reply = await prisma.reply.create({
        data: {
          content: content.trim(),
          authorId,
          postId,
          parentId,
          isFlagged: false, // Will be updated by auto-flagging if needed
          isApproved: true // Will be updated by auto-flagging if needed
        },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          post: {
            select: {
              id: true,
              title: true
            }
          },
          parent: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  id: true,
                  displayName: true
                }
              }
            }
          }
        }
      });

      // Check for inappropriate content using the moderation service
      const flag = await autoFlagContent({
        content,
        replyId: reply.id,
        authorId
      });

      // Create notifications for relevant users (only if reply is not flagged)
      if (!flag) {
        await this.createReplyNotifications(reply, post, parentReply);
        
        // Create mention notifications
        await notificationService.createMentionNotifications(
          content,
          authorId,
          postId,
          reply.id
        );
      }

      return reply;
    } catch (error) {
      throw new Error(`Failed to create reply: ${error.message}`);
    }
  }

  static async createReplyNotifications(reply, post, parentReply) {
    // Notify the post author using the notification service
    if (post.author.id !== reply.authorId) {
      await notificationService.createReplyNotification(
        post.author.id,
        reply.authorId,
        post.id,
        reply.id,
        post.title
      );
    }

    // If this is a nested reply, notify the parent reply author
    if (parentReply && parentReply.author.id !== reply.authorId && parentReply.author.id !== post.author.id) {
      const parentAuthorPrefs = typeof parentReply.author.notificationPrefs === 'string'
        ? JSON.parse(parentReply.author.notificationPrefs)
        : parentReply.author.notificationPrefs;

      if (parentAuthorPrefs?.replies !== false) {
        await notificationService.createNotification({
          userId: parentReply.author.id,
          type: 'REPLY',
          title: 'New reply to your comment',
          message: `${reply.author.displayName} replied to your comment on "${post.title}"`,
          postId: post.id,
          replyId: reply.id
        });
      }
    }
  }

  static async getRepliesByPostId(postId, options = {}) {
    const { includeUnapproved = false } = options;

    if (!postId) {
      throw new Error('Post ID is required');
    }

    try {
      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      const replies = await prisma.reply.findMany({
        where: {
          postId,
          ...(includeUnapproved ? {} : { isApproved: true })
        },
        orderBy: { createdAt: 'asc' }, // Chronological ordering
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          parent: {
            select: {
              id: true,
              content: true,
              author: {
                select: {
                  id: true,
                  displayName: true
                }
              }
            }
          },
          children: {
            where: includeUnapproved ? {} : { isApproved: true },
            orderBy: { createdAt: 'asc' },
            include: {
              author: {
                select: {
                  id: true,
                  displayName: true,
                  role: true
                }
              }
            }
          }
        }
      });

      return replies;
    } catch (error) {
      throw new Error(`Failed to retrieve replies: ${error.message}`);
    }
  }

  static async updateReply(id, updateData, userId) {
    if (!id) {
      throw new Error('Reply ID is required');
    }

    const { content } = updateData;

    if (!content) {
      throw new Error('Content is required for reply update');
    }

    try {
      // Check if reply exists and user has permission
      const existingReply = await prisma.reply.findUnique({
        where: { id },
        include: { author: true }
      });

      if (!existingReply) {
        throw new Error('Reply not found');
      }

      if (existingReply.authorId !== userId) {
        throw new Error('Unauthorized: You can only edit your own replies');
      }

      // Check for inappropriate content
      const isFlagged = this.checkForInappropriateContent(content);

      const updatedReply = await prisma.reply.update({
        where: { id },
        data: {
          content: content.trim(),
          isFlagged,
          isApproved: !isFlagged // Re-approve if not flagged
        },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          post: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      return updatedReply;
    } catch (error) {
      throw new Error(`Failed to update reply: ${error.message}`);
    }
  }

  static async deleteReply(id, userId, userRole) {
    if (!id) {
      throw new Error('Reply ID is required');
    }

    try {
      // Check if reply exists
      const existingReply = await prisma.reply.findUnique({
        where: { id },
        include: { author: true }
      });

      if (!existingReply) {
        throw new Error('Reply not found');
      }

      // Check permissions - author can delete their own replies, moderators/admins can delete any
      const canDelete = existingReply.authorId === userId || 
                       userRole === 'MODERATOR' || 
                       userRole === 'ADMIN';

      if (!canDelete) {
        throw new Error('Unauthorized: Insufficient permissions to delete this reply');
      }

      // Delete the reply (this will cascade delete child replies and flags)
      await prisma.reply.delete({
        where: { id }
      });

      return { success: true, message: 'Reply deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete reply: ${error.message}`);
    }
  }

  // Helper method to check for inappropriate content
  static checkForInappropriateContent(text) {
    const lowerText = text.toLowerCase();
    return this.INAPPROPRIATE_KEYWORDS.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
  }
}

export { ReplyService };