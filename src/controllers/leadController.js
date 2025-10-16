const axios = require("axios");
const { updateLead } = require("../services/leadService");

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/lead";

exports.submitLead = async (req, res) => {
  try {
    const { service, message, name, email, phone, bestTime, sessionId } =
      req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const lead = await updateLead(sessionId, {
      service,
      message,
      name,
      email,
      phone,
      bestTime,
    });

    // Send data to N8N webhook
    try {
      await axios.post(N8N_WEBHOOK_URL, lead);
    } catch (err) {
      console.warn("⚠️ Failed to POST to n8n webhook:", err.message);
    }

    res.json({ success: true, lead });
  } catch (err) {
    console.error("Submit lead error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
