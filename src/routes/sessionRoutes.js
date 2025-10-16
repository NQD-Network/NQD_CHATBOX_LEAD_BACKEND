const express = require("express");
const router = express.Router();
const {
  createSession,
  updateSession,
} = require("../controllers/sessionController");

router.post("/", createSession);
router.put("/:id", updateSession);

module.exports = router;
