// routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSession,
  updateSession,
  getUserSessions,
  getSessionById,
  linkSessionToUser,
  deleteSession
} = require("../controllers/sessionController");

router.post("/", createSession);
router.put("/:id", updateSession);
router.get("/user/:userId", getUserSessions);
router.get("/:id", getSessionById);
router.post("/link-user", linkSessionToUser);
router.delete("/:id", deleteSession);

module.exports = router;