import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaList, FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const CATEGORIES = [
  { name: 'Dairy & Eggs', icon: '🥛' },
  { name: 'Fruits & Vegetables', icon: '🥬' },
  { name: 'Grains & Cereals', icon: '🌾' },
  { name: 'Beverages', icon: '🥤' },
  { name: 'Snacks', icon: '🍿' },
  { name: 'Cooking Essentials', icon: '🍳' },
  { name: 'Household', icon: '🏠' },
  { name: 'Meat & Fish', icon: '🥩' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20">
              <FaCartShopping className="text-lg text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Adish Hussain</span>
              <span className="block text-lg font-black tracking-tight text-gray-900 dark:text-slate-50">Smart Grocery Desk</span>
            </div>
          </Link>

          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Shop by Category
              <svg className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCategories && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCategories(false)} />
                <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => { setShowCategories(false); navigate(`/?category=${encodeURIComponent(cat.name)}`); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, milk, fruits, groceries..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-700 transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </form>

          <ThemeToggle />

          {user ? (
            <>
              <Link
                to="/list"
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  location.pathname === '/list'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <FaList className="text-sm" />
                <span className="hidden sm:inline">My List</span>
              </Link>
              <Link
                to="/cart"
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  location.pathname === '/cart'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <FaCartShopping className="text-sm" />
                <span className="hidden sm:inline">Cart</span>
              </Link>
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  <FaUser className="text-sm" />
                  <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                </button>
                <div className="invisible absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-gray-100 bg-white py-2 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100 dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-gray-100 px-4 py-2 dark:border-slate-800">
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <FaSignOutAlt className="text-xs" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="border-b border-gray-100 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/?category=${encodeURIComponent(cat.name)}`)}
              className="shrink-0 whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
            >
              <span className="mr-1.5">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
