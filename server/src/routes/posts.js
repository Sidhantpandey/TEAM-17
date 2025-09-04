import express from 'express';
import { PostService } from '../services/postService.js';
import { ReplyService } from '../services/replyService.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePost, validateReply } from '../middleware/validation.js';

const router = express.Router();

// GET /api/posts - Get posts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
      search
    } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      categoryId,
      search,
      includeUnapproved: false // Only show approved posts for public endpoint
    };

    const result = await PostService.getPosts(filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'POSTS_RETRIEVAL_ERROR',
        message: error.message,
        details: {}
      }
    });
  }
});

// POST /api/posts - Create new post (requires authentication)
router.post('/', authenticateToken, validatePost, async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const authorId = req.user.id;

    const postData = {
      title,
      content,
      authorId,
      categoryId
    };

    const post = await PostService.createPost(postData);

    res.status(201).json({
      success: true,
      data: post,
      message: post.isFlagged ? 
        'Post created but flagged for review' : 
        'Post created successfully'
    });
  } catch (error) {
    res.status(400).json({
      error: {
        code: 'POST_CREATION_ERROR',
        message: error.message,
        details: {}
      }
    });
  }
});

// GET /api/posts/:id - Get specific post with replies
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostService.getPostById(id);

    // Only show approved posts to public, unless user is author or moderator
    if (!post.isApproved) {
      // Check if user is authenticated and has permission to view
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(404).json({
          error: {
            code: 'POST_NOT_FOUND',
            message: 'Post not found',
            details: {}
          }
        });
      }

      // For now, just return 404 for unapproved posts
      // In a full implementation, we'd verify the token and check permissions
      return res.status(404).json({
        error: {
          code: 'POST_NOT_FOUND',
          message: 'Post not found',
          details: {}
        }
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    if (error.message === 'Post not found') {
      res.status(404).json({
        error: {
          code: 'POST_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'POST_RETRIEVAL_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// PUT /api/posts/:id - Update post (requires authentication and ownership)
router.put('/:id', authenticateToken, validatePost, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId } = req.body;
    const userId = req.user.id;

    const updateData = { title, content, categoryId };
    const updatedPost = await PostService.updatePost(id, updateData, userId);

    res.json({
      success: true,
      data: updatedPost,
      message: updatedPost.isFlagged ? 
        'Post updated but flagged for review' : 
        'Post updated successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        error: {
          code: 'POST_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(400).json({
        error: {
          code: 'POST_UPDATE_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// DELETE /api/posts/:id - Delete post (requires authentication and ownership or moderator role)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await PostService.deletePost(id, userId, userRole);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        error: {
          code: 'POST_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'POST_DELETION_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// POST /api/posts/:id/replies - Create reply to post
router.post('/:id/replies', authenticateToken, validateReply, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { content, parentId } = req.body;
    const authorId = req.user.id;

    const replyData = {
      content,
      authorId,
      postId,
      parentId
    };

    const reply = await ReplyService.createReply(replyData);

    res.status(201).json({
      success: true,
      data: reply,
      message: reply.isFlagged ? 
        'Reply created but flagged for review' : 
        'Reply created successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else if (error.message.includes('unapproved')) {
      res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(400).json({
        error: {
          code: 'REPLY_CREATION_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// GET /api/posts/:id/replies - Get replies for a post
router.get('/:id/replies', async (req, res) => {
  try {
    const { id: postId } = req.params;
    const replies = await ReplyService.getRepliesByPostId(postId);

    res.json({
      success: true,
      data: replies
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        error: {
          code: 'POST_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'REPLIES_RETRIEVAL_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// PUT /api/posts/replies/:id - Update reply (requires authentication and ownership)
router.put('/replies/:id', authenticateToken, validateReply, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const updateData = { content };
    const updatedReply = await ReplyService.updateReply(id, updateData, userId);

    res.json({
      success: true,
      data: updatedReply,
      message: updatedReply.isFlagged ? 
        'Reply updated but flagged for review' : 
        'Reply updated successfully'
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        error: {
          code: 'REPLY_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(400).json({
        error: {
          code: 'REPLY_UPDATE_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// DELETE /api/posts/replies/:id - Delete reply (requires authentication and ownership or moderator role)
router.delete('/replies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await ReplyService.deleteReply(id, userId, userRole);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      res.status(404).json({
        error: {
          code: 'REPLY_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else if (error.message.includes('Unauthorized')) {
      res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'REPLY_DELETION_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

export default router;