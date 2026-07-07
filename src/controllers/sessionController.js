// controllers/sessionController.js
const {
  createSession,
  updateSession,
  getUserSessions,
  getSessionById,
  linkSessionToUser,
  deleteSession,
  renameSession
} = require("../services/leadService");
const { isValidObjectId, sanitizeLeadData, sanitizeString } = require("../utils/validation");

exports.createSession = async (req, res) => {
  try {
    const { userId } = req.body; // userId can be null for anonymous users
    const lead = await createSession(userId);
    res.json({ success: true, sessionId: lead._id });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create session"
    });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate session ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid session ID format"
      });
    }

    // Sanitize input data (lead fields), preserving session-feature fields
    const sanitizedData = sanitizeLeadData(req.body);

    if (req.body.userId !== undefined) {
      sanitizedData.userId = req.body.userId;
    }
    if (req.body.firstMessage !== undefined) {
      sanitizedData.firstMessage = sanitizeString(req.body.firstMessage);
    }
    if (Array.isArray(req.body.messages)) {
      sanitizedData.messages = req.body.messages.map((m) => ({
        ...m,
        text: sanitizeString(m && m.text)
      }));
    }

    const updatedLead = await updateSession(id, sanitizedData);

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }

    res.json({ success: true, session: updatedLead });
  } catch (err) {
    console.error("Session update error:", err);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update session"
    });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }

    const sessions = await getUserSessions(userId);
    res.json({ success: true, sessions });
  } catch (err) {
    console.error("Get user sessions error:", err);
    res.status(500).json({ success: false, sessions: [], error: "Failed to fetch sessions" });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid session ID format" });
    }

    const session = await getSessionById(id);

    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    res.json({ success: true, session });
  } catch (err) {
    console.error("Get session error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch session" });
  }
};

exports.linkSessionToUser = async (req, res) => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res.status(400).json({
        success: false,
        error: "sessionId and userId are required"
      });
    }

    if (!isValidObjectId(sessionId)) {
      return res.status(400).json({ success: false, error: "Invalid session ID format" });
    }

    const updatedSession = await linkSessionToUser(sessionId, userId);

    if (!updatedSession) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    res.json({ success: true, session: updatedSession });
  } catch (err) {
    console.error("Link session error:", err);
    res.status(500).json({ success: false, error: "Failed to link session" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid session ID format" });
    }

    const deleted = await deleteSession(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    res.json({ success: true, message: "Session deleted successfully" });

  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ success: false, error: "Failed to delete session" });
  }
};

exports.renameSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: "Invalid session ID format" });
    }

    if (!newName || !newName.trim()) {
      return res.status(400).json({
        success: false,
        error: "New name is required"
      });
    }

    const updatedSession = await renameSession(id, sanitizeString(newName));

    if (!updatedSession) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }

    res.json({
      success: true,
      session: updatedSession,
      message: "Session renamed successfully"
    });
  } catch (err) {
    console.error("Rename session error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to rename session"
    });
  }
};
