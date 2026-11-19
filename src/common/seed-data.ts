export interface ProductSeed {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  channel: string;
  unit: string;
  currentPrice: number;
  verified: boolean;
  prices: Array<{ store: string; price: number; date: string; channel: string; verified: boolean; deliveryFee: number; }>; 
  reviews: Array<{ user: string; rating: number; comment: string; }>; 
}

export const productSeed: ProductSeed[] = [
  {
    id: 1,
    slug: 'samsung-galaxy-m34-5g',
    name: 'Samsung Galaxy M34 5G',
    brand: 'Samsung',
    category: 'Consumer Electronics',
    channel: 'online marketplace',
    unit: 'piece',
    currentPrice: 32999,
    verified: true,
    prices: [
      { store: 'Daraz', price: 34999, date: '2026-10-01', channel: 'online marketplace', verified: true, deliveryFee: 120 },
      { store: 'Pickaboo', price: 33999, date: '2026-10-12', channel: 'online marketplace', verified: true, deliveryFee: 0 },
      { store: 'Bikroy', price: 35999, date: '2026-10-21', channel: 'physical shop', verified: false, deliveryFee: 150 },
      { store: 'Samsung Bangladesh', price: 32999, date: '2026-11-01', channel: 'brand website', verified: true, deliveryFee: 100 },
    ],
    reviews: [
      { user: 'ruhul', rating: 5, comment: 'Great value and easy setup.' },
      { user: 'nabila', rating: 4, comment: 'Delivery was quick and phone is fast.' },
      { user: 'mizan', rating: 5, comment: 'Reliable battery life.' },
    ],
  },
  {
    id: 2,
    slug: 'canon-eos-r50',
    name: 'Canon EOS R50',
    brand: 'Canon',
    category: 'Consumer Electronics',
    channel: 'brand website',
    unit: 'piece',
    currentPrice: 118500,
    verified: true,
    prices: [
      { store: 'Canon Bangladesh', price: 118500, date: '2026-10-02', channel: 'brand website', verified: true, deliveryFee: 0 },
      { store: 'Techland', price: 123900, date: '2026-10-16', channel: 'physical shop', verified: true, deliveryFee: 250 },
      { store: 'Daraz', price: 129000, date: '2026-10-30', channel: 'online marketplace', verified: false, deliveryFee: 100 },
    ],
    reviews: [
      { user: 'tahmid', rating: 5, comment: 'Lovely camera for beginners.' },
      { user: 'sharmin', rating: 4, comment: 'Image quality is great.' },
    ],
  },
  {
    id: 3,
    slug: 'basmati-rice-5kg',
    name: 'Basmati Rice 5kg',
    brand: 'Aarong Foods',
    category: 'Packaged Groceries',
    channel: 'physical shop',
    unit: 'kg',
    currentPrice: 780,
    verified: true,
    prices: [
      { store: 'Moghbazar Mart', price: 770, date: '2026-10-08', channel: 'physical shop', verified: true, deliveryFee: 0 },
      { store: 'Meena Bazar', price: 820, date: '2026-10-15', channel: 'physical shop', verified: true, deliveryFee: 0 },
      { store: 'Chaldal', price: 790, date: '2026-11-04', channel: 'online marketplace', verified: true, deliveryFee: 40 },
    ],
    reviews: [
      { user: 'sadia', rating: 4, comment: 'Smells great and cooks evenly.' },
      { user: 'samira', rating: 5, comment: 'Premium quality.' },
    ],
  },
  {
    id: 4,
    slug: 'pran-chips-family-pack',
    name: 'Pran Chips Family Pack',
    brand: 'Pran',
    category: 'Packaged Groceries',
    channel: 'online marketplace',
    unit: 'pack',
    currentPrice: 90,
    verified: true,
    prices: [
      { store: 'Chaldal', price: 95, date: '2026-09-25', channel: 'online marketplace', verified: true, deliveryFee: 30 },
      { store: 'ShopUp', price: 85, date: '2026-10-11', channel: 'online marketplace', verified: true, deliveryFee: 35 },
      { store: 'Local Grocery', price: 120, date: '2026-10-25', channel: 'physical shop', verified: false, deliveryFee: 0 },
    ],
    reviews: [
      { user: 'farhana', rating: 3, comment: 'Good snack, but a little pricey.' },
      { user: 'adnan', rating: 4, comment: 'Fresh and crunchy.' },
    ],
  },
];

export const submissions = [
  { id: 's-1', productId: 1, store: 'Local Tech Hub', price: 31999, status: 'Pending', channel: 'physical shop', region: 'Dhaka', date: '2026-11-04', userId: 'u-1' },
  { id: 's-2', productId: 3, store: 'Bashundhara Bazar', price: 760, status: 'Verified', channel: 'physical shop', region: 'Dhaka', date: '2026-11-02', userId: 'u-2' },
];

export const alerts = [
  { id: 'a-1', productId: 1, targetPrice: 32000, triggered: false, active: true },
  { id: 'a-2', productId: 3, targetPrice: 750, triggered: true, active: true },
];

export const concerns = [
  { id: 'c-1', customerLabel: 'Customer #A12', productId: 1, status: 'Open', type: 'misleading price', message: 'The web price was lower than the in-store checkout price.' },
];
