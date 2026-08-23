const PRODUCT_IMAGES = {
    milk: '/milk.jpeg',
    'almond milk': '/milk.jpeg',
    'soy milk': '/milk.jpeg',
    'oat milk': '/milk.jpeg',
    'coconut milk': '/milk.jpeg',
    yogurt: '/milk.jpeg',
    cheese: '/milk.jpeg',
    butter: '/milk.jpeg',
    cream: '/milk.jpeg',
    apples: '/apple.png',
    apple: '/apple.png',
    pears: '/apple.png',
    pear: '/apple.png',
    bananas: '/apple.png',
    banana: '/apple.png',
    tomatoes: '/apple.png',
    tomato: '/apple.png',
    corn: '/apple.png',
    spinach: '/apple.png',
    carrots: '/apple.png',
    cucumber: '/apple.png',
    bread: '/bread.jpeg',
    pasta: '/bread.jpeg',
    oats: '/bread.jpeg',
    biscuits: '/bread.jpeg',
    rice: '/rice.jpeg',
    flour: '/rice.jpeg',
    spices: '/rice.jpeg',
    sugar: '/rice.jpeg',
};

const CATEGORY_IMAGES = {
    dairy: '/milk.jpeg',
    produce: '/apple.png',
    grains: '/bread.jpeg',
    beverages: '/milk.jpeg',
    snacks: '/bread.jpeg',
    cooking: '/rice.jpeg',
    household: '/bread.jpeg',
    meat: '/rice.jpeg',
    uncategorized: '/rice.jpeg',
};

const CATEGORY_GRADIENTS = {
    dairy: 'from-sky-500/70 via-cyan-400/30 to-slate-950/80',
    produce: 'from-emerald-500/70 via-lime-400/20 to-slate-950/80',
    grains: 'from-amber-500/70 via-orange-300/20 to-slate-950/80',
    beverages: 'from-cyan-500/70 via-blue-300/20 to-slate-950/80',
    snacks: 'from-orange-500/70 via-yellow-300/20 to-slate-950/80',
    cooking: 'from-rose-500/70 via-orange-300/20 to-slate-950/80',
    household: 'from-violet-500/70 via-fuchsia-300/20 to-slate-950/80',
    meat: 'from-rose-700/70 via-red-400/20 to-slate-950/80',
    uncategorized: 'from-slate-500/70 via-slate-300/20 to-slate-950/80',
};

export function getProductImage(name, category) {
    const normalizedName = name?.toLowerCase().trim() || '';

    if (PRODUCT_IMAGES[normalizedName]) {
        return PRODUCT_IMAGES[normalizedName];
    }

    const partialMatch = Object.entries(PRODUCT_IMAGES).find(([key]) => normalizedName.includes(key));
    if (partialMatch) {
        return partialMatch[1];
    }

    return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.uncategorized;
}

export function getProductImageOverlay(category) {
    return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.uncategorized;
}
