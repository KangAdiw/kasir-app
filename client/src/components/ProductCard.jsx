import React from "react";
import { Plus } from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  // HELPER: Format Rupiah (Standar Industry)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div
      // Saat kartu diklik, jalankan fungsi addToCart
      onClick={() => addToCart(product)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-blue-200 group"
    >
      {/* Gambar Produk */}
      <div className="h-32 w-full overflow-hidden">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
      </div>

      {/* Info Produk */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.category}</p>

        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-600 text-sm">{formatRupiah(product.price)}</span>

          {/* Tombol Plus Kecil */}
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Plus size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
