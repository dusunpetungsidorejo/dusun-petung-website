import db from '../config/db.js';

// --- CAMP PACKAGES CRUD ---

// GET /api/camp/packages
export const getCampPackages = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM camp_packages ORDER BY id ASC');
    const list = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      capacity: row.capacity,
      price: Number(row.price),
      description: row.description || '',
      active: Boolean(row.active),
      updated_at: row.updated_at
    }));
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// POST /api/camp/packages
export const createCampPackage = async (req, res, next) => {
  try {
    const { name, capacity, price, description, active } = req.body;
    if (!name || !capacity || price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama paket, kapasitas, dan harga wajib diisi'
      });
    }
    const date = new Date().toISOString().split('T')[0];
    const result = await db.execute({
      sql: `INSERT INTO camp_packages (name, capacity, price, description, active, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        name,
        capacity,
        Number(price),
        description || null,
        active ? 1 : 0,
        date
      ]
    });
    const packageId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null;
    return res.status(201).json({
      id: packageId,
      name,
      capacity,
      price: Number(price),
      description: description || '',
      active: !!active,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/camp/packages/:id
export const updateCampPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, capacity, price, description, active } = req.body;
    if (!name || !capacity || price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama paket, kapasitas, dan harga wajib diisi'
      });
    }

    const check = await db.execute({
      sql: 'SELECT id FROM camp_packages WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Paket camp tidak ditemukan'
      });
    }

    const date = new Date().toISOString().split('T')[0];
    await db.execute({
      sql: `UPDATE camp_packages SET
              name = ?, capacity = ?, price = ?, description = ?, active = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        name,
        capacity,
        Number(price),
        description || null,
        active ? 1 : 0,
        date,
        id
      ]
    });

    return res.status(200).json({
      id: Number(id),
      name,
      capacity,
      price: Number(price),
      description: description || '',
      active: !!active,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/camp/packages/:id
export const deleteCampPackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const check = await db.execute({
      sql: 'SELECT id FROM camp_packages WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Paket camp tidak ditemukan'
      });
    }
    await db.execute({
      sql: 'DELETE FROM camp_packages WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({
      status: 'success',
      message: 'Paket camp berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// --- CAMP RENTALS CRUD ---

// GET /api/camp/rentals
export const getCampRentals = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM camp_rentals ORDER BY category ASC, name ASC');
    const list = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      price: Number(row.price),
      active: Boolean(row.active),
      updated_at: row.updated_at
    }));
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// POST /api/camp/rentals
export const createCampRental = async (req, res, next) => {
  try {
    const { name, category, price, active } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama alat, kategori, dan tarif sewa wajib diisi'
      });
    }
    const date = new Date().toISOString().split('T')[0];
    const result = await db.execute({
      sql: `INSERT INTO camp_rentals (name, category, price, active, updated_at)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        name,
        category,
        Number(price),
        active ? 1 : 0,
        date
      ]
    });
    const rentalId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null;
    return res.status(201).json({
      id: rentalId,
      name,
      category,
      price: Number(price),
      active: !!active,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/camp/rentals/:id
export const updateCampRental = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, active } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama alat, kategori, dan tarif sewa wajib diisi'
      });
    }

    const check = await db.execute({
      sql: 'SELECT id FROM camp_rentals WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Alat sewa tidak ditemukan'
      });
    }

    const date = new Date().toISOString().split('T')[0];
    await db.execute({
      sql: `UPDATE camp_rentals SET
              name = ?, category = ?, price = ?, active = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        name,
        category,
        Number(price),
        active ? 1 : 0,
        date,
        id
      ]
    });

    return res.status(200).json({
      id: Number(id),
      name,
      category,
      price: Number(price),
      active: !!active,
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/camp/rentals/:id
export const deleteCampRental = async (req, res, next) => {
  try {
    const { id } = req.params;
    const check = await db.execute({
      sql: 'SELECT id FROM camp_rentals WHERE id = ?',
      args: [id]
    });
    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Alat sewa tidak ditemukan'
      });
    }
    await db.execute({
      sql: 'DELETE FROM camp_rentals WHERE id = ?',
      args: [id]
    });
    return res.status(200).json({
      status: 'success',
      message: 'Alat sewa berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
