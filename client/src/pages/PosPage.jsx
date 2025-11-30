import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CartItem from "../components/CartItem";
import { ShoppingBag, Search, Loader2, X, ChevronDown, Coffee, UtensilsCrossed, CupSoda, LayoutGrid } from "lucide-react"; // Tambah Icon Kategori

export default function PosPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // === FITUR BARU: STATE PENCARIAN & KATEGORI ===
  const [keyword, setKeyword] = useState(""); // Menyimpan teks pencarian
  const [selectedCategory, setSelectedCategory] = useState("All"); // Menyimpan kategori aktif

  // List Kategori untuk tombol filter
  const categories = [
    { id: "All", label: "Semua", icon: LayoutGrid },
    { id: "Coffee", label: "Coffee", icon: Coffee },
    { id: "Non-Coffee", label: "Non-Coffee", icon: CupSoda },
    { id: "Snack", label: "Snack", icon: UtensilsCrossed },
  ];

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  // === FITUR BARU: LOGIKA FILTERING ===
  // Kita tidak me-render 'products' langsung, tapi 'filteredProducts'
  const filteredProducts = products.filter((product) => {
    // 1. Cek apakah nama produk mengandung keyword pencarian (Case insensitive)
    const matchKeyword = product.name.toLowerCase().includes(keyword.toLowerCase());

    // 2. Cek apakah kategori cocok (atau user pilih "All")
    const matchCategory = selectedCategory === "All" || product.category === selectedCategory;

    // Produk harus lolos KEDUA syarat
    return matchKeyword && matchCategory;
  });

  // ... (Bagian Cart Logic Add/Increase/Decrease SAMA PERSIS - Copy Paste atau biarkan yang lama)
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleIncrease = (id) => setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));

  const handleDecrease = (id) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      if (existingItem.quantity === 1) return prev.filter((item) => item.id !== id);
      return prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item));
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setProcessing(true);
    fetch("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: total, paidAmount: total, change: 0, items: cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        // 1. Panggil Fungsi Cetak Struk
        // Kita kirim data yang dibutuhkan: ID, Array Cart, Total Harga, Tanggal Skrg
        const today = new Date().toLocaleString("id-ID");
        printReceipt(data.id, cart, total, today);

        // 2. Reset Aplikasi
        setCart([]);
        setProcessing(false);
        setShowMobileCart(false);
      })
      .catch((err) => {
        console.error(err);
        setProcessing(false);
      });
  };

  return (
    <div className="flex w-full h-full md:h-screen bg-gray-50 text-gray-800 relative">
      {/* BAGIAN KATALOG (KIRI) */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full pb-24 md:pb-0">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">KasirKu ☕</h1>
            <p className="text-gray-500 text-xs md:text-sm">Silakan pilih menu pesanan</p>
          </div>

          {/* SEARCH BAR YANG SUDAH BERFUNGSI */}
          <div className="bg-white border rounded-full px-4 py-2 flex items-center gap-2 text-sm w-full md:w-64 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu (ex: Kopi)..."
              className="outline-none w-full bg-transparent"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)} // Update state saat mengetik
            />
            {/* Tombol Clear Search (Muncul jika ada text) */}
            {keyword && (
              <button onClick={() => setKeyword("")} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* FITUR BARU: TOMBOL KATEGORI */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                        ${selectedCategory === cat.id ? "bg-gray-900 text-white shadow-md transform scale-105" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}
                    `}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid Produk */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Jika hasil pencarian kosong */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p>Tidak ada menu yang cocok dengan "{keyword}"</p>
                <button
                  onClick={() => {
                    setKeyword("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-blue-600 hover:underline text-sm"
                >
                  Reset Pencarian
                </button>
              </div>
            ) : (
              /* Jika ada hasil, tampilkan grid */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 animate-in fade-in zoom-in duration-300">
                {filteredProducts.map((item) => (
                  <ProductCard key={item.id} product={item} addToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ... (BAGIAN CART DESKTOP & MOBILE SAMA PERSIS SEPERTI SEBELUMNYA) ... */}
      <div className="hidden md:flex w-[350px] bg-white border-l border-gray-200 h-screen flex-col shadow-xl z-20">
        <CartContent cart={cart} total={total} processing={processing} handleIncrease={handleIncrease} handleDecrease={handleDecrease} handleCheckout={handleCheckout} formatRupiah={formatRupiah} />
      </div>

      {cart.length > 0 && !showMobileCart && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-30 animate-in slide-in-from-bottom-5">
          <button onClick={() => setShowMobileCart(true)} className="w-full bg-gray-900 text-white p-4 rounded-xl shadow-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white text-gray-900 h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm">{totalQty}</div>
              <span className="font-medium text-sm">Lihat Keranjang</span>
            </div>
            <span className="font-bold">{formatRupiah(total)}</span>
          </button>
        </div>
      )}

      {showMobileCart && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-10">
          <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
            <h2 className="font-bold text-lg">Pesanan ({totalQty} item)</h2>
            <button onClick={() => setShowMobileCart(false)} className="p-2 bg-gray-100 rounded-full">
              <ChevronDown />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <CartContent cart={cart} total={total} processing={processing} handleIncrease={handleIncrease} handleDecrease={handleDecrease} handleCheckout={handleCheckout} formatRupiah={formatRupiah} />
          </div>
        </div>
      )}
    </div>
  );
}

// Pastikan CartContent tetap ada di file ini (di bagian bawah) seperti sebelumnya
function CartContent({ cart, total, processing, handleIncrease, handleDecrease, handleCheckout, formatRupiah }) {
  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
        <ShoppingBag size={64} className="mb-4 text-gray-300" />
        <p>Keranjang kosong</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} increase={handleIncrease} decrease={handleDecrease} />
        ))}
      </div>
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between font-bold text-lg mb-4 text-gray-900">
          <span>Total Bayar</span>
          <span>{formatRupiah(total)}</span>
        </div>
        <button onClick={handleCheckout} disabled={processing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200">
          {processing ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </div>
    </>
  );
}

// === HELPER: FUNGSI CETAK STRUK ===
const printReceipt = (transactionId, items, total, date) => {
  // 1. Buka jendela popup baru
  const printWindow = window.open("", "", "width=400,height=600");

  // 2. Desain HTML Struk (Mirip kertas thermal 58mm)
  const receiptHTML = `
    <html>
      <head>
        <title>Struk #${transactionId}</title>
        <style>
          body { font-family: 'Courier New', monospace; font-size: 12px; width: 300px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .total { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
          .footer { text-align: center; margin-top: 20px; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin:0">KASIRKU COFFEE</h2>
          <p>Jl. Coding No. 1, Jakarta</p>
          <p>${date}</p>
          <p>ID: #${transactionId}</p>
        </div>

        <div class="items">
          ${items
            .map(
              (item) => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>${new Intl.NumberFormat("id-ID").format(item.price * item.quantity)}</span>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="divider"></div>

        <div class="total">
          <span>TOTAL</span>
          <span>Rp ${new Intl.NumberFormat("id-ID").format(total)}</span>
        </div>

        <div class="footer">
          <p>Terima Kasih!</p>
          <p>Barang yang dibeli tidak dapat ditukar</p>
        </div>
        
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;

  // 3. Tulis HTML ke jendela baru & Cetak
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
};
