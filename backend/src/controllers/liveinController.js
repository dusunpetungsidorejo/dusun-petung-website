import db from '../config/db.js';

// GET /api/livein
export const getLiveInHouses = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM livein ORDER BY id DESC');
    // Format JSON fields back to arrays/objects for frontend convenience
    const formatted = result.rows.map(row => {
      let gallery = [];
      let facilities = [];
      let experiences = [];
      try {
        gallery = row.gallery ? JSON.parse(row.gallery) : [];
      } catch (e) {
        gallery = [];
      }
      try {
        facilities = row.facilities ? JSON.parse(row.facilities) : [];
      } catch (e) {
        facilities = [];
      }
      try {
        experiences = row.experiences ? JSON.parse(row.experiences) : [];
      } catch (e) {
        experiences = [];
      }

      return {
        ...row,
        gallery,
        facilities,
        experiences,
        overnight_active: !!row.overnight_active,
        hour24_active: !!row.hour24_active
      };
    });
    return res.status(200).json(formatted);
  } catch (error) {
    next(error);
  }
};

// POST /api/livein
export const createLiveInHouse = async (req, res, next) => {
  try {
    const {
      name,
      owner,
      cover_image,
      gallery,
      description,
      highlight,
      overnight_active,
      overnight_price,
      overnight_checkin,
      overnight_checkout,
      hour24_active,
      hour24_price,
      hour24_description,
      pricing_type,
      min_guests,
      max_guests,
      facilities,
      facilities_other,
      experiences,
      experiences_other,
      status
    } = req.body;

    if (!name || !owner) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama rumah dan pemilik wajib diisi'
      });
    }

    const date = new Date().toISOString().split('T')[0];

    const result = await db.execute({
      sql: `INSERT INTO livein (
              name, owner, cover_image, gallery, description, highlight,
              overnight_active, overnight_price, overnight_checkin, overnight_checkout,
              hour24_active, hour24_price, hour24_description, pricing_type,
              min_guests, max_guests, facilities, facilities_other,
              experiences, experiences_other, status, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        name,
        owner,
        cover_image || null,
        gallery ? JSON.stringify(gallery) : '[]',
        description || null,
        highlight || null,
        overnight_active ? 1 : 0,
        overnight_price !== undefined ? Number(overnight_price) : null,
        overnight_checkin || null,
        overnight_checkout || null,
        hour24_active ? 1 : 0,
        hour24_price !== undefined ? Number(hour24_price) : null,
        hour24_description || null,
        pricing_type || 'house',
        min_guests !== undefined ? Number(min_guests) : null,
        max_guests !== undefined ? Number(max_guests) : null,
        facilities ? JSON.stringify(facilities) : '[]',
        facilities_other || null,
        experiences ? JSON.stringify(experiences) : '[]',
        experiences_other || null,
        status || 'Available',
        date
      ]
    });

    const houseId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : null;

    return res.status(201).json({
      id: houseId,
      name,
      owner,
      cover_image: cover_image || null,
      gallery: gallery || [],
      description: description || null,
      highlight: highlight || null,
      overnight_active: !!overnight_active,
      overnight_price: overnight_price !== undefined ? Number(overnight_price) : null,
      overnight_checkin: overnight_checkin || null,
      overnight_checkout: overnight_checkout || null,
      hour24_active: !!hour24_active,
      hour24_price: hour24_price !== undefined ? Number(hour24_price) : null,
      hour24_description: hour24_description || null,
      pricing_type: pricing_type || 'house',
      min_guests: min_guests !== undefined ? Number(min_guests) : null,
      max_guests: max_guests !== undefined ? Number(max_guests) : null,
      facilities: facilities || [],
      facilities_other: facilities_other || null,
      experiences: experiences || [],
      experiences_other: experiences_other || null,
      status: status || 'Available',
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/livein/:id
export const updateLiveInHouse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      owner,
      cover_image,
      gallery,
      description,
      highlight,
      overnight_active,
      overnight_price,
      overnight_checkin,
      overnight_checkout,
      hour24_active,
      hour24_price,
      hour24_description,
      pricing_type,
      min_guests,
      max_guests,
      facilities,
      facilities_other,
      experiences,
      experiences_other,
      status
    } = req.body;

    if (!name || !owner) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama rumah dan pemilik wajib diisi'
      });
    }

    const check = await db.execute({
      sql: 'SELECT id FROM livein WHERE id = ?',
      args: [id]
    });

    if (check.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Rumah Live In tidak ditemukan'
      });
    }

    const date = new Date().toISOString().split('T')[0];

    await db.execute({
      sql: `UPDATE livein SET 
              name = ?, owner = ?, cover_image = ?, gallery = ?, description = ?, highlight = ?,
              overnight_active = ?, overnight_price = ?, overnight_checkin = ?, overnight_checkout = ?,
              hour24_active = ?, hour24_price = ?, hour24_description = ?, pricing_type = ?,
              min_guests = ?, max_guests = ?, facilities = ?, facilities_other = ?,
              experiences = ?, experiences_other = ?, status = ?, updated_at = ?
            WHERE id = ?`,
      args: [
        name,
        owner,
        cover_image || null,
        gallery ? JSON.stringify(gallery) : '[]',
        description || null,
        highlight || null,
        overnight_active ? 1 : 0,
        overnight_price !== undefined ? Number(overnight_price) : null,
        overnight_checkin || null,
        overnight_checkout || null,
        hour24_active ? 1 : 0,
        hour24_price !== undefined ? Number(hour24_price) : null,
        hour24_description || null,
        pricing_type || 'house',
        min_guests !== undefined ? Number(min_guests) : null,
        max_guests !== undefined ? Number(max_guests) : null,
        facilities ? JSON.stringify(facilities) : '[]',
        facilities_other || null,
        experiences ? JSON.stringify(experiences) : '[]',
        experiences_other || null,
        status || 'Available',
        date,
        id
      ]
    });

    return res.status(200).json({
      id: Number(id),
      name,
      owner,
      cover_image: cover_image || null,
      gallery: gallery || [],
      description: description || null,
      highlight: highlight || null,
      overnight_active: !!overnight_active,
      overnight_price: overnight_price !== undefined ? Number(overnight_price) : null,
      overnight_checkin: overnight_checkin || null,
      overnight_checkout: overnight_checkout || null,
      hour24_active: !!hour24_active,
      hour24_price: hour24_price !== undefined ? Number(hour24_price) : null,
      hour24_description: hour24_description || null,
      pricing_type: pricing_type || 'house',
      min_guests: min_guests !== undefined ? Number(min_guests) : null,
      max_guests: max_guests !== undefined ? Number(max_guests) : null,
      facilities: facilities || [],
      facilities_other: facilities_other || null,
      experiences: experiences || [],
      experiences_other: experiences_other || null,
      status: status || 'Available',
      updated_at: date
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/livein/:id
export const deleteLiveInHouse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.execute({
      sql: 'DELETE FROM livein WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Rumah Live In tidak ditemukan'
      });
    }

    return res.status(200).json({
      message: 'Rumah Live In berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
