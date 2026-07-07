const { createSession, updateSession } = require("../services/leadService");
const { isValidObjectId, sanitizeLeadData } = require("../utils/validation");

exports.createSession = async (req, res) => {
  try {
    const lead = await createSession();
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

    // Sanitize input data
    const sanitizedData = sanitizeLeadData(req.body);

    const result = await updateSession(id, sanitizedData);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Session not found"
      });
    }

    res.json({ success: true });
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
