import prisma from '../config/database.js';
import { autoFlagContent } from './moderationService.js';
import notificationService from './notificationService.js';

// Post service layer
export class PostService {
  // Content flagging keywords for automatic moderation
  static INAPPROPRIATE_KEYWORDS = [
    'suicid', 'kill myself', 'end it all', 'self-harm', 'self harm', 'cutting',
    'hate myself', 'worthless', 'better off dead', 'no point living'
  ];

  static async createPost(postData) {
    const { title, content, authorId, categoryId } = postData;

    // Validate required fields
    if (!title || !content || !authorId || !categoryId) {
      throw new Error('Missing required fields: title, content, authorId, categoryId');
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category || !category.isActive) {
      throw new Error('Invalid or inactive category');
    }

    try {
      const post = await prisma.post.create({
        data: {
          title: title.trim(),
          content: content.trim(),
          authorId,
          categoryId,
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
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          _count: {
            select: {
              replies: true
            }
          }
        }
      });

      // Check for inappropriate content using the moderation service
      const flag = await autoFlagContent({
        content: title + ' ' + content,
        postId: post.id,
        authorId
      });

      // Create mention notifications (only if post is not flagged)
      if (!flag) {
        await notificationService.createMentionNotifications(
          title + ' ' + content,
          authorId,
          post.id
        );
      }

      return post;
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  static async getPosts(filters = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      authorId,
      includeUnapproved = false,
      search
    } = filters;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50); // Max 50 posts per page

    // Build where clause
    const where = {
      AND: [
        // Only show approved posts unless specifically requested
        includeUnapproved ? {} : { isApproved: true },
        categoryId ? { categoryId } : {},
        authorId ? { authorId } : {},
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        } : {}
      ].filter(condition => Object.keys(condition).length > 0)
    };

    try {
      const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                displayName: true,
                role: true
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                color: true
              }
            },
            _count: {
              select: {
                replies: true
              }
            }
          }
        }),
        prisma.post.count({ where })
      ]);

      return {
        posts,
        pagination: {
          page,
          limit: take,
          total: totalCount,
          totalPages: Math.ceil(totalCount / take),
          hasNext: skip + take < totalCount,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to retrieve posts: ${error.message}`);
    }
  }

  static async getPostById(id) {
    if (!id) {
      throw new Error('Post ID is required');
    }

    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          replies: {
            where: { isApproved: true },
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
          },
          _count: {
            select: {
              replies: true
            }
          }
        }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    } catch (error) {
      // If it's already our "Post not found" error, re-throw it
      if (error.message === 'Post not found') {
        throw error;
      }
      // For other errors (like invalid ID format), treat as not found
      throw new Error('Post not found');
    }
  }

  static async updatePost(id, updateData, userId) {
    if (!id) {
      throw new Error('Post ID is required');
    }

    const { title, content, categoryId } = updateData;

    try {
      // Check if post exists and user has permission
      const existingPost = await prisma.post.findUnique({
        where: { id },
        include: { author: true }
      });

      if (!existingPost) {
        throw new Error('Post not found');
      }

      if (existingPost.authorId !== userId) {
        throw new Error('Unauthorized: You can only edit your own posts');
      }

      // Validate category if provided
      if (categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: categoryId }
        });

        if (!category || !category.isActive) {
          throw new Error('Invalid or inactive category');
        }
      }

      // Check for inappropriate content if content is being updated
      let isFlagged = existingPost.isFlagged;
      if (title || content) {
        const newTitle = title || existingPost.title;
        const newContent = content || existingPost.content;
        isFlagged = this.checkForInappropriateContent(newTitle + ' ' + newContent);
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          ...(title && { title: title.trim() }),
          ...(content && { content: content.trim() }),
          ...(categoryId && { categoryId }),
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
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          _count: {
            select: {
              replies: true
            }
          }
        }
      });

      return updatedPost;
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }

  static async deletePost(id, userId, userRole) {
    if (!id) {
      throw new Error('Post ID is required');
    }

    try {
      // Check if post exists
      const existingPost = await prisma.post.findUnique({
        where: { id },
        include: { author: true }
      });

      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Check permissions - author can delete their own posts, moderators/admins can delete any
      const canDelete = existingPost.authorId === userId || 
                       userRole === 'MODERATOR' || 
                       userRole === 'ADMIN';

      if (!canDelete) {
        throw new Error('Unauthorized: Insufficient permissions to delete this post');
      }

      // Delete the post (this will cascade delete replies and flags due to foreign key constraints)
      await prisma.post.delete({
        where: { id }
      });

      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
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