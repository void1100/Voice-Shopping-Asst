import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import startListening from '../helper/listening.utils';
import { getProductImage } from '../utils/productVisuals';
import { FaTrash, FaMicrophoneAlt, FaExchangeAlt, FaPlus, FaMinus } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { LuNotebookPen } from "react-icons/lu";
import { toast } from 'react-toastify';

const CATEGORY_COLORS = {
    dairy: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-200',
    produce: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-200',
    grains: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-200',
    beverages: 'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-200',
    snacks: 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-200',
    cooking: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-200',
    household: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-200',
    meat: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-200',
    uncategorized: 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-slate-500/10 dark:border-slate-500/20 dark:text-slate-300',
};

const List = () => {
    const [list, setList] = useState([]);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSubstitutes, setShowSubstitutes] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            setLoading(true);
            const res = await client.get('/list');
            setList(res.data.items || []);
        } catch (err) {
            toast.error('Failed to load your shopping list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchList(); }, []);

    const handleVoiceClick = () => {
        startListening(setListening, navigate, fetchList);
    };

    const handleDelete = async (itemId, itemName) => {
        try {
            await client.delete(`/list/${itemId}`);
            setList((prev) => prev.filter((item) => item.id !== itemId));
            toast.success(`"${itemName}" deleted`);
        } catch (err) {
            toast.error(`Failed to delete "${itemName}"`);
        }
    };

    const handleQuantity = async (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            handleDelete(item.id, item.name);
            return;
        }
        try {
            await client.put(`/list/${item.id}`, { quantity: newQty });
            setList((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, quantity: newQty } : entry));
        } catch (err) {
            toast.error('Failed to update quantity');
        }
    };

    const fetchSubstitutes = async (name) => {
        try {
            const res = await client.get(`/substitutes/${encodeURIComponent(name)}`);
            setShowSubstitutes({ name, substitutes: res.data.substitutes || [] });
        } catch (err) {
            setShowSubstitutes({ name, substitutes: [] });
        }
    };

    const filteredList = filter === 'all' ? list : list.filter((item) => item.category === filter);
    const categories = [...new Set(list.map((item) => item.category))];
    const totalItems = list.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-transparent">
            <div className="mx-auto max-w-5xl px-4 py-6">
                <div className="mb-5 rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="flex items-center gap-3 text-2xl font-black text-gray-900 dark:text-slate-50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 shadow-sm shadow-emerald-500/20">
                                    <FaCartShopping className="text-sm text-white" />
                                </div>
                                My Shopping List
                            </h1>
                            <p className="ml-13 mt-1 text-sm text-gray-400 dark:text-slate-500">
                                {totalItems} item{totalItems !== 1 ? 's' : ''} in your list
                            </p>
                        </div>
                        <button
                            onClick={handleVoiceClick}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                                listening
                                    ? 'animate-pulse bg-red-500 text-white shadow-md shadow-red-500/30'
                                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700'
                            }`}
                        >
                            <FaMicrophoneAlt className="text-sm" />
                            {listening ? 'Listening...' : 'Voice'}
                        </button>
                    </div>

                    {categories.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-slate-800">
                            <button
                                onClick={() => setFilter('all')}
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                                    filter === 'all'
                                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800'
                                }`}
                            >
                                All ({list.length})
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                                        filter === category
                                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                                            : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {category} ({list.filter((item) => item.category === category).length})
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {showSubstitutes && (
                    <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                                <FaExchangeAlt className="text-xs" /> Substitutes for "{showSubstitutes.name}"
                            </h4>
                            <button onClick={() => setShowSubstitutes(null)} className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300">x</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {showSubstitutes.substitutes.length > 0 ? (
                                showSubstitutes.substitutes.map((substitute, index) => (
                                    <button
                                        key={index}
                                        onClick={async () => {
                                            await client.post('/list', { name: substitute, category: '', quantity: 1, price: 0 });
                                            toast.success(`"${substitute}" added`);
                                            fetchList();
                                            setShowSubstitutes(null);
                                        }}
                                        className="rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-amber-500/20 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-600"
                                    >
                                        {substitute}
                                    </button>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 dark:text-slate-400">No substitutes available</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent"></div>
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800">
                                <LuNotebookPen className="text-2xl text-gray-300 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-gray-700 dark:text-slate-200">
                                {list.length === 0 ? 'Your list is empty' : 'No items in this category'}
                            </h3>
                            <p className="mb-4 text-sm text-gray-400 dark:text-slate-500">
                                {list.length === 0 ? 'Add items using voice or browse products' : 'Try a different filter'}
                            </p>
                            {list.length === 0 && (
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={handleVoiceClick}
                                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700"
                                    >
                                        <FaMicrophoneAlt /> Add by Voice
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredList.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/30 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-emerald-500/20 dark:hover:bg-slate-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={getProductImage(item.name, item.category)}
                                            alt={item.name}
                                            className="h-14 w-14 rounded-2xl border border-gray-200 object-cover dark:border-slate-700"
                                        />
                                        <div>
                                            <h3 className="text-sm font-semibold capitalize text-gray-800 dark:text-slate-100">{item.name}</h3>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium capitalize ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.uncategorized}`}>
                                                    {item.category}
                                                </span>
                                                {item.price > 0 && (
                                                    <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                                                        ₹{item.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                                            <button
                                                onClick={() => handleQuantity(item, -1)}
                                                className="px-2.5 py-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-slate-400 dark:hover:bg-red-500/10"
                                            >
                                                <FaMinus className="text-[10px]" />
                                            </button>
                                            <span className="min-w-[2rem] border-x border-gray-100 px-2.5 py-2 text-center text-sm font-bold text-gray-800 dark:border-slate-700 dark:text-slate-100">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantity(item, 1)}
                                                className="px-2.5 py-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                                            >
                                                <FaPlus className="text-[10px]" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => fetchSubstitutes(item.name)}
                                            className="rounded-xl border border-gray-200 p-2 text-gray-300 transition-all hover:border-amber-200 hover:bg-amber-50 hover:text-amber-500 dark:border-slate-700 dark:text-slate-500 dark:hover:border-amber-500/20 dark:hover:bg-amber-500/10"
                                            title="View substitutes"
                                        >
                                            <FaExchangeAlt className="text-xs" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className="rounded-xl border border-gray-200 p-2 text-gray-300 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:text-slate-500 dark:hover:border-red-500/20 dark:hover:bg-red-500/10"
                                            title={`Delete ${item.name}`}
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default List;
