import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import client from '../api/client';
import startListening from '../helper/listening.utils';
import { getProductImage, getProductImageOverlay } from '../utils/productVisuals';
import { FaSearch, FaMicrophone, FaLeaf, FaExchangeAlt, FaLanguage, FaHeart, FaPlus, FaBolt, FaArrowLeft } from "react-icons/fa";
import { MdHearing, MdLocalGroceryStore } from "react-icons/md";

const LANGUAGES = [
    { code: 'en-US', label: 'English', short: 'EN' },
    { code: 'hi-IN', label: 'Hindi', short: 'HI' },
    { code: 'es-ES', label: 'Spanish', short: 'ES' },
    { code: 'fr-FR', label: 'French', short: 'FR' },
    { code: 'de-DE', label: 'German', short: 'DE' },
    { code: 'ja-JP', label: 'Japanese', short: 'JA' },
];

const CATEGORY_EMOJIS = {
    dairy: '🥛', produce: '🥬', grains: '🌾', beverages: '🥤',
    snacks: '🍿', cooking: '🍳', household: '🏠', meat: '🥩', uncategorized: '📦',
};

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

const ProductCard = ({ item, onAdd, onSubstitutes, index }) => {
    const [faved, setFaved] = useState(false);
    const imageSrc = getProductImage(item.name, item.category);
    const imageOverlay = getProductImageOverlay(item.category);
    const displayPrice = item.price > 0 ? item.price : 49.99;

    return (
        <article className="group overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="relative isolate min-h-[190px] overflow-hidden">
                {index % 3 === 0 && (
                    <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 shadow-sm backdrop-blur dark:bg-slate-900/85 dark:text-emerald-300">
                        curated pick
                    </div>
                )}
                <img
                    src={imageSrc}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${imageOverlay}`} />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/75">Fresh pick</p>
                        <h3 className="mt-1 text-2xl font-black text-white capitalize drop-shadow-sm">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/85 dark:text-slate-200">
                        <FaBolt className="text-emerald-500" /> 10 mins
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${CATEGORY_COLORS[item.category] || CATEGORY_COLORS.uncategorized}`}>
                        {CATEGORY_EMOJIS[item.category] || '📦'} {item.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">{item.reason || 'Recommended for you'}</span>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400 dark:text-slate-500">Estimated price</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-gray-900 dark:text-slate-50">₹{displayPrice.toFixed(2)}</span>
                            <span className="text-sm text-gray-400 line-through dark:text-slate-500">₹{(displayPrice * 1.2).toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setFaved(!faved)}
                        className={`rounded-2xl border p-3 transition-all ${faved ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-500/20 dark:bg-red-500/10' : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-red-200 hover:text-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}
                        title="Save item"
                    >
                        <FaHeart />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onAdd(item.name, item.category)}
                        className="flex-1 rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500 dark:hover:text-white"
                    >
                        <span className="inline-flex items-center gap-2">
                            <FaPlus className="text-[10px]" /> Add to List
                        </span>
                    </button>
                    {onSubstitutes && (
                        <button
                            onClick={() => onSubstitutes(item.name)}
                            className="rounded-2xl border border-gray-200 bg-white p-3 text-gray-400 transition-colors hover:border-amber-200 hover:bg-amber-50 hover:text-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-500/20 dark:hover:bg-amber-500/10"
                            title="View substitutes"
                        >
                            <FaExchangeAlt />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

const Home = () => {
    const [listening, setListening] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [seasonal, setSeasonal] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showSubstitutes, setShowSubstitutes] = useState(null);
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialQuery = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlPriceMin = searchParams.get('price_min') || '';
    const urlPriceMax = searchParams.get('price_max') || '';
    const urlTags = searchParams.get('tags') || '';
    const [priceMin, setPriceMin] = useState(urlPriceMin);
    const [priceMax, setPriceMax] = useState(urlPriceMax);
    const [activeTags, setActiveTags] = useState(urlTags ? urlTags.split(',') : []);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(urlCategory);

    useEffect(() => {
        if (urlCategory) {
            setActiveCategory(urlCategory);
            fetchCategoryProducts(urlCategory);
        } else {
            setActiveCategory('');
            setCategoryProducts([]);
        }
        if (initialQuery) {
            setSearchQuery(initialQuery);
            setPriceMin(urlPriceMin);
            setPriceMax(urlPriceMax);
            setActiveTags(urlTags ? urlTags.split(',') : []);
            handleSearch(null, initialQuery, urlPriceMin, urlPriceMax);
        }
        fetchSuggestions();
    }, [initialQuery, urlCategory, urlPriceMin, urlPriceMax, urlTags]);

    const fetchCategoryProducts = async (cat) => {
        try {
            const res = await client.get(`/products?category=${encodeURIComponent(cat)}`);
            setCategoryProducts(res.data.products || []);
        } catch (err) {
            console.error('Failed to fetch category products:', err);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const res = await client.get('/suggestions');
            setSuggestions(res.data.suggestions || []);
            setSeasonal(res.data.seasonal || []);
        } catch (err) {
            console.error('Failed to fetch suggestions:', err);
        }
    };

    const handleVoiceClick = () => {
        startListening(setListening, navigate, null, { lang: selectedLang });
    };

    const handleSearch = async (e, query, pMin, pMax) => {
        if (e) e.preventDefault();
        const q = query || searchQuery;
        if (!q.trim()) return;
        try {
            let url = `/search?q=${encodeURIComponent(q)}`;
            const min = pMin !== undefined ? pMin : priceMin;
            const max = pMax !== undefined ? pMax : priceMax;
            if (min) url += `&price_min=${min}`;
            if (max) url += `&price_max=${max}`;
            const res = await client.get(url);
            let results = res.data.results || [];
            // Client-side tag filtering
            if (activeTags.length > 0) {
                results = results.filter(r =>
                    activeTags.some(tag => (r.tags || []).some(t => t.toLowerCase().includes(tag.toLowerCase())))
                );
            }
            setSearchResults(results);
            if (results.length === 0) {
                toast.info(`No products found for "${q}"`);
            }
        } catch (err) {
            console.error('Search error:', err);
        }
    };

    const handleFilterApply = () => {
        handleSearch(null, searchQuery, priceMin, priceMax);
    };

    const addToCart = async (name, category = '') => {
        try {
            await client.post('/list', {
                name, category, quantity: 1, price: 0,
            });
            setCartItems((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
            toast.success(`"${name}" added to your list!`);
        } catch (error) {
            toast.error(`Failed to add "${name}"`);
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

    const totalCartCount = Object.values(cartItems).reduce((sum, value) => sum + value, 0);

    return (
        <div className="min-h-screen bg-transparent">
            <section className="border-b border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                                <FaBolt className="text-[10px]" /> Voice-Powered Shopping
                            </div>
                            <h1 className="max-w-2xl text-4xl font-black leading-tight text-gray-900 dark:text-slate-50 md:text-5xl">
                                Professional grocery shopping with
                                <span className="block text-emerald-600 dark:text-emerald-400">voice control.</span>
                            </h1>
                            <p className="mt-4 max-w-xl text-base text-gray-500 dark:text-slate-400">
                                Search faster, add by voice, and browse polished product cards with real imagery instead of generic placeholders.
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-[32px] border border-gray-100 bg-gradient-to-br from-emerald-500 via-teal-500 to-slate-900 p-1 shadow-xl dark:border-slate-800">
                            <div className="rounded-[30px] bg-white/95 p-6 backdrop-blur dark:bg-slate-950/90">
                                <div className="mb-5 flex items-center justify-center gap-4">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowLangMenu(!showLangMenu)}
                                            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 transition-all hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <FaLanguage /> {LANGUAGES.find((lang) => lang.code === selectedLang)?.short}
                                        </button>
                                        {showLangMenu && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                                                <div className="absolute left-1/2 top-full z-50 mt-2 w-36 -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                                    {LANGUAGES.map((lang) => (
                                                        <button
                                                            key={lang.code}
                                                            onClick={() => { setSelectedLang(lang.code); setShowLangMenu(false); }}
                                                            className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                                                                selectedLang === lang.code
                                                                    ? 'bg-emerald-50 font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                                                                    : 'text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'
                                                            }`}
                                                        >
                                                            {lang.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleVoiceClick}
                                        className={`relative inline-flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 ${
                                            listening
                                                ? 'scale-110 bg-red-500 shadow-lg shadow-red-500/30'
                                                : 'bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:scale-105 hover:shadow-emerald-500/50'
                                        }`}
                                    >
                                        {listening && (
                                            <>
                                                <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></span>
                                                <span className="absolute inset-[-6px] rounded-full border-2 border-red-400/30 animate-pulse"></span>
                                            </>
                                        )}
                                        {listening ? (
                                            <MdHearing className="h-6 w-6 animate-pulse text-white" />
                                        ) : (
                                            <FaMicrophone className="h-6 w-6 text-white" />
                                        )}
                                    </button>

                                    <div className="text-xs">
                                        <p className="font-semibold text-gray-700 dark:text-slate-200">
                                            {listening ? 'Listening...' : 'Tap to Speak'}
                                        </p>
                                        <p className="text-gray-400 dark:text-slate-500">
                                            {listening ? 'Try "Add 2 bottles of water"' : 'Supports: Add, Remove, Search'}
                                        </p>
                                    </div>
                                </div>

                                <div className="my-4 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800"></div>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">or search manually</span>
                                    <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800"></div>
                                </div>

                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-all placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
                                    >
                                        <FaSearch /> Search
                                    </button>
                                </form>

                                {searchResults.length > 0 && (
                                    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-xs font-medium text-gray-500 dark:text-slate-400">{searchResults.length} result(s) found</p>
                                            <div className="flex items-center gap-2 text-xs">
                                                {searchResults[0]?.price > 0 && (
                                                    <span className="text-gray-400 dark:text-slate-500">
                                                        ₹{Math.min(...searchResults.map(r => r.price || 0)).toFixed(0)} – ₹{Math.max(...searchResults.map(r => r.price || 0)).toFixed(0)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price filter bar */}
                                        <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 px-1">Price</span>
                                            <input
                                                type="number"
                                                value={priceMin}
                                                onChange={(e) => setPriceMin(e.target.value)}
                                                placeholder="Min"
                                                className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                            />
                                            <span className="text-gray-400 text-xs">–</span>
                                            <input
                                                type="number"
                                                value={priceMax}
                                                onChange={(e) => setPriceMax(e.target.value)}
                                                placeholder="Max"
                                                className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                            />
                                            <button
                                                onClick={handleFilterApply}
                                                className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                                            >
                                                Apply
                                            </button>
                                            {(priceMin || priceMax || activeTags.length > 0) && (
                                                <button
                                                    onClick={() => { setPriceMin(''); setPriceMax(''); setActiveTags([]); handleSearch(null, searchQuery, '', ''); }}
                                                    className="rounded-lg bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-300 transition-colors dark:bg-slate-700 dark:text-slate-300"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        {/* Active tag pills */}
                                        {activeTags.length > 0 && (
                                            <div className="mb-2 flex flex-wrap gap-1">
                                                {activeTags.map((tag, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                                        {tag}
                                                        <button onClick={() => {
                                                            const next = activeTags.filter((_, j) => j !== i);
                                                            setActiveTags(next);
                                                        }} className="ml-0.5 text-emerald-400 hover:text-emerald-700">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {searchResults.map((result, index) => (
                                                <div key={index} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 transition-colors hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-950">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getProductImage(result.name, result.category)}
                                                            alt={result.name}
                                                            className="h-12 w-12 rounded-xl object-cover"
                                                        />
                                                        <div>
                                                            <span className="block text-sm font-semibold capitalize text-gray-800 dark:text-slate-100">{result.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="block text-[10px] capitalize text-gray-400 dark:text-slate-500">{result.category}</span>
                                                                {result.price > 0 && (
                                                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₹{result.price}</span>
                                                                )}
                                                            </div>
                                                            {result.tags && result.tags.length > 0 && (
                                                                <div className="mt-1 flex flex-wrap gap-1">
                                                                    {result.tags.slice(0, 3).map((tag, ti) => (
                                                                        <button
                                                                            key={ti}
                                                                            onClick={() => {
                                                                                if (!activeTags.includes(tag.toLowerCase())) {
                                                                                    const next = [...activeTags, tag.toLowerCase()];
                                                                                    setActiveTags(next);
                                                                                    handleSearch(null, searchQuery, priceMin, priceMax);
                                                                                }
                                                                            }}
                                                                            className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors dark:bg-slate-800 dark:text-slate-400"
                                                                        >
                                                                            {tag}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => fetchSubstitutes(result.name)}
                                                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-500 dark:text-slate-500 dark:hover:bg-amber-500/10"
                                                            title="View substitutes"
                                                        >
                                                            <FaExchangeAlt />
                                                        </button>
                                                        <button
                                                            onClick={() => addToCart(result.name, result.category)}
                                                            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                                                        >
                                                            + Add
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {showSubstitutes && (
                                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h4 className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300">
                                                <FaExchangeAlt className="text-xs" /> Substitutes for "{showSubstitutes.name}"
                                            </h4>
                                            <button onClick={() => setShowSubstitutes(null)} className="text-sm font-bold text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300">x</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {showSubstitutes.substitutes.length > 0 ? (
                                                showSubstitutes.substitutes.map((sub, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => { addToCart(sub); setShowSubstitutes(null); }}
                                                        className="rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-amber-500/20 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white"
                                                    >
                                                        {sub}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-500 dark:text-slate-400">No substitutes available</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-8">
                {activeCategory && categoryProducts.length > 0 && (
                    <section className="mb-10">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { setActiveCategory(''); setCategoryProducts([]); navigate('/'); }}
                                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-500/40"
                                >
                                    <FaArrowLeft className="text-sm" />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-slate-50">{activeCategory}</h2>
                                    <p className="text-sm text-gray-400 dark:text-slate-500">{categoryProducts.length} products available</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setActiveCategory(''); setCategoryProducts([]); navigate('/'); }}
                                className="text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
                            >
                                Clear filter
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {categoryProducts.map((item, index) => (
                                <ProductCard key={item.name} item={{ ...item, reason: `${item.emoji} ${item.category}` }} onAdd={addToCart} onSubstitutes={fetchSubstitutes} index={index} />
                            ))}
                        </div>
                    </section>
                )}

                {suggestions.length > 0 && (
                    <section className="mb-10">
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/20">
                                    <FaLeaf className="text-sm text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-slate-50">Smart Suggestions</h2>
                                    <p className="text-sm text-gray-400 dark:text-slate-500">Image-first recommendations based on your shopping history</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/list')}
                                className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                                View All {'->'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {suggestions.map((item, index) => (
                                <ProductCard key={index} item={item} onAdd={addToCart} onSubstitutes={fetchSubstitutes} index={index} />
                            ))}
                        </div>
                    </section>
                )}

                {seasonal.length > 0 && (
                    <section className="mb-8 rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 shadow-lg shadow-teal-500/20">
                                <FaBolt className="text-sm text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-slate-50">In Season Now</h2>
                                <p className="text-sm text-gray-400 dark:text-slate-500">Fresh picks for this month</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {seasonal.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => addToCart(item.name, item.category)}
                                    className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                                >
                                    <img
                                        src={getProductImage(item.name, item.category)}
                                        alt={item.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <span className="capitalize">{item.name}</span>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+ Add</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                <div className="mx-auto max-w-2xl">
                    <button
                        onClick={() => navigate('/list')}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40"
                    >
                        <MdLocalGroceryStore /> View My Shopping List
                        {totalCartCount > 0 && (
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">{totalCartCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
