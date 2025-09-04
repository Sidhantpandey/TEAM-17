import prisma from '../config/database.js';

// Category service layer
export class CategoryService {
  static async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: {
              posts: {
                where: { isApproved: true }
              }
            }
          }
        }
      });

      return categories;
    } catch (error) {
      throw new Error(`Failed to retrieve categories: ${error.message}`);
    }
  }

  static async getCategoryById(id) {
    if (!id) {
      throw new Error('Category ID is required');
    }

    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              posts: {
                where: { isApproved: true }
              }
            }
          }
        }
      });

      if (!category) {
        throw new Error('Category not found');
      }

      if (!category.isActive) {
        throw new Error('Category is not active');
      }

      return category;
    } catch (error) {
      if (error.message === 'Category not found' || error.message === 'Category is not active') {
        throw error;
      }
      throw new Error('Category not found');
    }
  }

  static async getPostsByCategory(categoryId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      search
    } = filters;

    const skip = (page - 1) * limit;
    const take = Math.min(limit, 50); // Max 50 posts per page

    // First verify category exists and is active
    await this.getCategoryById(categoryId);

    // Build where clause
    const where = {
      AND: [
        { categoryId },
        { isApproved: true },
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
      throw new Error(`Failed to retrieve posts for category: ${error.message}`);
    }
  }
}