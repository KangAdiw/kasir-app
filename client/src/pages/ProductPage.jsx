import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Mode Edit atau Tambah?
  const [currentId, setCurrentId] = useState(null); // ID produk yang sedang diedit

  // State Form Data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Coffee",
    image: "",
  });

  // 1. FETCH DATA (Load Awal)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  };

  // 2. HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ubah price jadi number, sisanya string
    setFormData({ ...formData, [name]: name === "price" ? parseInt(value) || 0 : value });
  };

  // 3. HANDLE SUBMIT (Bisa Create atau Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isEditing ? `http://localhost:3000/api/products/${currentId}` : "http://localhost:3000/api/products";

    const method = isEditing ? "PUT" : "POST";

    try {
      await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Reset & Refresh
      fetchProducts();
      closeModal();
      alert(isEditing ? "Produk berhasil diupdate!" : "Produk berhasil ditambah!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data");
    }
  };

  // 4. HANDLE DELETE
  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus menu ini?")) return;

    try {
      await fetch(`http://localhost:3000/api/products/${id}`, { method: "DELETE" });
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus");
    }
  };

  // Helper Modal
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: "", price: "", category: "Coffee", image: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Formatter Rupiah
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  return (
    <div className="p-6 h-screen overflow-y-auto bg-gray-50 text-gray-800 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-500">Tambah, Edit, atau Hapus Menu Toko</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200">
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 w-16">Image</th>
                <th className="px-6 py-3">Nama Produk</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Harga</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img src={item.image} alt="" className="h-10 w-10 rounded-md object-cover bg-gray-100" />
                  </td>
                  <td className="px-6 py-3 font-medium">{item.name}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{item.category}</span>
                  </td>
                  <td className="px-6 py-3 font-bold text-gray-700">{formatRupiah(item.price)}</td>
                  <td className="px-6 py-3 flex justify-center gap-2">
                    <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === MODAL FORM (POPUP) === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">{isEditing ? "Edit Produk" : "Tambah Produk Baru"}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                <input type="text" name="name" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                  <input type="number" name="price" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" value={formData.price} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select name="category" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.category} onChange={handleChange}>
                    <option value="Coffee">Coffee</option>
                    <option value="Non-Coffee">Non-Coffee</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                <input
                  type="text"
                  name="image"
                  required
                  placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={formData.image}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-400 mt-1">Gunakan link gambar dari Unsplash/Google Images dulu.</p>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                  <Save size={18} />
                  {isEditing ? "Simpan Perubahan" : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
