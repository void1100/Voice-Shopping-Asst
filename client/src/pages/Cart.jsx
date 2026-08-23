import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMicrophoneAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { LuNotebookPen } from 'react-icons/lu';
import { toast } from 'react-toastify';
import client from '../api/client';
import startListening from '../helper/listening.utils';
import { getProductImage } from '../utils/productVisuals';

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

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await client.get('/cart');
            setCart(res.data || []);
        } catch (err) {
            toast.error('Failed to load your cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const handleVoiceClick = () => {
        startListening(setListening, navigate, fetchCart);
    };

    const handleDelete = async (itemId, itemName) => {
        try {
            await client.delete(`/cart/${itemId}`);
            setCart((prev) => prev.filter((item) => item.id !== itemId));
            toast.success(`"${itemName}" removed from cart`);
        } catch (err) {
            toast.error(`Failed to remove "${itemName}"`);
        }
    };

    const handleQuantity = async (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            handleDelete(item.id, item.name);
            return;
        }
        try {
            await client.put(`/cart/${item.id}`, { quantity: newQty });
            setCart((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, quantity: newQty } : entry));
        } catch (err) {
            toast.error('Failed to update quantity');
        }
    };

    const handleClear = async () => {
        if (!window.confirm('Clear your entire cart?')) return;
        try {
            await client.delete('/cart');
            setCart([]);
            toast.success('Cart cleared');
        } catch (err) {
            toast.error('Failed to clear cart');
        }
    };

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
                                My Cart
                            </h1>
                            <p className="ml-13 mt-1 text-sm text-gray-400 dark:text-slate-500">
                                {totalItems} item{totalItems !== 1 ? 's' : ''} · ₹{totalPrice.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex gap-2">
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
                            {cart.length > 0 && (
                                <button
                                    onClick={handleClear}
                                    className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-red-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:hover:bg-red-500/10"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent"></div>
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800">
                                <LuNotebookPen className="text-2xl text-gray-300 dark:text-slate-500" />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-gray-700 dark:text-slate-200">Your cart is empty</h3>
                            <p className="mb-4 text-sm text-gray-400 dark:text-slate-500">Add items from your shopping list or voice commands</p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={handleVoiceClick}
                                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-700"
                                >
                                    <FaMicrophoneAlt /> Add by Voice
                                </button>
                                <button
                                    onClick={() => navigate('/list')}
                                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    View Shopping List
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map((item) => (
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
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className="rounded-xl border border-gray-200 p-2 text-gray-300 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:text-slate-500 dark:hover:border-red-500/20 dark:hover:bg-red-500/10"
                                            title={`Remove ${item.name}`}
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

export default Cart;
