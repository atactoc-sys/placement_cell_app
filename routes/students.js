const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/", studentController.listStudents);
router.get("/add", ensureAuthenticated, (req, res) =>
  res.render("students/addStudent")
);
router.post("/add", ensureAuthenticated, studentController.addStudent);
router.get("/export", ensureAuthenticated, studentController.exportCSV);

module.exports = router;
