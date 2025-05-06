const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'khwtdCM427!?',  
  database: 'events_db'             
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// GET all events (with joined category and organizer names)
app.get('/events', (req, res) => {
  const query = `
    SELECT 
      events.id,
      events.title,
      events.date,
      events.time,
      events.location,
      categories.name AS category,
      organizers.name AS organizer,
      events.description
    FROM events
    LEFT JOIN categories ON events.category_id = categories.id
    LEFT JOIN organizers ON events.organizer_id = organizers.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      res.status(500).send('Error fetching events');
    } else {
      res.json(results);
    }
  });
});

// GET all categories
app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).send('Error fetching categories');
    } else {
      res.json(results);
    }
  });
});

// GET all organizers
app.get('/organizers', (req, res) => {
  db.query('SELECT * FROM organizers', (err, results) => {
    if (err) {
      console.error('Error fetching organizers:', err);
      res.status(500).send('Error fetching organizers');
    } else {
      res.json(results);
    }
  });
});

// POST a new event
app.post('/events', (req, res) => {
  console.log('📩 Received:', req.body);

  const { title, date, time, location, category_id, organizer_id, description } = req.body;

  const query = `
    INSERT INTO events (title, date, time, location, category_id, organizer_id, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [title, date, time, location, category_id, organizer_id, description], (err, result) => {
    if (err) {
      console.error('❌ Error inserting event:', err);
      res.status(500).send('Error adding event');
    } else {
      res.status(201).json({ message: 'Event added' });
    }
  });
});

// DELETE all events
app.delete('/events', (req, res) => {
  db.query('DELETE FROM events', (err, result) => {
    if (err) {
      console.error('Error deleting events:', err);
      res.status(500).send('Error deleting events');
    } else {
      res.send('All events deleted');
    }
  });
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
