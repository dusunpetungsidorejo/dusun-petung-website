import db from '../config/db.js';

// GET /api/demographics
export const getDemographics = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM demographics ORDER BY id ASC');
    const list = result.rows.map(row => ({
      id: row.id,
      icon: row.icon,
      value: row.value,
      label: row.label,
      updated_at: row.updated_at
    }));
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// POST /api/demographics
export const createDemographic = async (req, res, next) => {
  try {
    const { icon, value, label } = req.body;
    if (!icon || !value || !label) {
      return res.status(400).json({
        status: 'error',
        message: 'Icon, value, dan label wajib diisi'
      });
    }
    const date = new Date().toISOString().split('T')[0];
    const result = await db.execute({
      sql: `INSERT INTO demographics (icon, value, label, updated_at)
            VALUES (?, ?, ?, ?)`,
      args: [icon, value, label, date]
    });
    const demographicId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null;
    return res.status(201).json({
      id: demographicId,
      icon,
      value,
      label,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/demographics/:id
export const updateDemographic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { icon, value, label } = req.body;
    if (!icon || !value || !label) {
      return res.status(400).json({
        status: 'error',
        message: 'Icon, value, dan label wajib diisi'
      });
    }

    const check = await db.execute({
      sql: 'SELECT id FROM demographics WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data demografi tidak ditemukan'
      });
    }

    const date = new Date().toISOString().split('T')[0];
    await db.execute({
      sql: `UPDATE demographics SET
              icon = ?, value = ?, label = ?, updated_at = ?
            WHERE id = ?`,
      args: [icon, value, label, date, id]
    });

    return res.status(200).json({
      id: Number(id),
      icon,
      value,
      label,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/demographics/:id
export const deleteDemographic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const check = await db.execute({
      sql: 'SELECT id FROM demographics WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data demografi tidak ditemukan'
      });
    }
    await db.execute({
      sql: 'DELETE FROM demographics WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({
      status: 'success',
      message: 'Data demografi berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
