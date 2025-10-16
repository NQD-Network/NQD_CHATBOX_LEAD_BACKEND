const Lead = require("../models/Lead");

const createSession = async () => {
  const lead = new Lead();
  return await lead.save();
};

const updateSession = async (id, data) => {
  return await Lead.findByIdAndUpdate(id, { $set: data });
};

const updateLead = async (sessionId, data) => {
  return await Lead.findByIdAndUpdate(sessionId, { $set: data }, { new: true });
};

module.exports = {
  createSession,
  updateSession,
  updateLead,
};
