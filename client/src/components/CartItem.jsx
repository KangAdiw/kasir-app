import React from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItem({ item, increase, decrease }) {
  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 bg-white">
      {/* Gambar Kecil */}
      <div className="h-16 w-16 rounded-md overflow-hidden shrink-0 border border-gray-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>

      {/* Info & Kontrol */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{item.name}</h4>
          <span className="font-bold text-sm text-blue-600">{formatRupiah(item.price * item.quantity)}</span>
        </div>

        {/* Tombol Plus Minus */}
        <div className="flex items-center gap-3 mt-2">
          <button onClick={() => decrease(item.id)} className="h-6 w-6 rounded bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors">
            {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
          </button>

          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>

          <button onClick={() => increase(item.id)} className="h-6 w-6 rounded bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors">
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
