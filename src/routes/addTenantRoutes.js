const express = require("express");
const router = express.Router();
const { addTenant } = require("../controllers/addTenantController.js");

router.post("/", addTenant);

module.exports = router;
