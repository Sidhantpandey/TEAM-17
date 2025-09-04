import prisma from '../config/database.js';

// Search service layer
export class SearchService {
  static async searchPosts(query, filters = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId
    } = filters;

    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const searchTerm = query.trim();
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50); // Max 50 posts per page

    // Build where clause
    const where = {
      AND: [
        { isApproved: true },
        categoryId ? { categoryId } : {},
        {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } }
          ]
        }
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
        query: searchTerm,
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
      throw new Error(`Failed to search posts: ${error.message}`);
    }
  }

  static async searchTopics(query, filters = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId
    } = filters;

    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    const searchTerm = query.trim();
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50); // Max 50 topics per page

    // Build where clause - focus on titles for topic search
    const where = {
      AND: [
        { isApproved: true },
        categoryId ? { categoryId } : {},
        { title: { contains: searchTerm, mode: 'insensitive' } }
      ].filter(condition => Object.keys(condition).length > 0)
    };

    try {
      const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
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
        topics: posts,
        query: searchTerm,
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
      throw new Error(`Failed to search topics: ${error.message}`);
    }
  }

  static async getSearchSuggestions(query, limit = 5) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim();

    try {
      // Get popular search terms from post titles
      const suggestions = await prisma.post.findMany({
        where: {
          AND: [
            { isApproved: true },
            { title: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        select: {
          title: true
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      // Extract unique keywords from titles
      const keywords = new Set();
      suggestions.forEach(post => {
        const words = post.title.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.includes(searchTerm.toLowerCase()) && word.length > 2) {
            keywords.add(word);
          }
        });
      });

      return Array.from(keywords).slice(0, limit);
    } catch (error) {
      // Return empty array on error to not break the search experience
      return [];
    }
  }
}