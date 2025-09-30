const express = require("express"); // Node.js
const mysql = require("mysql");
const cors = require("cors"); // กำหนดว่า A สามารถส่งไปหา B ได้มั้ย

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sleep",
})

const port = 3002;
app.listen(port,()=>{ console.log("listening");})

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to MySQL DB");
  }
});

// Register
app.post('/register', (req,res) => {
    const sql = "INSERT INTO users (`name`,`email`,`password`,`confirmpassword`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.confirmpassword
    ];
    db.query(sql, [values], (err, result) => {
        if(err){
            console.log(err);
            return res.json({status:"Error", message: err});
        }

        // ดึงข้อมูล user ที่เพิ่งสร้าง (ใช้ insertId)
        const userId = result.insertId;
        db.query("SELECT * FROM users WHERE id = ?", [userId], (err2, users) => {
            if(err2) return res.json({status:"Error", message: err2});
            return res.json({status:"Success", user: users[0]});
        });
    });
});


// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err) return res.json({ status: "Error", message: err });
        if (result.length > 0) {
            return res.json({ status: "Success", user: result[0] });
        } else {
            return res.json({ status: "Failed" });
        }
    });
});


// บันทึก Sleep Diary
app.post('/sleepdiary', (req, res) => {
    const { user_id, diary_date, sleep_time, wake_time, quality, note } = req.body;

    if (!user_id || !diary_date) {
        return res.json({ status: "Error", message: "ข้อมูลไม่ครบ" });
    }

    const sql = "INSERT INTO sleep_diary (user_id, diary_date, sleep_time, wake_time, quality, note) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [user_id, diary_date, sleep_time || null, wake_time || null, quality || null, note || null];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ status: "Error", message: err });
        }
        res.json({ status: "Success", diaryId: result.insertId });
    });
});

// ดึง diary ของ user
app.get('/sleepdiary/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    db.query("SELECT * FROM sleep_diary WHERE user_id = ?", [user_id], (err, results) => {
        if (err) return res.json({ status: "Error", message: err });
        res.json({ status: "Success", diary: results });
    });
});





app.post("/sleepdiaryform", (req, res) => {
  const {
    sleep_date, bedtime, sleep_latency, night_awakenings, awaken_times,
    wake_duration, wake_time, total_sleep_hours, daytime_naps,
    medications, alcohol, sleep_quality, morning_fatigue
  } = req.body;

  const sql = `
    INSERT INTO sleepdiaryform
    (user_id, sleep_date, bedtime, sleep_latency, night_awakenings, awaken_times, wake_duration,
    wake_time, total_sleep_hours, daytime_naps, medications, alcohol, sleep_quality, morning_fatigue)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    1, // ตัวอย่าง user_id
    sleep_date, bedtime, sleep_latency, night_awakenings, awaken_times, wake_duration,
    wake_time, total_sleep_hours, daytime_naps, medications, alcohol, sleep_quality, morning_fatigue
  ], (err, result) => {
    if(err) {
      console.error(err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    }
    res.json({ message: "บันทึก Sleepdiaryform เรียบร้อย", diaryId: result.insertId });
  });
});

// GET ข้อมูลทั้งหมด
app.get("/sleepdiaryform", (req, res) => {
  db.query("SELECT * FROM sleepdiaryform", (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ status: "Success", diary: results });
  });
});

// GET ข้อมูลของ user ตาม user_id
app.get("/sleepdiaryform/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  db.query("SELECT * FROM sleepdiaryform WHERE user_id = ?", [user_id], (err, results) => {
    if(err) return res.status(500).json({ error: err });
    res.json({ status: "Success", diary: results });
  });
});



// POST /psqi : บันทึกข้อมูล PSQI
app.post('/psqi', (req, res) => {
    const data = req.body;

    const sql = `INSERT INTO psqi (
        user_id, bedtime, sleepLatency, wakeTime, actualSleepHours,
        q5_1, q5_2, q5_3, q5_4, q5_5, q5_6, q5_7, q5_8, q5_9, q6, q7, q8, q9, q10,
        q10_1, q10_2, q10_3, q10_4, q10_5
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
        data.user_id || null, // ถ้าไม่ได้ Login ให้เก็บ null
        data.bedtime, data.sleepLatency, data.wakeTime, data.actualSleepHours,
        data.q5_1, data.q5_2, data.q5_3, data.q5_4, data.q5_5, data.q5_6,
        data.q5_7, data.q5_8, data.q5_9, data.q6, data.q7, data.q8, data.q9, data.q10,
        data.q10_1, data.q10_2, data.q10_3, data.q10_4, data.q10_5
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'บันทึกข้อมูลเรียบร้อย', id: result.insertId });
    });
});
