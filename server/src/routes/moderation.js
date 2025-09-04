import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";
import {
  getFlaggedContent,
  flagContent,
  reviewFlaggedContent,
  getModerationLogs,
} from "../services/moderationService.js";

const router = express.Router();

/**
 * @route GET /api/moderation/flagged
 * @desc Get flagged content for moderation dashboard
 * @access Moderator, Admin
 */
router.get(
  "/flagged",
  authenticateToken,
  requireRole(["MODERATOR", "ADMIN"]),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 20, status } = req.query;

      const result = await getFlaggedContent({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/moderation/flag/:type/:id
 * @desc Flag content (post or reply)
 * @access Authenticated users
 */
router.post(
  "/flag/:type/:id",
  authenticateToken,
  validateRequest({
    body: {
      reason: { type: "string", required: true, minLength: 3, maxLength: 200 },
      description: { type: "string", required: false, maxLength: 500 },
    },
    params: {
      type: { type: "string", required: true, enum: ["post", "reply"] },
      id: { type: "string", required: true },
    },
  }),
  async (req, res, next) => {
    try {
      const { type, id } = req.params;
      const { reason, description } = req.body;
      const reporterId = req.user.id;

      const flagData = {
        reporterId,
        reason,
        description,
        ...(type === "post" ? { postId: id } : { replyId: id }),
      };

      const flag = await flagContent(flagData);

      res.status(201).json({
        success: true,
        message: "Content flagged successfully",
        data: { flag },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route PUT /api/moderation/review/:flagId
 * @desc Review flagged content
 * @access Moderator, Admin
 */
router.put(
  "/review/:flagId",
  authenticateToken,
  requireRole(["MODERATOR", "ADMIN"]),
  validateRequest({
    body: {
      action: {
        type: "string",
        required: true,
        enum: ["APPROVE", "EDIT", "REMOVE"],
      },
      reason: { type: "string", required: true, minLength: 3, maxLength: 200 },
      newContent: { type: "string", required: false, maxLength: 5000 },
    },
    params: {
      flagId: { type: "string", required: true },
    },
  }),
  async (req, res, next) => {
    try {
      const { flagId } = req.params;
      const { action, reason, newContent } = req.body;
      const moderatorId = req.user.id;

      // Validate that newContent is provided for EDIT action
      if (action === "EDIT" && !newContent) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "New content is required for EDIT action",
            details: {},
          },
        });
      }

      const result = await reviewFlaggedContent({
        flagId,
        moderatorId,
        action,
        reason,
        newContent,
      });

      res.json({
        success: true,
        message: `Content ${action.toLowerCase()}d successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET /api/moderation/logs
 * @desc Get moderation action logs
 * @access Moderator, Admin
 */
router.get(
  "/logs",
  authenticateToken,
  requireRole(["MODERATOR", "ADMIN"]),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 20, moderatorId } = req.query;

      const result = await getModerationLogs({
        page: parseInt(page),
        limit: parseInt(limit),
        moderatorId,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
