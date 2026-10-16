'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { fetchApi } from '../../lib/api';
import { MessCard } from '../../components/MessCard';
import { EnquiryModal } from '../../components/EnquiryModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  UtensilsCrossed,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function MessContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [messes, setMesses] = useState<any[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [mealType, setMealType] = useState(searchParams.get('mealType') || 'all');
  const [tiffinService, setTiffinService] = useState<string>(searchParams.get('tiffinService') || '');
  const [homeDelivery, setHomeDelivery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [sort, setSort] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedMessForEnquiry, setSelectedMessForEnquiry] = useState<any>(null);

  const fetchMesses = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (locality) params.set('locality', locality);
    if (query) params.set('query', query);
    if (mealType && mealType !== 'all') params.set('mealType', mealType);
    if (tiffinService) params.set('tiffinService', tiffinService);
    if (homeDelivery) params.set('homeDelivery', homeDelivery);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (breakfast) params.set('breakfast', 'true');
    if (lunch) params.set('lunch', 'true');
    if (dinner) params.set('dinner', 'true');
    if (sort) params.set('sort', sort);
    params.set('page', String(currentPage));
    params.set('limit', '12');

    const res = await fetchApi(`/messes?${params.toString()}`);
    setIsLoading(false);
    if (res.success && res.data) {
      setMesses(res.data);
      if (res.pagination) {
        setTotalListings(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    }
  };

  useEffect(() => {
    fetchMesses();
  }, [city, locality, query, mealType, tiffinService, homeDelivery, minPrice, maxPrice, breakfast, lunch, dinner, sort, currentPage]);

  const handleResetFilters = () => {
    setCity('');
    setLocality('');
    setQuery('');
    setMealType('all');
    setTiffinService('');
    setHomeDelivery('');
    setMinPrice('');
    setMaxPrice('');
    setBreakfast(false);
    setLunch(false);
    setDinner(false);
    setSort('popular');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Verified Food & Tiffin Services</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {t('messCategory')} {city && `in ${city}`}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Showing {totalListings} hygienic daily messes and doorstep tiffin providers
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2"
            >
              <Filter className="w-4 h-4 text-orange-400" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-2xl px-3 py-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400 hidden sm:inline">{t('sortBy')}:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="popular">{t('mostPopular')}</option>
                <option value="price_asc">{t('lowToHigh')}</option>
                <option value="price_desc">{t('highToLow')}</option>
                <option value="rating">{t('topRated')}</option>
                <option value="newest">{t('newestFirst')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTERS */}
          <div
            className={`lg:block ${
              showMobileFilters
                ? 'fixed inset-0 z-50 bg-slate-950/95 p-6 overflow-y-auto'
                : 'hidden'
            } lg:relative lg:p-0 lg:bg-transparent`}
          >
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2 font-bold text-white text-base">
                  <Filter className="w-4 h-4 text-orange-400" />
                  <span>Filter Messes</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-400 hover:text-orange-400 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('resetFilters')}</span>
                </button>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                >
                  <option value="">All Cities</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              {/* Locality */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Locality / Area
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Dharampeth, Kothrud..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Meal Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Diet & Meal Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'All Diets' },
                    { id: 'veg', label: '🟢 Pure Veg' },
                    { id: 'non-veg', label: '🔴 Non-Veg' },
                    { id: 'jain', label: '🟡 Jain Food' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMealType(m.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                        mealType === m.id
                          ? 'border-orange-500 bg-orange-950/40 text-orange-300'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Budget Range */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Monthly Meal Budget (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery / Tiffin toggles */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Service Options
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tiffinService === 'true'}
                    onChange={(e) => setTiffinService(e.target.checked ? 'true' : '')}
                    className="rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-800"
                  />
                  <span>🍱 Daily Tiffin Box Service</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeDelivery === 'true'}
                    onChange={(e) => setHomeDelivery(e.target.checked ? 'true' : '')}
                    className="rounded border-slate-700 text-orange-500 focus:ring-orange-500 bg-slate-800"
                  />
                  <span>🚚 Doorstep Office / PG Delivery</span>
                </label>
              </div>

              {showMobileFilters && (
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm shadow-md"
                >
                  Apply & View {totalListings} Messes
                </button>
              )}
            </div>
          </div>

          {/* LISTINGS GRID */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : messes.length === 0 ? (
              <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 p-8 space-y-4">
                <UtensilsCrossed className="w-16 h-16 text-slate-600 mx-auto" />
                <h3 className="text-xl font-bold text-white">No messes found.</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Try broadening your budget or searching in nearby locations.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md transition"
                >
                  {t('resetFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {messes.map((mess) => (
                    <MessCard
                      key={mess._id}
                      mess={mess}
                      onEnquireClick={(m) => setSelectedMessForEnquiry({ ...m, listingType: 'mess' })}
                    />
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-3 mt-12">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-semibold text-slate-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {selectedMessForEnquiry && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setSelectedMessForEnquiry(null)}
          listing={selectedMessForEnquiry}
        />
      )}
    </div>
  );
}

export default function MessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-xs">Loading Messes & Tiffins...</div>}>
      <MessContent />
    </Suspense>
  );
}
