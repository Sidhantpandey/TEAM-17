import express from 'express';
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import categoryRoutes from './categories.js';
import searchRoutes from './search.js';
import moderationRoutes from './moderation.js';
import notificationRoutes from './notifications.js';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Peer Support Platform API'
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);
router.use('/moderation', moderationRoutes);
router.use('/notifications', notificationRoutes);

export default router;