'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { fetchApi } from '../../lib/api';
import { RoomCard } from '../../components/RoomCard';
import { EnquiryModal } from '../../components/EnquiryModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Bed,
  IndianRupee,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

function RoomsContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [rooms, setRooms] = useState<any[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'all');
  const [genderPreference, setGenderPreference] = useState('all');
  const [furnishedStatus, setFurnishedStatus] = useState('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [selectedRoomForEnquiry, setSelectedRoomForEnquiry] = useState<any>(null);

  const amenityList = [
    'Wi-Fi',
    'AC',
    'Attached Bathroom',
    'RO Drinking Water',
    'Geyser',
    'Washing Machine',
    'CCTV Security',
    'Power Backup',
    'Study Table',
    'Covered Parking',
    'Daily Housekeeping'
  ];

  const fetchRooms = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (locality) params.set('locality', locality);
    if (query) params.set('query', query);
    if (roomType && roomType !== 'all') params.set('roomType', roomType);
    if (genderPreference && genderPreference !== 'all') params.set('genderPreference', genderPreference);
    if (furnishedStatus && furnishedStatus !== 'all') params.set('furnishedStatus', furnishedStatus);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
    if (sort) params.set('sort', sort);
    params.set('page', String(currentPage));
    params.set('limit', '12');

    const res = await fetchApi(`/rooms?${params.toString()}`);
    setIsLoading(false);
    if (res.success && res.data) {
      setRooms(res.data);
      if (res.pagination) {
        setTotalListings(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      }
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [city, locality, query, roomType, genderPreference, furnishedStatus, minPrice, maxPrice, selectedAmenities, sort, currentPage]);

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleResetFilters = () => {
    setCity('');
    setLocality('');
    setQuery('');
    setRoomType('all');
    setGenderPreference('all');
    setFurnishedStatus('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    setSort('popular');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Bed className="w-4 h-4" />
              <span>Verified Accommodations</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {t('roomsCategory')} {city && `in ${city}`}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Showing {totalListings} verified rooms, PGs, and hostels with zero brokerage
            </p>
          </div>

          {/* SORTING & MOBILE FILTER TRIGGER */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2"
            >
              <Filter className="w-4 h-4 text-teal-400" />
              <span>Filters ({selectedAmenities.length + (roomType !== 'all' ? 1 : 0) + (city ? 1 : 0)})</span>
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

        {/* MAIN LAYOUT WITH SIDEBAR FILTERS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* DESKTOP & MOBILE FILTER DRAWER */}
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
                  <Filter className="w-4 h-4 text-teal-400" />
                  <span>Filter Stays</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-400 hover:text-teal-400 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('resetFilters')}</span>
                </button>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                >
                  <option value="">All Cities</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              {/* Locality Search */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Locality / Area
                </label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Dharampeth, Hinjewadi..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Property / Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                >
                  <option value="all">All Room Types</option>
                  <option value="single">Single Room (Private)</option>
                  <option value="pg">Paying Guest (PG)</option>
                  <option value="hostel">Hostel</option>
                  <option value="1rk">1 RK Studio</option>
                  <option value="1bhk">1 BHK Flat</option>
                  <option value="2bhk">2 BHK Flat</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Gender Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'All / Co-living' },
                    { id: 'boys', label: 'Boys Only' },
                    { id: 'girls', label: 'Girls Only' },
                    { id: 'family', label: 'Family' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGenderPreference(g.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition ${
                        genderPreference === g.id
                          ? 'border-teal-500 bg-teal-950/40 text-teal-300'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {t('budgetRange')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Furnished Status */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Furnishing
                </label>
                <select
                  value={furnishedStatus}
                  onChange={(e) => setFurnishedStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                >
                  <option value="all">Any Furnishing</option>
                  <option value="fully-furnished">Fully Furnished</option>
                  <option value="semi-furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {t('amenities')}
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {amenityList.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-800 w-3.5 h-3.5"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {showMobileFilters && (
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 rounded-2xl bg-teal-500 text-white font-bold text-sm shadow-md"
                >
                  Apply & View {totalListings} Listings
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
            ) : rooms.length === 0 ? (
              <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 p-8 space-y-4">
                <Bed className="w-16 h-16 text-slate-600 mx-auto" />
                <h3 className="text-xl font-bold text-white">{t('emptyListings')}</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Try broadening your budget range, resetting specific filters, or searching in popular areas like Dharampeth, Hinjewadi, or Andheri.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-md transition"
                >
                  {t('resetFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room._id}
                      room={room}
                      onEnquireClick={(r) => setSelectedRoomForEnquiry({ ...r, listingType: 'room' })}
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
      {selectedRoomForEnquiry && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setSelectedRoomForEnquiry(null)}
          listing={selectedRoomForEnquiry}
        />
      )}
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400 text-xs">Loading Rooms & PGs...</div>}>
      <RoomsContent />
    </Suspense>
  );
}
