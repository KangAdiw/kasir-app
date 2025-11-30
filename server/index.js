// server/index.js
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware
app.use(cors()); // Boleh diakses Frontend
app.use(express.json()); // Baca JSON body

// --- ROUTES ---

// 1. GET: Ambil Daftar Menu
app.get("/api/products", async (req, res) => {
  try {
    // Ambil semua data dari tabel product
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data produk" });
  }
});

// 2. POST: Simpan Transaksi (Checkout)
app.post("/api/transactions", async (req, res) => {
  const { totalAmount, paidAmount, change, items } = req.body;

  try {
    const transaction = await prisma.transaction.create({
      data: {
        totalAmount,
        paidAmount,
        change,
        // Kita simpan array barang sebagai string JSON sederhana
        items: JSON.stringify(items),
      },
    });
    console.log("Transaksi baru tersimpan:", transaction.id);
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menyimpan transaksi" });
  }
});

// 3. GET HISTORY: Ambil Riwayat Transaksi
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" }, // Urutkan dari yang terbaru
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil riwayat" });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server Kasir jalan di http://localhost:${PORT}`);
});
