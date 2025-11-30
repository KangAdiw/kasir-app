// server/prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Mulai seeding database...");

  // 1. Hapus data lama (agar tidak duplikat saat dijalankan ulang)
  await prisma.product.deleteMany();
  await prisma.transaction.deleteMany();

  // 2. Masukkan data produk baru
  await prisma.product.createMany({
    data: [
      {
        name: "Kopi Susu Gula Aren",
        price: 18000,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Americano Hot",
        price: 15000,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Iced Caramel Macchiato",
        price: 25000,
        category: "Coffee",
        image: "https://images.unsplash.com/photo-1485808191679-5f8c7c8606af?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Butter Croissant",
        price: 12000,
        category: "Snack",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Matcha Latte",
        price: 22000,
        category: "Non-Coffee",
        image: "https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&q=80&w=200",
      },
      {
        name: "Choco Muffin",
        price: 15000,
        category: "Snack",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=200",
      },
    ],
  });

  console.log("✅ Database berhasil diisi menu!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
