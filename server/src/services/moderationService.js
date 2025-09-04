import prisma from '../config/database.js';

/**
 * Moderation Service
 * Handles content flagging, moderation dashboard, and moderation actions
 */

/**
 * Get all flagged content for moderation dashboard
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.status - Filter by flag status (optional)
 * @returns {Promise<Object>} Flagged content with pagination
 */
export async function getFlaggedContent({ page = 1, limit = 20, status = null } = {}) {
  const skip = (page - 1) * limit;
  
  const where = {
    ...(status && { status })
  };

  const [flags, total] = await Promise.all([
    prisma.flag.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            displayName: true,
            role: true
          }
        },
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            author: {
              select: {
                id: true,
                displayName: true
              }
            },
            category: {
              select: {
                name: true
              }
            },
            createdAt: true
          }
        },
        reply: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                displayName: true
              }
            },
            post: {
              select: {
                id: true,
                title: true
              }
            },
            createdAt: true
          }
        },
        reviewer: {
          select: {
            id: true,
            displayName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.flag.count({ where })
  ]);

  return {
    flags,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

/**
 * Flag content manually
 * @param {Object} flagData - Flag data
 * @param {string} flagData.reporterId - ID of user reporting
 * @param {string} flagData.reason - Reason for flagging
 * @param {string} flagData.description - Optional description
 * @param {string} flagData.postId - Post ID (if flagging a post)
 * @param {string} flagData.replyId - Reply ID (if flagging a reply)
 * @returns {Promise<Object>} Created flag
 */
export async function flagContent({ reporterId, reason, description, postId, replyId }) {
  // Validate that either postId or replyId is provided, but not both
  if ((!postId && !replyId) || (postId && replyId)) {
    throw new Error('Must provide either postId or replyId, but not both');
  }

  // Check if content exists and update its flagged status
  if (postId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Update post flagged status
    await prisma.post.update({
      where: { id: postId },
      data: { isFlagged: true }
    });
  }

  if (replyId) {
    const reply = await prisma.reply.findUnique({ where: { id: replyId } });
    if (!reply) {
      throw new Error('Reply not found');
    }
    
    // Update reply flagged status
    await prisma.reply.update({
      where: { id: replyId },
      data: { isFlagged: true }
    });
  }

  // Create the flag
  const flag = await prisma.flag.create({
    data: {
      reporterId,
      reason,
      description,
      postId,
      replyId,
      isAutomatic: false
    },
    include: {
      reporter: {
        select: {
          id: true,
          displayName: true,
          role: true
        }
      },
      post: postId ? {
        select: {
          id: true,
          title: true,
          content: true,
          author: {
            select: {
              id: true,
              displayName: true
            }
          }
        }
      } : undefined,
      reply: replyId ? {
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
      } : undefined
    }
  });

  return flag;
}

/**
 * Automatically flag content based on inappropriate content detection
 * @param {Object} contentData - Content data
 * @param {string} contentData.content - Content to analyze
 * @param {string} contentData.postId - Post ID (if flagging a post)
 * @param {string} contentData.replyId - Reply ID (if flagging a reply)
 * @param {string} contentData.authorId - Author ID for system reporting
 * @returns {Promise<Object|null>} Created flag if content was flagged, null otherwise
 */
export async function autoFlagContent({ content, postId, replyId, authorId }) {
  // Simple inappropriate content detection (can be enhanced with ML/AI services)
  const inappropriatePatterns = [
    /\b(suicide|kill\s+myself|end\s+it\s+all)\b/i,
    /\b(self\s*harm|cutting|hurting\s+myself)\b/i,
    /\b(hate\s+myself|worthless|nobody\s+cares)\b/i,
    /(fuck|shit|damn|bitch|asshole)/i,
    /\b(spam|advertisement|buy\s+now|click\s+here)\b/i
  ];

  const flagReasons = [
    'Potential self-harm content',
    'Self-harm references',
    'Negative self-talk',
    'Inappropriate language',
    'Spam content'
  ];

  for (let i = 0; i < inappropriatePatterns.length; i++) {
    if (inappropriatePatterns[i].test(content)) {
      // Create system flag
      const flag = await prisma.flag.create({
        data: {
          reporterId: authorId, // System uses author as reporter for auto-flags
          reason: flagReasons[i],
          description: 'Automatically flagged by content detection system',
          postId,
          replyId,
          isAutomatic: true
        }
      });

      // Update content flagged status
      if (postId) {
        await prisma.post.update({
          where: { id: postId },
          data: { isFlagged: true }
        });
      }

      if (replyId) {
        await prisma.reply.update({
          where: { id: replyId },
          data: { isFlagged: true }
        });
      }

      return flag;
    }
  }

  return null; // No inappropriate content detected
}

/**
 * Review flagged content (approve, edit, remove)
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.flagId - Flag ID to review
 * @param {string} reviewData.moderatorId - Moderator performing the review
 * @param {string} reviewData.action - Action to take (APPROVE, EDIT, REMOVE)
 * @param {string} reviewData.reason - Reason for the action
 * @param {string} reviewData.newContent - New content (for EDIT action)
 * @returns {Promise<Object>} Updated flag and moderation log
 */
export async function reviewFlaggedContent({ flagId, moderatorId, action, reason, newContent }) {
  const flag = await prisma.flag.findUnique({
    where: { id: flagId },
    include: {
      post: true,
      reply: true
    }
  });

  if (!flag) {
    throw new Error('Flag not found');
  }

  if (flag.status !== 'PENDING') {
    throw new Error('Flag has already been reviewed');
  }

  // Perform the moderation action
  let targetType, targetId;
  
  if (flag.postId) {
    targetType = 'post';
    targetId = flag.postId;
    
    switch (action) {
      case 'APPROVE':
        await prisma.post.update({
          where: { id: flag.postId },
          data: { 
            isFlagged: false,
            isApproved: true
          }
        });
        break;
      case 'EDIT':
        if (!newContent) {
          throw new Error('New content is required for EDIT action');
        }
        await prisma.post.update({
          where: { id: flag.postId },
          data: { 
            content: newContent,
            isFlagged: false,
            isApproved: true
          }
        });
        break;
      case 'REMOVE':
        await prisma.post.update({
          where: { id: flag.postId },
          data: { 
            isFlagged: false,
            isApproved: false
          }
        });
        break;
      default:
        throw new Error('Invalid action');
    }
  } else if (flag.replyId) {
    targetType = 'reply';
    targetId = flag.replyId;
    
    switch (action) {
      case 'APPROVE':
        await prisma.reply.update({
          where: { id: flag.replyId },
          data: { 
            isFlagged: false,
            isApproved: true
          }
        });
        break;
      case 'EDIT':
        if (!newContent) {
          throw new Error('New content is required for EDIT action');
        }
        await prisma.reply.update({
          where: { id: flag.replyId },
          data: { 
            content: newContent,
            isFlagged: false,
            isApproved: true
          }
        });
        break;
      case 'REMOVE':
        await prisma.reply.update({
          where: { id: flag.replyId },
          data: { 
            isFlagged: false,
            isApproved: false
          }
        });
        break;
      default:
        throw new Error('Invalid action');
    }
  }

  // Update flag status
  const updatedFlag = await prisma.flag.update({
    where: { id: flagId },
    data: {
      status: 'REVIEWED',
      reviewedAt: new Date(),
      reviewedBy: moderatorId
    },
    include: {
      reporter: {
        select: {
          id: true,
          displayName: true,
          role: true
        }
      },
      reviewer: {
        select: {
          id: true,
          displayName: true,
          role: true
        }
      },
      post: flag.postId ? {
        select: {
          id: true,
          title: true,
          content: true,
          author: {
            select: {
              id: true,
              displayName: true
            }
          }
        }
      } : undefined,
      reply: flag.replyId ? {
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
      } : undefined
    }
  });

  // Create moderation log
  const moderationLog = await prisma.moderationLog.create({
    data: {
      moderatorId,
      action,
      targetType,
      targetId,
      reason,
      details: newContent ? `Content edited. New content: ${newContent}` : null
    },
    include: {
      moderator: {
        select: {
          id: true,
          displayName: true,
          role: true
        }
      }
    }
  });

  return {
    flag: updatedFlag,
    moderationLog
  };
}

/**
 * Get moderation logs
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.moderatorId - Filter by moderator ID (optional)
 * @returns {Promise<Object>} Moderation logs with pagination
 */
export async function getModerationLogs({ page = 1, limit = 20, moderatorId = null } = {}) {
  const skip = (page - 1) * limit;
  
  const where = {
    ...(moderatorId && { moderatorId })
  };

  const [logs, total] = await Promise.all([
    prisma.moderationLog.findMany({
      where,
      include: {
        moderator: {
          select: {
            id: true,
            displayName: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.moderationLog.count({ where })
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}