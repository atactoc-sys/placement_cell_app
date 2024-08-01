const Student = require("../models/Student");
const Interview = require("../models/Interview");
const Result = require("../models/Result");

exports.listStudents = async (req, res) => {
  const students = await Student.find();
  res.render("students/listStudents", { students });
};

exports.addStudent = async (req, res) => {
  const { name, college, status, batch, dsa, webd, react } = req.body;
  try {
    const student = new Student({
      name,
      college,
      status,
      batch,
      scores: { dsa, webd, react },
    });
    await student.save();
    res.redirect("/students");
  } catch (err) {
    res.status(400).send("Error adding student");
  }
};

exports.exportCSV = async (req, res) => {
  const results = await Result.find().populate("student interview");
  const csvWriter = createCsvWriter({
    path: "students.csv",
    header: [
      { id: "studentId", title: "Student ID" },
      { id: "studentName", title: "Student Name" },
      { id: "college", title: "College" },
      { id: "status", title: "Status" },
      { id: "dsa", title: "DSA Final Score" },
      { id: "webd", title: "WebD Final Score" },
      { id: "react", title: "React Final Score" },
      { id: "interviewDate", title: "Interview Date" },
      { id: "company", title: "Interview Company" },
      { id: "result", title: "Result" },
    ],
  });

  const records = results.map((result) => ({
    studentId: result.student._id,
    studentName: result.student.name,
    college: result.student.college,
    status: result.student.status,
    dsa: result.student.scores.dsa,
    webd: result.student.scores.webd,
    react: result.student.scores.react,
    interviewDate: result.interview.date,
    company: result.interview.company,
    result: result.result,
  }));

  await csvWriter.writeRecords(records);
  res.download("students.csv");
};
