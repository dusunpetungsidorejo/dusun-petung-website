import db from './db.js';
import bcrypt from 'bcrypt';

async function initDb() {
  console.log('Initializing database...');
  try {
    // 1. Create Users Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Administrator'
      );
    `);
    console.log('✓ Users table created or verified.');

    // 2. Create Settings Table (enforce id = 1)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        village_name TEXT NOT NULL,
        logo_url TEXT,
        hero_image_url TEXT,
        phone_number TEXT,
        instagram_url TEXT,
        tiktok_url TEXT
      );
    `);
    console.log('✓ Settings table created or verified.');

    // 3. Create Activities Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        uploaded_at TEXT NOT NULL
      );
    `);
    console.log('✓ Activities table created or verified.');

    // 4. Seed Default Admin User if empty
    const userCheck = await db.execute('SELECT COUNT(*) as count FROM users');
    const userCount = userCheck.rows[0].count;

    if (userCount === 0) {
      const defaultPassword = 'admin123';
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      await db.execute({
        sql: `INSERT INTO users (username, password, display_name, role) 
              VALUES (?, ?, ?, ?)`,
        args: ['admin', hashedPassword, 'Admin', 'Administrator']
      });
      console.log('✓ Seeded default admin user: admin / admin123');
    } else {
      console.log('• Users table is already seeded.');
    }

    // 5. Seed Default Settings if empty
    const settingsCheck = await db.execute('SELECT COUNT(*) as count FROM settings');
    const settingsCount = settingsCheck.rows[0].count;

    if (settingsCount === 0) {
      await db.execute({
        sql: `INSERT INTO settings (id, village_name, logo_url, hero_image_url, phone_number, instagram_url, tiktok_url)
              VALUES (1, ?, ?, ?, ?, ?, ?)`,
        args: [
          'Dusun Petung',
          'https://placehold.co/150', // placeholder logo
          'https://placehold.co/1200x600', // placeholder hero banner
          '08123456789',
          'https://instagram.com/dusunpetung',
          null
        ]
      });
      console.log('✓ Seeded default site settings.');
    } else {
      console.log('• Settings table is already seeded.');
    }

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('initDb.js')) {
  initDb().then(() => process.exit(0));
}

export default initDb;
