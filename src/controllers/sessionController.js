// controllers/sessionController.js
const { 
  createSession, 
  updateSession, 
  getUserSessions,
  getSessionById,
  linkSessionToUser,
  deleteSession
} = require("../services/leadService");

exports.createSession = async (req, res) => {
  try {
    const { userId } = req.body; // userId can be null for anonymous users
    const lead = await createSession(userId);
    res.json({ success: true, sessionId: lead._id });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLead = await updateSession(id, req.body);
    
    if (!updatedLead) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    
    res.json({ success: true, session: updatedLead });
  } catch (err) {
    console.error("Session update error:", err);
    res.status(500).json({ success: false, error: err.message });
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
    res.status(500).json({ success: false, sessions: [], error: err.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await getSessionById(id);
    
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    
    res.json({ success: true, session });
  } catch (err) {
    console.error("Get session error:", err);
    res.status(500).json({ success: false, error: err.message });
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
    
    const updatedSession = await linkSessionToUser(sessionId, userId);
    
    if (!updatedSession) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }
    
    res.json({ success: true, session: updatedSession });
  } catch (err) {
    console.error("Link session error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteSession(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    res.json({ success: true, message: "Session deleted successfully" });

  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
