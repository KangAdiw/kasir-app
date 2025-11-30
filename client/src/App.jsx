import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Menu as MenuIcon } from "lucide-react";
import PosPage from "./pages/PosPage";
import TransactionPage from "./pages/TransactionPage";

// 1. KOMPONEN SIDEBAR (Hanya muncul di Laptop/Desktop -> md:flex)
function Sidebar() {
  const location = useLocation();
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 p-3 rounded-xl transition-colors ${isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`;
  };

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 h-screen flex-col p-4 shrink-0 sticky top-0">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
        <span className="font-bold text-xl text-gray-800">KasirKu</span>
      </div>
      <nav className="space-y-2">
        <Link to="/" className={getLinkClass("/")}>
          <ShoppingCart size={20} />
          <span className="font-medium">Kasir</span>
        </Link>
        <Link to="/history" className={getLinkClass("/history")}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Riwayat</span>
        </Link>
      </nav>
    </aside>
  );
}

// 2. KOMPONEN BOTTOM NAV (Hanya muncul di HP -> md:hidden)
function MobileBottomNav() {
  const location = useLocation();
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors ${isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50 shadow-lg pb-safe">
      <Link to="/" className={getLinkClass("/")}>
        <ShoppingCart size={24} className={location.pathname === "/" ? "fill-current" : ""} />
        <span>Kasir</span>
      </Link>
      <Link to="/history" className={getLinkClass("/history")}>
        <LayoutDashboard size={24} className={location.pathname === "/history" ? "fill-current" : ""} />
        <span>Riwayat</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 pb-16 md:pb-0">
        {/* pb-16 di mobile supaya konten tidak tertutup Bottom Nav */}

        <Sidebar />

        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<PosPage />} />
            <Route path="/history" element={<TransactionPage />} />
          </Routes>
        </main>

        <MobileBottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
