import { useEffect, useState } from "react";
import { Loader2, FileText } from "lucide-react";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil Data History
  useEffect(() => {
    fetch("http://localhost:3000/api/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  // Helper untuk memparsing tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 h-screen overflow-y-auto bg-gray-50 text-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <p className="text-gray-500">Laporan penjualan toko</p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">ID Transaksi</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Item Dibeli</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => {
                // Parsing JSON item string kembali jadi Array objek biar bisa dihitung
                const items = JSON.parse(trx.items);
                const itemsSummary = items.map((i) => `${i.name} (x${i.quantity})`).join(", ");

                return (
                  <tr key={trx.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">#{trx.id}</td>
                    <td className="px-6 py-4">{formatDate(trx.createdAt)}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={itemsSummary}>
                      {itemsSummary}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">{formatRupiah(trx.totalAmount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
