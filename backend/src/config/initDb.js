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

    // Create Live In Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS livein (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner TEXT NOT NULL,
        cover_image TEXT,
        gallery TEXT,
        description TEXT,
        highlight TEXT,
        overnight_active INTEGER DEFAULT 0,
        overnight_price REAL,
        overnight_checkin TEXT,
        overnight_checkout TEXT,
        hour24_active INTEGER DEFAULT 0,
        hour24_price REAL,
        hour24_description TEXT,
        pricing_type TEXT DEFAULT 'house',
        min_guests INTEGER,
        max_guests INTEGER,
        facilities TEXT,
        facilities_other TEXT,
        experiences TEXT,
        experiences_other TEXT,
        status TEXT NOT NULL DEFAULT 'Available',
        updated_at TEXT NOT NULL
      );
    `);
    console.log('✓ Live In table created or verified.');

    // Create Live In Packages Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS livein_packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        pricing_type TEXT DEFAULT 'person',
        description TEXT,
        facilities TEXT,
        icon TEXT DEFAULT 'clock',
        active INTEGER DEFAULT 1,
        updated_at TEXT NOT NULL
      );
    `);
    console.log('✓ Live In Packages table created or verified.');

    // Seed Default Packages if empty
    const packageCheck = await db.execute('SELECT COUNT(*) as count FROM livein_packages');
    const packageCount = packageCheck.rows[0].count;
    if (packageCount === 0) {
      const date = new Date().toISOString().split('T')[0];
      await db.execute({
        sql: `INSERT INTO livein_packages (name, price, pricing_type, description, facilities, icon, active, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          'Paket Menginap Semalam (Overnight)',
          150000,
          'per orang',
          'Paket menginap semalam (check-out pagi/siang berikutnya). Cocok untuk istirahat dan berburu sunrise di Gumuk Petung Camp.',
          JSON.stringify([
            'Kamar tidur pribadi bersih',
            'Kamar mandi & air bersih',
            'Sprei & selimut hangat',
            'Teh jahe hangat / kopi',
            'Welcome snack lokal',
            'Area parkir kendaraan aman'
          ]),
          'sun',
          1,
          date
        ]
      });

      await db.execute({
        sql: `INSERT INTO livein_packages (name, price, pricing_type, description, facilities, icon, active, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          'Paket 24 Jam (Full Day)',
          250000,
          'per orang',
          'Pengalaman 24 jam membaur dengan warga. Ikuti langsung aktivitas keseharian seperti bertani, berkebun, dan beternak.',
          JSON.stringify([
            'Kamar tidur pribadi bersih',
            'Makan 3x sehari bersama warga',
            'Ikut aktivitas berkebun/ternak',
            'Air bersih pegunungan',
            'Welcome drink & jajanan lokal',
            'Area parkir kendaraan aman'
          ]),
          'clock',
          1,
          date
        ]
      });
      console.log('✓ Seeded default livein packages.');
    }


    // 4. Seed Default Admin User if empty
    const userCheck = await db.execute('SELECT COUNT(*) as count FROM users');
    const userCount = userCheck.rows[0].count;

    if (userCount === 0) {
      const defaultPassword = 'PetungSidorejo!';
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      await db.execute({
        sql: `INSERT INTO users (username, password, display_name, role) 
              VALUES (?, ?, ?, ?)`,
        args: ['admin_petung', hashedPassword, 'Admin Petung', 'Administrator']
      });
      console.log('✓ Seeded default admin user: admin_petung / PetungSidorejo!');
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
          '085138097972',
          'https://instagram.com/dusunpetung',
          null
        ]
      });
      console.log('✓ Seeded default site settings.');
    } else {
      console.log('• Settings table is already seeded.');
    }

    // 6. Create Camp Tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS camp_packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        capacity TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        active INTEGER DEFAULT 1,
        updated_at TEXT NOT NULL
      );
    `);
    console.log('✓ Camp Packages table created or verified.');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS camp_rentals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        active INTEGER DEFAULT 1,
        updated_at TEXT NOT NULL
      );
    `);
    console.log('✓ Camp Rentals table created or verified.');

    // Create Demographics Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS demographics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT NOT NULL,
        value TEXT NOT NULL,
        label TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    console.log('✓ Demographics table created or verified.');

    // Seed default demographics if empty
    const demoCheck = await db.execute('SELECT COUNT(*) as count FROM demographics');
    if (demoCheck.rows[0].count === 0) {
      const date = new Date().toISOString().split('T')[0];
      const defaultDemos = [
        { icon: 'Users', value: '3.247', label: 'Jiwa Penduduk' },
        { icon: 'Home', value: '892', label: 'Kepala Keluarga' },
        { icon: 'Map', value: '485 Ha', label: 'Luas Wilayah' },
        { icon: 'Building2', value: '1 RW / 2 RT', label: 'Pembagian Administrasi' }
      ];
      for (const d of defaultDemos) {
        await db.execute({
          sql: `INSERT INTO demographics (icon, value, label, updated_at)
                VALUES (?, ?, ?, ?)`,
          args: [d.icon, d.value, d.label, date]
        });
      }
      console.log('✓ Seeded default demographics.');
    }

    // Seed camp_packages if empty
    const campPackageCheck = await db.execute('SELECT COUNT(*) as count FROM camp_packages');
    if (campPackageCheck.rows[0].count === 0) {
      const date = new Date().toISOString().split('T')[0];
      const defaultCampPkgs = [
        { name: 'Paket Small', capacity: 'Kapasitas 4 Orang', price: 185000, description: 'Tenda 4p, 2 Matras (2x2m), 4 Selimut, Lampu Tenda, HTM' },
        { name: 'Paket Medium', capacity: 'Kapasitas 4 Orang', price: 210000, description: 'Paket Small + Cooking Set (Kompor, Gas, Nesting)' },
        { name: 'Paket Large', capacity: 'Kapasitas 4 Orang', price: 265000, description: 'Paket Medium + 1 Meja Lipat & 4 Kursi Lipat' },
        { name: 'Paket Small', capacity: 'Kapasitas 10 Orang', price: 425000, description: 'Tenda 10p, 4 Matras (2x2m), 10 Selimut, Lampu Tenda, HTM' },
        { name: 'Paket Medium', capacity: 'Kapasitas 10 Orang', price: 460000, description: 'Paket Small + Cooking Set (Kompor, Gas, Nesting)' },
        { name: 'Paket Large', capacity: 'Kapasitas 10 Orang', price: 560000, description: 'Paket Medium + 2 Meja Lipat & 8 Kursi Lipat' }
      ];
      for (const p of defaultCampPkgs) {
        await db.execute({
          sql: `INSERT INTO camp_packages (name, capacity, price, description, active, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)`,
          args: [p.name, p.capacity, p.price, p.description, 1, date]
        });
      }
      console.log('✓ Seeded default camp packages.');
    }

    // Seed camp_rentals if empty
    const campRentalCheck = await db.execute('SELECT COUNT(*) as count FROM camp_rentals');
    if (campRentalCheck.rows[0].count === 0) {
      const date = new Date().toISOString().split('T')[0];
      const defaultCampRentals = [
        // Tenda & Perlengkapan Tidur
        { name: 'Tenda Kapasitas 8–10 Orang', category: 'Tenda & Perlengkapan Tidur', price: 150000 },
        { name: 'Tenda Kapasitas 4 Orang', category: 'Tenda & Perlengkapan Tidur', price: 65000 },
        { name: 'Sleeping Bag', category: 'Tenda & Perlengkapan Tidur', price: 15000 },
        { name: 'Matras (2m x 2m)', category: 'Tenda & Perlengkapan Tidur', price: 10000 },
        { name: 'Selimut', category: 'Tenda & Perlengkapan Tidur', price: 10000 },
        { name: 'Flysheet', category: 'Tenda & Perlengkapan Tidur', price: 10000 },
        { name: 'Hammock', category: 'Tenda & Perlengkapan Tidur', price: 10000 },
        // Peralatan Memasak
        { name: 'Kompor Portable Besar', category: 'Peralatan Memasak', price: 20000 },
        { name: 'Kompor Portable Kecil', category: 'Peralatan Memasak', price: 10000 },
        { name: 'Cooking Nesting', category: 'Peralatan Memasak', price: 10000 },
        { name: 'Grill Pan', category: 'Peralatan Memasak', price: 10000 },
        { name: 'Gas Portable', category: 'Peralatan Memasak', price: 10000 },
        // Furnitur
        { name: 'Meja Lipat', category: 'Furnitur', price: 20000 },
        { name: 'Kursi Lipat', category: 'Furnitur', price: 10000 },
        // Lain-lain
        { name: 'Kayu Bakar', category: 'Lain-lain', price: 45000 },
        { name: 'Lampu Tenda', category: 'Lain-lain', price: 10000 },
        { name: 'Rol Kabel', category: 'Lain-lain', price: 5000 }
      ];
      for (const r of defaultCampRentals) {
        await db.execute({
          sql: `INSERT INTO camp_rentals (name, category, price, active, updated_at)
                VALUES (?, ?, ?, ?, ?)`,
          args: [r.name, r.category, r.price, 1, date]
        });
      }
      console.log('✓ Seeded default camp rentals.');
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
