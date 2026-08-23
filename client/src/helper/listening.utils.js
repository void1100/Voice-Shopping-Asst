import { toast } from 'react-toastify';
import client from '../api/client';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Frontend fallback: detect category names in transcript
const CATEGORY_KEYWORDS = {
    dairy: ['dairy', 'milk products'],
    produce: ['produce', 'fruits', 'vegetables', 'veggies', 'greens'],
    grains: ['grains', 'cereals', 'bakery'],
    beverages: ['beverages', 'drinks'],
    snacks: ['snacks', 'snack'],
    cooking: ['cooking', 'cooking essentials', 'masala', 'spices'],
    household: ['household', 'cleaning'],
    meat: ['meat', 'non veg', 'non-veg'],
};

function detectCategoryFromTranscript(text) {
    const lower = text.toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const kw of keywords) {
            if (lower.includes(kw)) return cat;
        }
    }
    return null;
}


const startListening = (setListening, navigate, fetchList, options = {}) => {
    if (!SpeechRecognition) {
        toast.error('Speech recognition not supported. Use Chrome or Edge.');
        return;
    }

    const { lang = 'en-US' } = options;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Heard:', transcript);

        try {
            const res = await client.post('/parse-voice', { transcript, lang });
            const parsed = res.data.parsed;
            console.log('Semantic parsed:', parsed);

            const { action, target, items } = parsed;

            if (!items || items.length === 0) {
                toast.warning('Could not understand the item. Please try again.');
                return;
            }

            const targetPrefix = target === 'cart' ? '/cart' : '/list';

            if (action === 'add') {
                if (items.length === 1) {
                    const item = items[0];
                    await client.post(targetPrefix, {
                        name: item.name, category: '', quantity: item.quantity || 1, price: 0,
                    });
                    const qtyText = (item.quantity || 1) > 1 ? ` (x${item.quantity})` : '';
                    const place = target === 'cart' ? 'cart' : 'list';
                    toast.success(`"${item.name}"${qtyText} added to ${place}!`);
                } else {
                    const endpoint = target === 'cart' ? '/cart' : '/list/batch';
                    const payload = target === 'cart'
                        ? { items: items.map(item => ({
                            name: item.name, category: '', quantity: item.quantity || 1, price: 0,
                        }))}
                        : { items: items.map(item => ({
                            name: item.name, category: '', quantity: item.quantity || 1, price: 0,
                        }))};
                    await client.post(endpoint, payload);
                    const names = items.map(i => i.name).join(', ');
                    const place = target === 'cart' ? 'cart' : 'list';
                    toast.success(`Added ${items.length} items to ${place}: ${names}`);
                }

                if (fetchList && typeof fetchList === 'function') {
                    fetchList();
                } else {
                    navigate(target === 'cart' ? '/cart' : '/list');
                }

            } else if (action === 'remove') {
                // For remove, we need to find the item first
                const listEndpoint = target === 'cart' ? '/cart' : '/list';
                const listRes = await client.get(listEndpoint);
                const currentItems = Array.isArray(listRes.data) ? listRes.data : (listRes.data.items || []);

                for (const item of items) {
                    const found = currentItems.find(i =>
                        i.normalized_name === item.name || i.name.toLowerCase() === item.name.toLowerCase()
                    );
                    if (found) {
                        await client.delete(`${listEndpoint}/${found.id}`);
                    }
                }
                const names = items.map(i => i.name).join(', ');
                const place = target === 'cart' ? 'cart' : 'list';
                toast.success(`Removed ${items.length} item(s) from ${place}: ${names}`);

                if (fetchList && typeof fetchList === 'function') {
                    fetchList();
                } else {
                    navigate(target === 'cart' ? '/cart' : '/list');
                }

            } else if (action === 'search') {
                const query = items.map(i => i.name).join(' ');
                const filters = parsed.search_filters || {};
                let url;
                const filterDesc = [];

                // Backend may detect category, or detect it on frontend as fallback
                const category = filters.category || detectCategoryFromTranscript(transcript);

                if (category) {
                    url = `/?category=${encodeURIComponent(category)}`;
                    if (filters.price_min) url += `&price_min=${filters.price_min}`;
                    if (filters.price_max) url += `&price_max=${filters.price_max}`;
                    filterDesc.push(category);
                } else {
                    url = `/?q=${encodeURIComponent(query)}`;
                    if (filters.price_min) url += `&price_min=${filters.price_min}`;
                    if (filters.price_max) url += `&price_max=${filters.price_max}`;
                    if (filters.qualifiers && filters.qualifiers.length > 0) {
                        url += `&tags=${encodeURIComponent(filters.qualifiers.join(','))}`;
                    }
                    filterDesc.push(query);
                }

                if (filters.price_min) filterDesc.push(`above ₹${filters.price_min}`);
                if (filters.price_max) filterDesc.push(`under ₹${filters.price_max}`);
                if (filters.qualifiers?.length) filterDesc.push(filters.qualifiers.join(', '));
                toast.info(`Showing ${filterDesc.join(' ')}...`);
                navigate(url);
            }

            if (parsed.source === 'openai') {
                console.log('Parsed using OpenAI (semantic fallback)');
            }

        } catch (error) {
            console.error('Voice command error:', error);
            const msg = error.response?.data?.detail || 'Something went wrong. Please try again.';
            toast.error(msg);
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        const errors = {
            'no-speech': 'No speech detected. Please try again.',
            'audio-capture': 'No microphone found.',
            'not-allowed': 'Microphone access denied.',
            'network': 'Network error. Check your connection.',
        };
        toast.error(errors[event.error] || 'Speech recognition error.');
        setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
};

export default startListening;
