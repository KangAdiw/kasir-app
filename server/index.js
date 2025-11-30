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

// 4. CREATE PRODUCT (Tambah Menu Baru)
app.post("/api/products", async (req, res) => {
  const { name, price, category, image } = req.body;
  try {
    const newProduct = await prisma.product.create({
      data: { name, price, category, image },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Gagal menambah produk" });
  }
});

// 5. UPDATE PRODUCT (Edit Menu)
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image } = req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price, category, image },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Gagal update produk" });
  }
});

// 6. DELETE PRODUCT (Hapus Menu)
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Produk dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal hapus produk" });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server Kasir jalan di http://localhost:${PORT}`);
});
