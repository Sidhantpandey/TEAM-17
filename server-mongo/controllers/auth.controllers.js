import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";

// CREATE - Register a new user
export const createUser = async (req, res) => {
  try {
    const { email, fullName, password, mobile, gender, profile, college, role, profilePic } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      mobile,
      gender,
      profile,
      college,
      role: role || "STUDENT",
      profilePic: profilePic || ""
    });

    const savedUser = await newUser.save();

    // Remove password from response
    const { password: _, ...userResponse } = savedUser.toObject();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message
    });
  }
};

// READ - Get all users with optional filtering
export const getAllUsers = async (req, res) => {
  try {
    const { role, gender, college, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (gender) filter.gender = gender;
    if (college) filter.college = { $regex: college, $options: 'i' };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password') // Exclude password field
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / parseInt(limit)),
        totalUsers,
        hasNextPage: skip + users.length < totalUsers,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

// READ - Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
};

// READ - Get users by role
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Validate role
    const validRoles = ["ADMIN", "VOLUNTEER", "COUNSELLER", "STUDENT"];
    if (!validRoles.includes(role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified"
      });
    }

    const users = await User.find({ role: role.toUpperCase() })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users by role",
      error: error.message
    });
  }
};

// UPDATE - Update user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData.email; // Prevent email updates for security

    // If role is being updated, validate it
    if (updateData.role) {
      const validRoles = ["ADMIN", "VOLUNTEER", "COUNSELLER", "STUDENT"];
      if (!validRoles.includes(updateData.role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role specified"
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message
    });
  }
};

// UPDATE - Update user password
export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(id, { password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message
    });
  }
};

// DELETE - Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        id: deletedUser._id,
        email: deletedUser.email,
        fullName: deletedUser.fullName
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};

// DELETE - Delete multiple users
export const deleteMultipleUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of user IDs"
      });
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} users`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting users",
      error: error.message
    });
  }
};

// UTILITY - Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          role: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        roleDistribution: stats
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error.message
    });
  }
};