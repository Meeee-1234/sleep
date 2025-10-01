const express = require("express");
const mysql = require("mysql2");   // แนะนำใช้ mysql2 จะเสถียรกว่า mysql
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ====== DB Config from ENV ======
const db = mysql.createPool({
  host: process.env.DB_HOST || "containers-us-west-123.railway.app",
  port: process.env.DB_PORT || 6543,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: true } // Railway ต้องใช้ SSL
});

// ====== Start Server ======
const port = process.env.PORT || 3002;
app.listen(port, "0.0.0.0", () => {
  console.log("listening on port", port);
});

app.get("/", (req, res) => {
  res.send("GoodNightHub API is running 🚀");
});


// ====== Routes ======

// Register
app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO users (`name`,`email`,`password`,`confirmpassword`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.confirmpassword,
  ];
  db.query(sql, [values], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ status: "Error", message: err });
    }
    const userId = result.insertId;
    db.query("SELECT * FROM users WHERE id = ?", [userId], (err2, users) => {
      if (err2) return res.json({ status: "Error", message: err2 });
      return res.json({ status: "Success", user: users[0] });
    });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) return res.json({ status: "Error", message: err });
      if (result.length > 0) {
        return res.json({ status: "Success", user: result[0] });
      } else {
        return res.json({ status: "Failed" });
      }
    }
  );
});

// Sleep Diary - POST
app.post("/sleepdiary", (req, res) => {
  const { user_id, diary_date, sleep_time, wake_time, quality, note } = req.body;
  if (!user_id || !diary_date) {
    return res.json({ status: "Error", message: "ข้อมูลไม่ครบ" });
  }
  const sql =
    "INSERT INTO sleep_diary (user_id, diary_date, sleep_time, wake_time, quality, note) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    user_id,
    diary_date,
    sleep_time || null,
    wake_time || null,
    quality || null,
    note || null,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ status: "Error", message: err });
    }
    res.json({ status: "Success", diaryId: result.insertId });
  });
});

// Sleep Diary - GET by user
app.get("/sleepdiary/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  db.query(
    "SELECT * FROM sleep_diary WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.json({ status: "Error", message: err });
      res.json({ status: "Success", diary: results });
    }
  );
});

// Sleepdiaryform - POST
app.post("/sleepdiaryform", (req, res) => {
  const {
    sleep_date,
    bedtime,
    sleep_latency,
    night_awakenings,
    awaken_times,
    wake_duration,
    wake_time,
    total_sleep_hours,
    daytime_naps,
    medications,
    alcohol,
    sleep_quality,
    morning_fatigue,
  } = req.body;

  const sql = `
    INSERT INTO sleepdiaryform
    (user_id, sleep_date, bedtime, sleep_latency, night_awakenings, awaken_times, wake_duration,
     wake_time, total_sleep_hours, daytime_naps, medications, alcohol, sleep_quality, morning_fatigue)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      1, // TODO: แก้ทีหลังให้ใช้ user_id จาก token/login
      sleep_date,
      bedtime,
      sleep_latency,
      night_awakenings,
      awaken_times,
      wake_duration,
      wake_time,
      total_sleep_hours,
      daytime_naps,
      medications,
      alcohol,
      sleep_quality,
      morning_fatigue,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
      }
      res.json({
        message: "บันทึก Sleepdiaryform เรียบร้อย",
        diaryId: result.insertId,
      });
    }
  );
});

// Sleepdiaryform - GET all
app.get("/sleepdiaryform", (req, res) => {
  db.query("SELECT * FROM sleepdiaryform", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ status: "Success", diary: results });
  });
});

// Sleepdiaryform - GET by user
app.get("/sleepdiaryform/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  db.query(
    "SELECT * FROM sleepdiaryform WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ status: "Success", diary: results });
    }
  );
});

// PSQI - POST
app.post("/psqi", (req, res) => {
  const data = req.body;

  const sql = `INSERT INTO psqi (
    user_id, bedtime, sleepLatency, wakeTime, actualSleepHours,
    q5_1, q5_2, q5_3, q5_4, q5_5, q5_6, q5_7, q5_8, q5_9, q6, q7, q8, q9, q10,
    q10_1, q10_2, q10_3, q10_4, q10_5
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const values = [
    data.user_id || null,
    data.bedtime,
    data.sleepLatency,
    data.wakeTime,
    data.actualSleepHours,
    data.q5_1,
    data.q5_2,
    data.q5_3,
    data.q5_4,
    data.q5_5,
    data.q5_6,
    data.q5_7,
    data.q5_8,
    data.q5_9,
    data.q6,
    data.q7,
    data.q8,
    data.q9,
    data.q10,
    data.q10_1,
    data.q10_2,
    data.q10_3,
    data.q10_4,
    data.q10_5,
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "บันทึกข้อมูลเรียบร้อย", id: result.insertId });
  });
});
