// services/leadService.js
const Lead = require("../models/Lead");

const createSession = async () => {
  const lead = new Lead({
    messages: []
  });
  return await lead.save();
};

const updateSession = async (id, data) => {
  const updateData = { ...data, updatedAt: Date.now() };
  
  // ✅ If firstMessage is provided, save it
  if (data.firstMessage) {
    updateData.firstMessage = data.firstMessage;
  }
  
  // ✅ If this is the first message and no firstMessage exists yet
  if (data.message && !data.firstMessage) {
    const existingLead = await Lead.findById(id);
    if (existingLead && !existingLead.firstMessage) {
      updateData.firstMessage = data.message;
    }
  }
  
  // If messages array is provided, update it
  if (data.messages) {
    updateData.messages = data.messages;
  }
  
  return await Lead.findByIdAndUpdate(id, { $set: updateData }, { new: true });
};

const updateLead = async (sessionId, data) => {
  return await Lead.findByIdAndUpdate(
    sessionId, 
    { $set: { ...data, updatedAt: Date.now() } }, 
    { new: true }
  );
};

const getUserSessions = async (userId) => {
  return await Lead.find({ userId })
    .sort({ updatedAt: -1 })
    .select('_id firstMessage message updatedAt createdAt')
    .lean();
};

const getSessionById = async (id) => {
  return await Lead.findById(id).lean();
};

const linkSessionToUser = async (sessionId, userId) => {
  return await Lead.findByIdAndUpdate(
    sessionId,
    { $set: { userId, updatedAt: Date.now() } },
    { new: true }
  );
};

const deleteSession = async (id) => {
  return await Lead.findByIdAndDelete(id);
};


module.exports = {
  createSession,
  updateSession,
  updateLead,
  getUserSessions,
  getSessionById,
  linkSessionToUser,
  deleteSession
};