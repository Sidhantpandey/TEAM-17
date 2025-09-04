import express from 'express';
import { CategoryService } from '../services/categoryService.js';

const router = express.Router();

// GET /api/categories - Get all active categories
router.get('/', async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'CATEGORIES_RETRIEVAL_ERROR',
        message: error.message,
        details: {}
      }
    });
  }
});

// GET /api/categories/:id - Get specific category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.message === 'Category not found' || error.message === 'Category is not active') {
      res.status(404).json({
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'CATEGORY_RETRIEVAL_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// GET /api/categories/:id/posts - Get posts by category with pagination and search
router.get('/:id/posts', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 10,
      search
    } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      search
    };

    const result = await CategoryService.getPostsByCategory(id, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message === 'Category not found' || error.message === 'Category is not active') {
      res.status(404).json({
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'CATEGORY_POSTS_RETRIEVAL_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

export default router;