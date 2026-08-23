// Real product images from Unsplash (free, no attribution required)
// Format: https://images.unsplash.com/photo-{ID}?w=400&h=300&fit=crop&auto=format&q=80

const PRODUCT_IMAGES = {
    // Dairy
    milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format&q=80',
    'almond milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format&q=80',
    'soy milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format&q=80',
    'oat milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format&q=80',
    'coconut milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format&q=80',
    cheese: 'https://images.unsplash.com/photo-1486297678162-eb2c1b5020d3?w=400&h=300&fit=crop&auto=format&q=80',
    yogurt: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format&q=80',
    butter: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop&auto=format&q=80',
    cream: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&auto=format&q=80',
    eggs: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&auto=format&q=80',

    // Produce
    apples: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format&q=80',
    apple: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format&q=80',
    bananas: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format&q=80',
    banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format&q=80',
    tomatoes: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop&auto=format&q=80',
    tomato: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop&auto=format&q=80',
    onions: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=300&fit=crop&auto=format&q=80',
    onion: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=300&fit=crop&auto=format&q=80',
    potatoes: 'https://images.unsplash.com/photo-1518977676601-b53f82ber8c5?w=400&h=300&fit=crop&auto=format&q=80',
    potato: 'https://images.unsplash.com/photo-1518977676601-b53f82ber8c5?w=400&h=300&fit=crop&auto=format&q=80',
    carrots: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&h=300&fit=crop&auto=format&q=80',
    carrot: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=400&h=300&fit=crop&auto=format&q=80',
    spinach: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop&auto=format&q=80',
    lettuce: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop&auto=format&q=80',
    cucumber: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop&auto=format&q=80',
    lemon: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop&auto=format&q=80',
    garlic: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop&auto=format&q=80',
    ginger: 'https://images.unsplash.com/photo-1615485501175-9b2c3f2b2a03?w=400&h=300&fit=crop&auto=format&q=80',
    'green chili': 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop&auto=format&q=80',
    coriander: 'https://images.unsplash.com/photo-1631209119015-1c7777db4e49?w=400&h=300&fit=crop&auto=format&q=80',

    // Grains
    rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format&q=80',
    bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format&q=80',
    pasta: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=300&fit=crop&auto=format&q=80',
    oats: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop&auto=format&q=80',
    flour: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format&q=80',

    // Beverages
    tea: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format&q=80',
    coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&auto=format&q=80',
    juice: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&auto=format&q=80',
    water: 'https://images.unsplash.com/photo-1548839140-29a749814706?w=400&h=300&fit=crop&auto=format&q=80',

    // Snacks
    chips: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop&auto=format&q=80',
    biscuits: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format&q=80',
    chocolate: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop&auto=format&q=80',
    nuts: 'https://images.unsplash.com/photo-1536590158215-33bb6aa82c77?w=400&h=300&fit=crop&auto=format&q=80',

    // Cooking
    oil: 'https://images.unsplash.com/photo-1474979266404-7eaacdc50f5a?w=400&h=300&fit=crop&auto=format&q=80',
    salt: 'https://images.unsplash.com/photo-1518110925495-5fe2c8e5be83?w=400&h=300&fit=crop&auto=format&q=80',
    sugar: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&auto=format&q=80',
    spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&auto=format&q=80',

    // Household
    soap: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=300&fit=crop&auto=format&q=80',
    detergent: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&auto=format&q=80',
    tissues: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&h=300&fit=crop&auto=format&q=80',

    // Meat
    chicken: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop&auto=format&q=80',
    fish: 'https://images.unsplash.com/photo-1534483509720-8e8bd26a0e93?w=400&h=300&fit=crop&auto=format&q=80',
    mutton: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop&auto=format&q=80',

    // Fallbacks for substitutes & other items
    pears: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&h=300&fit=crop&auto=format&q=80',
    plantains: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format&q=80',
    mangoes: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop&auto=format&q=80',
    'canned tomatoes': 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop&auto=format&q=80',
    shallots: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=300&fit=crop&auto=format&q=80',
    'sweet potatoes': 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=300&fit=crop&auto=format&q=80',
    yams: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=300&fit=crop&auto=format&q=80',
    beetroot: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=300&fit=crop&auto=format&q=80',
    kale: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?w=400&h=300&fit=crop&auto=format&q=80',
    cabbage: 'https://images.unsplash.com/photo-1594282486756-7e4b3c2c8716?w=400&h=300&fit=crop&auto=format&q=80',
    zucchini: 'https://images.unsplash.com/photo-1563281746-48b9dba2c6d2?w=400&h=300&fit=crop&auto=format&q=80',
    lime: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop&auto=format&q=80',
    vinegar: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d15c?w=400&h=300&fit=crop&auto=format&q=80',
    'garlic powder': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop&auto=format&q=80',
    parsley: 'https://images.unsplash.com/photo-1631209119015-1c7777db4e49?w=400&h=300&fit=crop&auto=format&q=80',
    cilantro: 'https://images.unsplash.com/photo-1631209119015-1c7777db4e49?w=400&h=300&fit=crop&auto=format&q=80',
    quinoa: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format&q=80',
    couscous: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format&q=80',
    noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&auto=format&q=80',
    vermicelli: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop&auto=format&q=80',
    cereal: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop&auto=format&q=80',
    muesli: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop&auto=format&q=80',
    roti: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format&q=80',
    tortilla: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format&q=80',
    pita: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format&q=80',
    atta: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format&q=80',
    maida: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format&q=80',
    'green tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format&q=80',
    'hot chocolate': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&auto=format&q=80',
    smoothie: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&auto=format&q=80',
    'sparkling water': 'https://images.unsplash.com/photo-1548839140-29a749814706?w=400&h=300&fit=crop&auto=format&q=80',
    'coconut water': 'https://images.unsplash.com/photo-1548839140-29a749814706?w=400&h=300&fit=crop&auto=format&q=80',
    popcorn: 'https://images.unsplash.com/photo-1585238342024-78d387f41777?w=400&h=300&fit=crop&auto=format&q=80',
    cookies: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format&q=80',
    crackers: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format&q=80',
    candy: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop&auto=format&q=80',
    dates: 'https://images.unsplash.com/photo-1610024062303-e355e94c7a8c?w=400&h=300&fit=crop&auto=format&q=80',
    seeds: 'https://images.unsplash.com/photo-1536590158215-33bb6aa82c77?w=400&h=300&fit=crop&auto=format&q=80',
    'trail mix': 'https://images.unsplash.com/photo-1536590158215-33bb6aa82c77?w=400&h=300&fit=crop&auto=format&q=80',
    'olive oil': 'https://images.unsplash.com/photo-1474979266404-7eaacdc50f5a?w=400&h=300&fit=crop&auto=format&q=80',
    ghee: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop&auto=format&q=80',
    'rock salt': 'https://images.unsplash.com/photo-1518110925495-5fe2c8e5be83?w=400&h=300&fit=crop&auto=format&q=80',
    'sea salt': 'https://images.unsplash.com/photo-1518110925495-5fe2c8e5be83?w=400&h=300&fit=crop&auto=format&q=80',
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&auto=format&q=80',
    jaggery: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&auto=format&q=80',
    stevia: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&auto=format&q=80',
    'masala mix': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&auto=format&q=80',
    'body wash': 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=300&fit=crop&auto=format&q=80',
    'shower gel': 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=300&fit=crop&auto=format&q=80',
    'washing powder': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&auto=format&q=80',
    napkins: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&h=300&fit=crop&auto=format&q=80',
    'paper towels': 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=400&h=300&fit=crop&auto=format&q=80',
    paneer: 'https://images.unsplash.com/photo-1486297678162-eb2c1b5020d3?w=400&h=300&fit=crop&auto=format&q=80',
    tofu: 'https://images.unsplash.com/photo-1486297678162-eb2c1b5020d3?w=400&h=300&fit=crop&auto=format&q=80',
    'tofu scramble': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop&auto=format&q=80',
    'jalapeno': 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop&auto=format&q=80',
    'chili flakes': 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop&auto=format&q=80',
    'soya chunks': 'https://images.unsplash.com/photo-1536590158215-33bb6aa82c77?w=400&h=300&fit=crop&auto=format&q=80',
};

const CATEGORY_IMAGES = {
    dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&auto=format&q=80',
    produce: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format&q=80',
    grains: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format&q=80',
    beverages: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&auto=format&q=80',
    snacks: 'https://images.unsplash.com/photo-1585238342024-78d387f41777?w=400&h=300&fit=crop&auto=format&q=80',
    cooking: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&auto=format&q=80',
    household: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&auto=format&q=80',
    meat: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=300&fit=crop&auto=format&q=80',
    uncategorized: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&auto=format&q=80',
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
