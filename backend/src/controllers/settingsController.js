import db from '../config/db.js';

// GET /api/settings
export const getSettings = async (req, res, next) => {
  try {
    const result = await db.execute('SELECT * FROM settings WHERE id = 1 LIMIT 1');
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Settings not found'
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings
export const updateSettings = async (req, res, next) => {
  try {
    const {
      village_name,
      logo_url,
      hero_image_url,
      phone_number,
      instagram_url,
      tiktok_url
    } = req.body;

    if (!village_name) {
      return res.status(400).json({
        status: 'error',
        message: 'village_name is required'
      });
    }

    // Execute update statement for ID = 1
    await db.execute({
      sql: `UPDATE settings 
            SET village_name = ?, logo_url = ?, hero_image_url = ?, phone_number = ?, instagram_url = ?, tiktok_url = ?
            WHERE id = 1`,
      args: [
        village_name,
        logo_url || null,
        hero_image_url || null,
        phone_number || null,
        instagram_url || null,
        tiktok_url || null
      ]
    });

    return res.status(200).json({
      message: 'Settings updated'
    });
  } catch (error) {
    next(error);
  }
};
