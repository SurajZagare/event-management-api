const pool = require('../models/db');
const moment = require('moment');

exports.createEvent = async (req, res) => {
    const { title, date_time, location, capacity } = req.body;

    if (!title || !date_time || !location || !capacity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (capacity <= 0 || capacity > 1000) {
        return res.status(400).json({ error: "Capacity must be between 1 and 1000" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id',
            [title, date_time, location, capacity]
        );
        res.status(201).json({ event_id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEventDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (event.rows.length === 0) return res.status(404).json({ error: "Event not found" });

        const users = await pool.query(
            `SELECT u.id, u.name, u.email FROM users u
             JOIN registrations r ON u.id = r.user_id
             WHERE r.event_id = $1`,
            [id]
        );

        res.json({ ...event.rows[0], registered_users: users.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.registerUser = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (event.rows.length === 0) return res.status(404).json({ error: "Event not found" });

        const now = moment();
        if (moment(event.rows[0].date_time).isBefore(now)) {
            return res.status(400).json({ error: "Cannot register for past event" });
        }

        const existing = await pool.query(
            'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
            [user_id, id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "User already registered" });
        }

        const count = await pool.query(
            'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
            [id]
        );
        if (parseInt(count.rows[0].count) >= event.rows[0].capacity) {
            return res.status(400).json({ error: "Event is full" });
        }

        await pool.query(
            'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)',
            [user_id, id]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.cancelRegistration = async (req, res) => {
    const { id, userId } = req.params;
    try {
        const reg = await pool.query(
            'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *',
            [userId, id]
        );
        if (reg.rowCount === 0) {
            return res.status(400).json({ error: "User was not registered" });
        }
        res.json({ message: "Registration cancelled" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listUpcomingEvents = async (req, res) => {
    try {
        const now = moment().toISOString();
        const result = await pool.query(
            'SELECT * FROM events WHERE date_time > $1',
            [now]
        );
        const sorted = result.rows.sort((a, b) => {
            const dateCompare = new Date(a.date_time) - new Date(b.date_time);
            if (dateCompare !== 0) return dateCompare;
            return a.location.localeCompare(b.location);
        });
        res.json(sorted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEventStats = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (event.rows.length === 0) return res.status(404).json({ error: "Event not found" });

        const total = await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [id]);
        const totalReg = parseInt(total.rows[0].count);
        const capacity = event.rows[0].capacity;
        const percent = ((totalReg / capacity) * 100).toFixed(2);

        res.json({
            total_registrations: totalReg,
            remaining_capacity: capacity - totalReg,
            percent_full: `${percent}%`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
