import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Recreate __filename and __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount modular routes under /
app.use('/', mainRouter);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found',
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  // Intercept SQLite/LibSQL database constraint errors
  if (err.code === 'SQLITE_CONSTRAINT' || (err.message && err.message.includes('constraint failed'))) {
    statusCode = 400;
    if (err.message.includes('UNIQUE constraint failed: users.username')) {
      message = 'Username sudah digunakan. Silakan pilih username lain.';
    } else if (err.message.includes('UNIQUE constraint failed')) {
      message = 'Data sudah ada di dalam sistem (terjadi duplikasi data).';
    } else if (err.message.includes('NOT NULL constraint failed')) {
      message = 'Mohon isi semua kolom wajib.';
    } else {
      message = `Gagal memproses data: Pelanggaran aturan database (${err.message})`;
    }
  }

  res.status(statusCode).json({
    status: 'error',
    message: message,
  });
});

// Start server if not running as a Vercel serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/`);
  });
}

export default app;

