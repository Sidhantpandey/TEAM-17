import express from 'express';
import notificationService from '../services/notificationService.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateNotificationPreferences } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Get user notifications with pagination
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page, limit, unreadOnly } = req.query;
    
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      unreadOnly: unreadOnly === 'true'
    };

    const result = await notificationService.getUserNotifications(userId, options);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications/count
 * Get unread notification count
 */
router.get('/count', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await notificationService.getUnreadCount(userId);
    res.json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
router.put('/:id/read', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await notificationService.markAsRead(id, userId);
    res.json(notification);
  } catch (error) {
    if (error.message === 'Notification not found or access denied') {
      return res.status(404).json({
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Notification not found or access denied'
        }
      });
    }
    next(error);
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 */
router.put('/read-all', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await notificationService.markAllAsRead(userId);
    res.json({ 
      message: 'All notifications marked as read',
      updatedCount: result.count 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications/preferences
 * Get user notification preferences
 */
router.get('/preferences', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const preferences = await notificationService.getNotificationPreferences(userId);
    res.json(preferences);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    next(error);
  }
});

/**
 * PUT /api/notifications/preferences
 * Update user notification preferences
 */
router.put('/preferences', authenticateToken, validateNotificationPreferences, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;
    
    const updatedUser = await notificationService.updateNotificationPreferences(userId, preferences);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/notifications/:id/navigate
 * Get notification with navigation context
 */
router.get('/:id/navigate', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await notificationService.getNotificationWithNavigation(id, userId);
    
    // Mark as read when navigating
    if (!notification.isRead) {
      await notificationService.markAsRead(id, userId);
    }
    
    res.json(notification);
  } catch (error) {
    if (error.message === 'Notification not found or access denied') {
      return res.status(404).json({
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Notification not found or access denied'
        }
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    await notificationService.deleteNotification(id, userId);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    if (error.message === 'Notification not found or access denied') {
      return res.status(404).json({
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Notification not found or access denied'
        }
      });
    }
    next(error);
  }
});

export default router;