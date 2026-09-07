import React, { useState, useMemo } from 'react';

// --- Type Definitions ---
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  rating: number;
  ratingCount: number;
  variants: ProductVariant[];
  tenureOptions: number[]; // In months, e.g., [3, 6, 9, 12]
  annualInterestRate: number; // e.g., 0.14 for 14%
}

// --- Mock Data ---
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Apple iPhone 15 (128 GB) - Black',
    brand: 'Apple',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    ratingCount: 1420,
    annualInterestRate: 0.12,
    tenureOptions: [3, 6, 9, 12],
    variants: [
      { id: 'v1-1', name: '128 GB', price: 65999, originalPrice: 79900 },
      { id: 'v1-2', name: '256 GB', price: 75999, originalPrice: 89900 },
      { id: 'v1-3', name: '512 GB', price: 95999, originalPrice: 109900 },
    ],
  },
  {
    id: 'p2',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    ratingCount: 890,
    annualInterestRate: 0.14,
    tenureOptions: [3, 6, 9],
    variants: [
      { id: 'v2-1', name: 'Midnight Black', price: 29990, originalPrice: 34990 },
      { id: 'v2-2', name: 'Silver', price: 29990, originalPrice: 34990 },
    ],
  },
  {
    id: 'p3',
    title: 'Samsung Galaxy Watch 6 Bluetooth (44mm)',
    brand: 'Samsung',
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    rating: 4.4,
    ratingCount: 620,
    annualInterestRate: 0.10,
    tenureOptions: [3, 6, 12],
    variants: [
      { id: 'v3-1', name: '44mm Graphite', price: 21999, originalPrice: 33999 },
      { id: 'v3-2', name: '40mm Silver', price: 18999, originalPrice: 29999 },
    ],
  },
  {
    id: 'p4',
    title: 'Apple MacBook Air M2 Chip (8GB / 256GB SSD)',
    brand: 'Apple',
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    ratingCount: 2310,
    annualInterestRate: 0.11,
    tenureOptions: [6, 9, 12, 18, 24],
    variants: [
      { id: 'v4-1', name: '256 GB SSD', price: 89990, originalPrice: 99900 },
      { id: 'v4-2', name: '512 GB SSD', price: 109990, originalPrice: 119900 },
    ],
  },
];

// Helper: Standard Reducing Balance EMI Calculation
function calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
  if (tenureMonths <= 0) return principal;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return Math.round(principal / tenureMonths);
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

// Format Currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'brands' | 'stores'>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal Interactive States
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedTenure, setSelectedTenure] = useState<number>(3);

  const categories = ['All', 'Smartphones', 'Audio', 'Wearables', 'Laptops'];

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariantId(product.variants[0]?.id || '');
    setSelectedTenure(product.tenureOptions[product.tenureOptions.length - 1] || 12);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const currentVariant = useMemo(() => {
    if (!selectedProduct) return null;
    return selectedProduct.variants.find((v) => v.id === selectedVariantId) || selectedProduct.variants[0];
  }, [selectedProduct, selectedVariantId]);

  const modalEMI = useMemo(() => {
    if (!selectedProduct || !currentVariant) return 0;
    return calculateEMI(currentVariant.price, selectedProduct.annualInterestRate, selectedTenure);
  }, [selectedProduct, currentVariant, selectedTenure]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">1Fi Shop</h1>
          <p className="text-sm text-gray-500 mt-1">Discover electronics with mutual fund backed low-cost EMIs</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'marketplace'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            1Fi Marketplace
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'brands'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Top Brands
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stores'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Nearby Stores
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'marketplace' ? (
        <div className="mt-8">
          {/* Filter and Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search products or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const baseVariant = product.variants[0];
                const lowestEMI = calculateEMI(
                  baseVariant.price,
                  product.annualInterestRate,
                  product.tenureOptions[product.tenureOptions.length - 1]
                );
                const discount = Math.round(
                  ((baseVariant.originalPrice - baseVariant.price) / baseVariant.originalPrice) * 100
                );

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {discount}% OFF
                          </span>
                        )}
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-md">
                          ★ {product.rating}
                        </span>
                      </div>

                      {/* Info Container */}
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                          {product.brand}
                        </p>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 title-min-h">
                          {product.title}
                        </h3>

                        {/* Price Details */}
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(baseVariant.price)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatCurrency(baseVariant.originalPrice)}
                          </span>
                        </div>

                        {/* Lowest EMI Badge */}
                        <div className="mt-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg p-2 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-indigo-700">Lowest EMI</span>
                          <span className="text-xs font-bold text-indigo-950">
                            {formatCurrency(lowestEMI)}/mo
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                      >
                        Calculate EMI & Buy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 font-medium">No products match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State for Brands & Nearby Stores */
        <div className="mt-16 text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800">
            {activeTab === 'brands' ? 'Top Brand Partners' : 'Nearby Partner Stores'}
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            This module is being connected to retail partner APIs. Switch back to 1Fi Marketplace to view ready inventory.
          </p>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="mt-5 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Go to 1Fi Marketplace
          </button>
        </div>
      )}

      {/* EMI Calculation & Variant Modal */}
      {selectedProduct && currentVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-1.5 transition-colors"
            >
              ✕
            </button>

            {/* Modal Product Summary */}
            <div className="flex gap-4 items-center border-b border-gray-100 pb-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-16 h-16 object-cover rounded-xl bg-gray-100 flex-shrink-0"
              />
              <div>
                <span className="text-xs font-bold uppercase text-indigo-600">{selectedProduct.brand}</span>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{selectedProduct.title}</h3>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {formatCurrency(currentVariant.price)}
                </p>
              </div>
            </div>

            {/* Select Variant */}
            <div className="mt-5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Select Variant</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {selectedProduct.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedVariantId === variant.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div>{variant.name}</div>
                    <div className="text-[10px] text-gray-500 font-normal mt-0.5">
                      {formatCurrency(variant.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Tenure */}
            <div className="mt-5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Select EMI Tenure</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {selectedProduct.tenureOptions.map((tenure) => (
                  <button
                    key={tenure}
                    onClick={() => setSelectedTenure(tenure)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedTenure === tenure
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {tenure} Mo
                  </button>
                ))}
              </div>
            </div>

            {/* EMI Breakdown Box */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-indigo-500/10 border border-indigo-100">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-indigo-900">Estimated Monthly EMI</span>
                <span className="text-2xl font-black text-indigo-900">{formatCurrency(modalEMI)}<span className="text-xs font-normal">/mo</span></span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-indigo-100/60">
                <span>Tenure: {selectedTenure} Months</span>
                <span>Interest: {(selectedProduct.annualInterestRate * 100).toFixed(0)}% p.a.</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                alert(`Proceeding to 1Fi MF-Backed Loan Approval for ${selectedProduct.title} (${currentVariant.name}) at ${formatCurrency(modalEMI)}/mo`);
                handleCloseModal();
              }}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              Apply with Mutual Funds
            </button>
          </div>
        </div>
      )}
    </div>
  );
}