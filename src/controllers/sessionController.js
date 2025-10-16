const { createSession, updateSession } = require("../services/leadService");

exports.createSession = async (req, res) => {
  try {
    const lead = await createSession();
    res.json({ success: true, sessionId: lead._id });
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ success: false });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    await updateSession(id, req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Session update error:", err);
    res.status(500).json({ success: false });
  }
};
