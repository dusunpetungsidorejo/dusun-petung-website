import db from '../config/db.js';

// GET /api/krb
export const getKrbStats = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM krb_statistics ORDER BY id ASC');
    const list = result.rows.map(row => ({
      id: row.id,
      category: row.category,
      name: row.name,
      value: row.value,
      unit: row.unit,
      updated_at: row.updated_at
    }));
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// POST /api/krb
export const createKrbStat = async (req, res, next) => {
  try {
    const { category, name, value, unit } = req.body;
    if (!category || name === undefined || value === undefined || !unit) {
      return res.status(400).json({
        status: 'error',
        message: 'Kategori, nama, nilai, dan satuan wajib diisi'
      });
    }
    const date = new Date().toISOString().split('T')[0];
    const result = await db.execute({
      sql: `INSERT INTO krb_statistics (category, name, value, unit, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
      args: [category, name, Number(value), unit, date]
    });
    const statId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null;
    return res.status(201).json({
      id: statId,
      category,
      name,
      value: Number(value),
      unit,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/krb/:id
export const updateKrbStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, name, value, unit } = req.body;
    if (!category || name === undefined || value === undefined || !unit) {
      return res.status(400).json({
        status: 'error',
        message: 'Kategori, nama, nilai, dan satuan wajib diisi'
      });
    }

    const check = await db.execute({
      sql: 'SELECT id FROM krb_statistics WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data statistik KRB tidak ditemukan'
      });
    }

    const date = new Date().toISOString().split('T')[0];
    await db.execute({
      sql: `UPDATE krb_statistics SET
              category = ?, name = ?, value = ?, unit = ?, updated_at = ?
            WHERE id = ?`,
      args: [category, name, Number(value), unit, date, id]
    });

    return res.status(200).json({
      id: Number(id),
      category,
      name,
      value: Number(value),
      unit,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/krb/:id
export const deleteKrbStat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const check = await db.execute({
      sql: 'SELECT id FROM krb_statistics WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Data statistik KRB tidak ditemukan'
      });
    }
    await db.execute({
      sql: 'DELETE FROM krb_statistics WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({
      status: 'success',
      message: 'Data statistik KRB berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
