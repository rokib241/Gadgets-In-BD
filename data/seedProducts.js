// Seed catalog. Prices are in BDT (Bangladeshi Taka).
// `icon` + `color` drive the CSS-drawn product tile (no external image hosting needed).

module.exports = [
  {
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 139999,
    oldPrice: 154999,
    stock: 14,
    rating: 4.7,
    reviews: 212,
    icon: '📱',
    color: '#12172B',
    specs: [
      { label: 'Display', value: '6.8" QHD+ AMOLED' },
      { label: 'RAM / Storage', value: '12GB / 256GB' },
      { label: 'Battery', value: '5000mAh' },
      { label: 'Camera', value: '200MP Quad' }
    ],
    description: 'Flagship Samsung with a 200MP camera, S Pen support, and titanium frame. Official Samsung Bangladesh warranty.',
    featured: true
  },
  {
    name: 'Redmi Note 13 Pro',
    brand: 'Xiaomi',
    category: 'Smartphones',
    price: 27999,
    oldPrice: 31999,
    stock: 40,
    rating: 4.4,
    reviews: 587,
    icon: '📱',
    color: '#0FB5AE',
    specs: [
      { label: 'Display', value: '6.67" AMOLED 120Hz' },
      { label: 'RAM / Storage', value: '8GB / 256GB' },
      { label: 'Battery', value: '5100mAh, 67W' },
      { label: 'Camera', value: '200MP OIS' }
    ],
    description: 'Best-selling mid-range performer in Bangladesh right now — sharp AMOLED screen and fast charging.',
    featured: true
  },
  {
    name: 'realme 12 Pro+',
    brand: 'realme',
    category: 'Smartphones',
    price: 34999,
    oldPrice: null,
    stock: 22,
    rating: 4.3,
    reviews: 164,
    icon: '📱',
    color: '#FFB020',
    specs: [
      { label: 'Display', value: '6.7" Curved AMOLED' },
      { label: 'RAM / Storage', value: '8GB / 256GB' },
      { label: 'Battery', value: '5000mAh, 67W' },
      { label: 'Camera', value: '50MP Periscope Zoom' }
    ],
    description: 'The first sub-35k phone with a periscope telephoto camera. Great for content creators.',
    featured: false
  },
  {
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'Smartphones',
    price: 114999,
    oldPrice: null,
    stock: 9,
    rating: 4.8,
    reviews: 341,
    icon: '📱',
    color: '#12172B',
    specs: [
      { label: 'Display', value: '6.1" Super Retina XDR' },
      { label: 'Chip', value: 'A16 Bionic' },
      { label: 'Storage', value: '128GB' },
      { label: 'Camera', value: '48MP Main' }
    ],
    description: 'USB-C, Dynamic Island, and the A16 chip. Imported, PTA-approved, official Apple warranty.',
    featured: true
  },
  {
    name: 'ASUS Vivobook 15',
    brand: 'ASUS',
    category: 'Laptops',
    price: 62500,
    oldPrice: 68000,
    stock: 17,
    rating: 4.3,
    reviews: 128,
    icon: '💻',
    color: '#0FB5AE',
    specs: [
      { label: 'CPU', value: 'Intel Core i5-1235U' },
      { label: 'RAM / Storage', value: '8GB / 512GB SSD' },
      { label: 'Display', value: '15.6" FHD' },
      { label: 'Weight', value: '1.7kg' }
    ],
    description: 'The everyday student and office laptop — light, fast SSD, all-day battery.',
    featured: true
  },
  {
    name: 'Lenovo IdeaPad Slim 3',
    brand: 'Lenovo',
    category: 'Laptops',
    price: 54900,
    oldPrice: null,
    stock: 21,
    rating: 4.2,
    reviews: 96,
    icon: '💻',
    color: '#FF5470',
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 5 7530U' },
      { label: 'RAM / Storage', value: '8GB / 512GB SSD' },
      { label: 'Display', value: '15.6" FHD' },
      { label: 'Battery', value: 'Up to 10h' }
    ],
    description: 'Ryzen 5 power at a mid-range price — great for multitasking and light editing.',
    featured: false
  },
  {
    name: 'MacBook Air M2',
    brand: 'Apple',
    category: 'Laptops',
    price: 149999,
    oldPrice: null,
    stock: 6,
    rating: 4.9,
    reviews: 210,
    icon: '💻',
    color: '#12172B',
    specs: [
      { label: 'Chip', value: 'Apple M2' },
      { label: 'RAM / Storage', value: '8GB / 256GB SSD' },
      { label: 'Display', value: '13.6" Liquid Retina' },
      { label: 'Battery', value: 'Up to 18h' }
    ],
    description: 'Fanless, silent, and fast. The go-to laptop for creators who want battery life that lasts.',
    featured: true
  },
  {
    name: 'HP Pavilion 14',
    brand: 'HP',
    category: 'Laptops',
    price: 71500,
    oldPrice: 76000,
    stock: 11,
    rating: 4.1,
    reviews: 74,
    icon: '💻',
    color: '#FFB020',
    specs: [
      { label: 'CPU', value: 'Intel Core i5-1335U' },
      { label: 'RAM / Storage', value: '16GB / 512GB SSD' },
      { label: 'Display', value: '14" FHD IPS' },
      { label: 'Extras', value: 'Backlit keyboard' }
    ],
    description: '16GB RAM out of the box, ideal for heavier multitasking and light dev work.',
    featured: false
  },
  {
    name: 'JBL Tune 760NC',
    brand: 'JBL',
    category: 'Audio',
    price: 6999,
    oldPrice: 8500,
    stock: 55,
    rating: 4.5,
    reviews: 430,
    icon: '🎧',
    color: '#FF5470',
    specs: [
      { label: 'Type', value: 'Over-ear, Wireless' },
      { label: 'ANC', value: 'Active Noise Cancelling' },
      { label: 'Battery', value: '50h playback' },
      { label: 'Extras', value: 'Foldable' }
    ],
    description: 'JBL signature sound with active noise cancelling and a 50-hour battery.',
    featured: true
  },
  {
    name: 'Xiaomi Buds 4 Pro',
    brand: 'Xiaomi',
    category: 'Audio',
    price: 8499,
    oldPrice: null,
    stock: 33,
    rating: 4.4,
    reviews: 188,
    icon: '🎧',
    color: '#0FB5AE',
    specs: [
      { label: 'Type', value: 'In-ear TWS' },
      { label: 'ANC', value: 'Up to 48dB' },
      { label: 'Battery', value: '9h + 30h case' },
      { label: 'Codec', value: 'LDAC Hi-Res' }
    ],
    description: 'Hi-Res LDAC audio with strong ANC — a favourite among audiophiles on a budget.',
    featured: false
  },
  {
    name: 'Sony WH-1000XM4',
    brand: 'Sony',
    category: 'Audio',
    price: 24999,
    oldPrice: 28999,
    stock: 8,
    rating: 4.8,
    reviews: 267,
    icon: '🎧',
    color: '#12172B',
    specs: [
      { label: 'Type', value: 'Over-ear, Wireless' },
      { label: 'ANC', value: 'Industry-leading' },
      { label: 'Battery', value: '30h playback' },
      { label: 'Extras', value: 'Multipoint pairing' }
    ],
    description: 'The benchmark noise-cancelling headphone, still unbeaten on comfort and call quality.',
    featured: true
  },
  {
    name: 'Amazfit GTS 4 Mini',
    brand: 'Amazfit',
    category: 'Wearables',
    price: 8999,
    oldPrice: 10999,
    stock: 26,
    rating: 4.3,
    reviews: 152,
    icon: '⌚',
    color: '#FFB020',
    specs: [
      { label: 'Display', value: '1.65" AMOLED' },
      { label: 'Battery', value: 'Up to 15 days' },
      { label: 'Health', value: 'SpO2, HR, Sleep' },
      { label: 'Water', value: '5 ATM' }
    ],
    description: 'Slim AMOLED smartwatch with two weeks of battery life and full health tracking.',
    featured: false
  },
  {
    name: 'Mi Band 8',
    brand: 'Xiaomi',
    category: 'Wearables',
    price: 3499,
    oldPrice: null,
    stock: 60,
    rating: 4.5,
    reviews: 610,
    icon: '⌚',
    color: '#0FB5AE',
    specs: [
      { label: 'Display', value: '1.62" AMOLED' },
      { label: 'Battery', value: 'Up to 16 days' },
      { label: 'Health', value: 'HR, SpO2, Stress' },
      { label: 'Water', value: '5 ATM' }
    ],
    description: "Bangladesh's best-selling fitness band — light, accurate, and great battery life.",
    featured: true
  },
  {
    name: 'Apple Watch SE',
    brand: 'Apple',
    category: 'Wearables',
    price: 32999,
    oldPrice: null,
    stock: 7,
    rating: 4.7,
    reviews: 98,
    icon: '⌚',
    color: '#12172B',
    specs: [
      { label: 'Display', value: 'Retina LTPO' },
      { label: 'Chip', value: 'S8 SiP' },
      { label: 'Health', value: 'HR, Fall Detection' },
      { label: 'Pairing', value: 'iPhone only' }
    ],
    description: 'Full Apple Watch experience — crash detection, fitness tracking, and watchOS apps.',
    featured: false
  },
  {
    name: '20000mAh Power Bank',
    brand: 'Anker',
    category: 'Accessories',
    price: 3299,
    oldPrice: 3999,
    stock: 80,
    rating: 4.6,
    reviews: 322,
    icon: '🔋',
    color: '#FF5470',
    specs: [
      { label: 'Capacity', value: '20000mAh' },
      { label: 'Output', value: '22.5W Fast Charge' },
      { label: 'Ports', value: 'USB-C + 2x USB-A' },
      { label: 'Extras', value: 'Digital display' }
    ],
    description: 'Charge two devices at once with fast 22.5W output — a travel essential.',
    featured: false
  },
  {
    name: 'Mechanical Keyboard K3',
    brand: 'RK',
    category: 'Gaming',
    price: 4599,
    oldPrice: 5299,
    stock: 30,
    rating: 4.4,
    reviews: 141,
    icon: '⌨️',
    color: '#0FB5AE',
    specs: [
      { label: 'Switches', value: 'Red (Linear)' },
      { label: 'Layout', value: '75% Compact' },
      { label: 'Backlight', value: 'RGB' },
      { label: 'Connection', value: 'Wired + BT 5.0' }
    ],
    description: 'Hot-swappable mechanical keyboard with satisfying red switches and RGB backlight.',
    featured: false
  },
  {
    name: 'Wireless Gaming Mouse M2',
    brand: 'Logitech',
    category: 'Gaming',
    price: 3999,
    oldPrice: null,
    stock: 45,
    rating: 4.5,
    reviews: 203,
    icon: '🖱️',
    color: '#FFB020',
    specs: [
      { label: 'Sensor', value: '16000 DPI Optical' },
      { label: 'Battery', value: 'Up to 70h' },
      { label: 'Buttons', value: '6 Programmable' },
      { label: 'Weight', value: '77g' }
    ],
    description: 'Lightweight wireless mouse built for fast flicks and long sessions.',
    featured: true
  }
];
