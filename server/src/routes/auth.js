import express from 'express';
import { UserService } from '../services/userService.js';
import { validateRegistration, validateLogin, validateNotificationPreferences } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// User registration
router.post('/register', validateRegistration, async (req, res) => {
  try {
    console.log('🔍 Registration request received');
    console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
    
    const { email, password, displayName } = req.body;
    
    console.log('📝 Extracted fields:', { email, password: password ? '***' : 'missing', displayName });
    
    const user = await UserService.createUser({
      email,
      password,
      displayName
    });
    
    console.log('✅ User created successfully:', user.email);
    
    const token = UserService.generateToken(user);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        notificationPrefs: user.notificationPrefs
      },
      token
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    console.error('🔍 Error details:', error);
    
    res.status(error.statusCode || 500).json({
      error: {
        code: error.code || 'REGISTRATION_ERROR',
        message: error.message || 'Registration failed',
        details: {}
      }
    });
  }
});

// User login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserService.authenticateUser(email, password);
    
    // Generate JWT token
    const token = UserService.generateToken(user);
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        notificationPrefs: user.notificationPrefs
      },
      token
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: {
        code: error.code || 'LOGIN_ERROR',
        message: error.message || 'Login failed',
        details: {}
      }
    });
  }
});

// User logout (client-side token removal, server doesn't maintain session state)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Logout successful. Please remove the token from client storage.'
  });
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        displayName: req.user.displayName,
        role: req.user.role,
        notificationPrefs: req.user.notificationPrefs,
        lastActivity: req.user.lastActivity,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: {
        code: error.code || 'PROFILE_ERROR',
        message: error.message || 'Failed to get user profile',
        details: {}
      }
    });
  }
});

// Update notification preferences
router.put('/preferences', authenticateToken, validateNotificationPreferences, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const user = await UserService.updateNotificationPreferences(req.user.id, preferences);
    
    res.json({
      message: 'Notification preferences updated successfully',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        notificationPrefs: user.notificationPrefs
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: {
        code: error.code || 'PREFERENCES_UPDATE_ERROR',
        message: error.message || 'Failed to update preferences',
        details: {}
      }
    });
  }
});

export default router;