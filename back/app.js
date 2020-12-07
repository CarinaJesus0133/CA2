var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('ca2.db');
const cors = require('cors');
var table = require('./table');

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

initDb();

app.get('/login', function (req, res) {
  var email = req.query.email;
  var password = req.query.password;

  var query = `SELECT u.id, user_type, name, c.id as customerId, h.id as hairdresserId FROM USER u
   LEFT JOIN customer c on c.user_id = u.id
   LEFT JOIN hairdresser h 
   ON h.user = u.id
   WHERE email = ? AND password = ?`;
  db.all(query, [email, password], function (err, rows) {
    console.log(err);
    if (rows[0] !== undefined) {
      res.json({ id: rows[0].id, error: false, user_type: rows[0].user_type, name: rows[0].name, customerId: rows[0].customerId, hairdresserId: rows[0].hairdresserId })
    } else {
      res.json({ error: true })
    }
  });
});

app.get('/search', function (req, res) {
  var filter = req.query.filter;

  var query = `SELECT u.id, u.name, h.location, h.id as hairdresser_id FROM user u
  INNER JOIN hairdresser h
  ON h.user = u.id
  WHERE name LIKE '%${filter}%' OR location LIKE '%${filter}%'`;
  db.all(query, [], function (err, rows) {
    console.log(err);
    res.json(rows)
  });
});

app.get('/booking', function (req, res) {
  var customerId = req.query.customerId;
  var appointmentId = req.query.appointmentId;

  var query = `UPDATE appointment SET customer_id = ? WHERE id = ?`;
  db.run(query, [customerId, appointmentId], function (err) {
    console.log(err, req.query);
    if (!err) {
      res.json({ error: false })
    } else {
      res.json({ error: true })

    }
  });
});

app.get('/cancel-appointment', function (req, res) {
  var appointmentId = req.query.id;

  var query = `UPDATE appointment SET customer_id = NULL AND available = 1 WHERE id = ?`;
  db.run(query, [appointmentId], function (err) {
    console.log(err, req.query);
    if (!err) {
      res.json({ error: false })
    } else {
      res.json({ error: true })

    }
  });
});

app.get('/confirm-or-cancel-reservation', function (req, res) {
  var id = req.query.id;
  var value = req.query.value;

  var query = `UPDATE appointment SET available = ? WHERE id = ?`;
  db.run(query, [value, id], function (err) {
    console.log(err, req.query);
    if (!err) {
      res.json({ error: false })
    } else {
      res.json({ error: true })

    }
  });
});

app.get('/set-availability', function (req, res) {
  var id = Number(req.query.id);
  var date = req.query.date;
  var time = req.query.time;
  var hairdresser = req.query.hairdresser;
  var value = req.query.value;

  var query = "";
  if (id === 0) {
    query = `INSERT INTO appointment (hairdresser_id, appointment_date, appointment_time, available) VALUES (?, ?, ?, ?)`;
    db.run(query, [hairdresser, date, time, value], function (err) {
      console.log(err, req.query);
      if (!err) {
        res.json({ error: false })
      } else {
        res.json({ error: true })
      }
    });
  } else {
    query = `UPDATE appointment SET  available = ? WHERE id = ?`
    db.run(query, [value, id], function (err) {
      console.log(err, req.query);
      if (!err) {
        res.json({ error: false })
      } else {
        res.json({ error: true })
      }
    });
  }


});

app.get('/list-appointments', function (req, res) {
  var date = req.query.date;
  var query = `SELECT *,appointment_date as date, appointment_time as time  FROM appointment WHERE appointment_date = ? AND customer_id IS NULL AND available = 1`
  db.all(query, [date], function (err, rows) {
    console.log(err, date);
    res.json(rows)
  });
});

app.get('/last-appointments', function (req, res) {
  var customerId = req.query.customerId;

  var query = `SELECT a.id, u.name, a.appointment_date as date, a.appointment_time as time, h.location FROM appointment a 
  INNER JOIN hairdresser h
  ON h.id = a.hairdresser_id
  INNER JOIN user u
  ON u.id = h.user
  WHERE customer_id = ? AND a.appointment_date > date('now', '-1 day') AND a.available = 3 ORDER BY a.id DESC`
  db.all(query, [customerId], function (err, rows) {
    console.log(err, rows);
    res.json(rows)
  });
});

app.get('/reservations', function (req, res) {
  var hairdresser = req.query.id;

  var query = `SELECT a.id, u.name, a.appointment_date as date, a.appointment_time as time FROM appointment a 
  INNER JOIN customer c
  ON c.id = a.customer_id
  INNER JOIN user u
  ON u.id = c.user_id
  WHERE hairdresser_id = ? AND a.available = 1 ORDER BY a.id DESC`
  db.all(query, [hairdresser], function (err, rows) {
    console.log(err, rows, hairdresser);
    res.json(rows)
  });
});

app.get('/register', function (req, res) {
  var email = req.query.email;
  var password = req.query.password;
  var name = req.query.name;
  var phone = req.query.phone;
  var location = req.query.location;
  var user_type = Number(req.query.user_type);
  var query = `INSERT INTO "user"
    (email, password, name, phone, user_type)
    VALUES(?,?,?,?,?);
    `;
  db.run(query, [email, password, name, phone, user_type], function (err) {
    if (err) {
      console.log(err);
      res.json({ error: true });
      return;
    }
    db.all('SELECT id FROM user ORDER BY id DESC LIMIT 1', [], function (err, row) {
      if (err) {
        console.log(err);
        res.json({ error: true });
        return;
      }
      console.log(user_type, 'type');
      var id = row[0].id;
      var args = []
      if (user_type === 1) {
        query = 'INSERT INTO customer (user_id) VALUES (?)'
        args = [id];
      } else {
        query = 'INSERT INTO hairdresser (user, location) VALUES (?, ?)'
        args = [id, location]
      }
      db.run(query, args, function (err) {
        if (err) {
          console.log(err);
          res.json({ error: true });
          return;
        } else {
        console.log(err);
        res.json({ error: false });
          return;
        }
      });
    })
  });
})



app.listen(process.env.PORT || 8000, function () {
  console.log('Server running at port 8000.');
});

function initDb() {
  db.serialize(function () {
    db.exec(table);
  });
}