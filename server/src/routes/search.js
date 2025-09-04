import express from 'express';
import { SearchService } from '../services/searchService.js';

const router = express.Router();

// GET /api/search/posts - Search posts by keywords
router.get('/posts', async (req, res) => {
  try {
    const {
      q: query,
      page = 1,
      limit = 10,
      categoryId
    } = req.query;

    if (!query) {
      return res.status(400).json({
        error: {
          code: 'MISSING_QUERY',
          message: 'Search query parameter "q" is required',
          details: {}
        }
      });
    }

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      categoryId
    };

    const result = await SearchService.searchPosts(query, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message === 'Search query is required') {
      res.status(400).json({
        error: {
          code: 'INVALID_QUERY',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'SEARCH_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// GET /api/search/topics - Search for relevant topics and discussions
router.get('/topics', async (req, res) => {
  try {
    const {
      q: query,
      page = 1,
      limit = 10,
      categoryId
    } = req.query;

    if (!query) {
      return res.status(400).json({
        error: {
          code: 'MISSING_QUERY',
          message: 'Search query parameter "q" is required',
          details: {}
        }
      });
    }

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      categoryId
    };

    const result = await SearchService.searchTopics(query, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.message === 'Search query is required') {
      res.status(400).json({
        error: {
          code: 'INVALID_QUERY',
          message: error.message,
          details: {}
        }
      });
    } else {
      res.status(500).json({
        error: {
          code: 'SEARCH_ERROR',
          message: error.message,
          details: {}
        }
      });
    }
  }
});

// GET /api/search/suggestions - Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const {
      q: query,
      limit = 5
    } = req.query;

    if (!query) {
      return res.json({
        success: true,
        data: []
      });
    }

    const suggestions = await SearchService.getSearchSuggestions(query, parseInt(limit));

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    // Return empty suggestions on error to not break the search experience
    res.json({
      success: true,
      data: []
    });
  }
});

export default router;