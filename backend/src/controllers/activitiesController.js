import db from '../config/db.js';

// GET /api/activities
export const getActivities = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM activities ORDER BY id DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// POST /api/activities
export const createActivity = async (req, res, next) => {
  try {
    const { title, description, image_url, uploaded_at } = req.body;

    if (!title) {
      return res.status(400).json({
        status: 'error',
        message: 'title is required'
      });
    }

    // Default to today's date if uploaded_at is not provided
    const date = uploaded_at || new Date().toISOString().split('T')[0];

    const result = await db.execute({
      sql: `INSERT INTO activities (title, description, image_url, uploaded_at) 
            VALUES (?, ?, ?, ?)`,
      args: [title, description || null, image_url || null, date]
    });

    // lastInsertRowid might be a BigInt, convert it to Number safely
    const activityId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null;

    return res.status(201).json({
      activity_id: activityId
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/activities/:id
export const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.execute({
      sql: 'DELETE FROM activities WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Activity not found'
      });
    }

    return res.status(200).json({
      message: 'Activity deleted'
    });
  } catch (error) {
    next(error);
  }
};
