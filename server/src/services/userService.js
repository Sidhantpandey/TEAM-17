import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

export class UserService {
  static async createUser(userData) {
    const { email, password, displayName } = userData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      error.code = 'USER_EXISTS';
      throw error;
    }
    
    // Check if display name is already taken
    const existingDisplayName = await prisma.user.findFirst({
      where: { displayName }
    });
    
    if (existingDisplayName) {
      const error = new Error('Display name is already taken');
      error.statusCode = 400;
      error.code = 'DISPLAY_NAME_TAKEN';
      throw error;
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        role: 'STUDENT',
        isActive: true,
        notificationPrefs: {
          replies: true,
          mentions: true
        }
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        notificationPrefs: true,
        createdAt: true
      }
    });
    
    return user;
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        notificationPrefs: true,
        lastActivity: true,
        createdAt: true
      }
    });
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    
    return user;
  }

  static async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        displayName: true,
        role: true,
        isActive: true,
        notificationPrefs: true,
        lastActivity: true,
        createdAt: true
      }
    });
    
    return user;
  }

  static async authenticateUser(email, password) {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }
    
    if (!user.isActive) {
      const error = new Error('Account is deactivated');
      error.statusCode = 401;
      error.code = 'ACCOUNT_DEACTIVATED';
      throw error;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }
    
    // Update last activity (ignore if user is deleted during test cleanup)
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActivity: new Date() }
      });
    } catch (error) {
      // In test environment, user might be deleted during cleanup
      if (process.env.NODE_ENV !== 'test') {
        throw error;
      }
    }
    
    // Remove password hash from returned user
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const authError = new Error('Invalid token');
      authError.statusCode = 401;
      authError.code = 'INVALID_TOKEN';
      throw authError;
    }
  }

  static async updateUserRole(userId, role) {
    // Validate role
    const validRoles = ['STUDENT', 'MODERATOR', 'ADMIN'];
    if (!validRoles.includes(role)) {
      const error = new Error('Invalid role');
      error.statusCode = 400;
      error.code = 'INVALID_ROLE';
      throw error;
    }
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        notificationPrefs: true,
        lastActivity: true,
        createdAt: true
      }
    });
    
    return user;
  }

  static async updateNotificationPreferences(userId, preferences) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { notificationPrefs: preferences },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true,
        notificationPrefs: true,
        lastActivity: true,
        createdAt: true
      }
    });
    
    return user;
  }
}