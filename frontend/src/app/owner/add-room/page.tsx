'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { fetchApi } from '../../../lib/api';
import {
  Bed,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
  Plus,
  Trash2,
  ShieldAlert,
  Building,
  MapPin,
  IndianRupee,
  Sparkles
} from 'lucide-react';

export default function AddRoomPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  // Step 1: Basic Information
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomType, setRoomType] = useState('pg');
  const [sharingType, setSharingType] = useState('2_sharing');
  const [genderPreference, setGenderPreference] = useState('all');
  const [furnishedStatus, setFurnishedStatus] = useState('semi-furnished');

  // Step 2: Pricing
  const [rent, setRent] = useState<number | string>(5500);
  const [deposit, setDeposit] = useState<number | string>(10000);
  const [maintenanceCharges, setMaintenanceCharges] = useState<number | string>(300);
  const [electricityChargesType, setElectricityChargesType] = useState('per_unit');
  const [waterChargesType, setWaterChargesType] = useState('included');

  // Step 3: Location
  const [city, setCity] = useState('Nagpur');
  const [locality, setLocality] = useState('Dharampeth');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('440010');
  const [collegeDistances, setCollegeDistances] = useState<Array<{ collegeName: string; distanceKm: number }>>([
    { collegeName: 'VNIT Nagpur', distanceKm: 1.5 }
  ]);

  // Step 4: Amenities
  const allAmenities = [
    'Wi-Fi',
    'AC',
    'Attached Bathroom',
    'RO Drinking Water',
    'Geyser',
    'Washing Machine',
    'CCTV Security',
    'Power Backup',
    'Study Table',
    'Cupboard',
    'Covered Parking',
    'Daily Housekeeping',
    'Biometric Entry',
    'Refrigerator',
    'Food Included'
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Wi-Fi',
    'Attached Bathroom',
    'RO Drinking Water',
    'Geyser',
    'CCTV Security'
  ]);

  // Step 5: Photos & Videos
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
  ]);

  // Step 6: Rules
  const [rules, setRules] = useState<string[]>([
    'Gate closes at 10:30 PM',
    'Smoking and alcohol strictly prohibited',
    'Keep common study areas clean'
  ]);
  const [newRule, setNewRule] = useState('');

  // Step 7: Availability
  const [totalRoomsOrBeds, setTotalRoomsOrBeds] = useState(4);
  const [availableRoomsOrBeds, setAvailableRoomsOrBeds] = useState(2);
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().split('T')[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCollege = () => {
    setCollegeDistances([...collegeDistances, { collegeName: '', distanceKm: 1 }]);
  };

  const handleRemoveCollege = (index: number) => {
    setCollegeDistances(collegeDistances.filter((_, i) => i !== index));
  };

  const handleToggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = {
      title,
      description,
      city,
      locality,
      address,
      pincode,
      rent: Number(rent),
      deposit: Number(deposit),
      maintenanceCharges: Number(maintenanceCharges),
      electricityChargesType,
      waterChargesType,
      roomType,
      sharingType,
      genderPreference,
      furnishedStatus,
      amenities: selectedAmenities,
      rules,
      images,
      totalRoomsOrBeds: Number(totalRoomsOrBeds),
      availableRoomsOrBeds: Number(availableRoomsOrBeds),
      availabilityDate,
      collegeDistances: collegeDistances.filter((c) => c.collegeName.trim() !== '')
    };

    const res = await fetchApi('/rooms', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    setIsSubmitting(false);

    if (res.success) {
      alert('Room listing submitted successfully! Pending Admin verification.');
      router.push('/owner/listings');
    } else {
      alert(res.message || 'Failed to submit room listing');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}
        <div className="flex items-center space-x-3">
          <Link
            href="/owner"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Bed className="w-6 h-6 text-teal-400" />
              <span>Add New Room / PG Listing</span>
            </h1>
            <p className="text-xs text-slate-400">Step {currentStep} of 8 — Multi-step verification wizard</p>
          </div>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="grid grid-cols-8 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= currentStep ? 'bg-teal-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* WIZARD CONTAINER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 1: Basic Property Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Listing Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shree Residency Luxury 2-Sharing PG near VNIT"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the room, sunlight, ventilation, security, cleanliness, nearby landmarks..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Room / Property Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="pg">Paying Guest (PG)</option>
                    <option value="single">Single Room (Private)</option>
                    <option value="hostel">Hostel</option>
                    <option value="1rk">1 RK Studio</option>
                    <option value="1bhk">1 BHK Flat</option>
                    <option value="2bhk">2 BHK Flat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sharing Type</label>
                  <select
                    value={sharingType}
                    onChange={(e) => setSharingType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="private">Private (Single Occupancy)</option>
                    <option value="2_sharing">2 Sharing</option>
                    <option value="3_sharing">3 Sharing</option>
                    <option value="4_sharing">4 Sharing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender Preference</label>
                  <select
                    value={genderPreference}
                    onChange={(e) => setGenderPreference(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="all">Co-living (All / Any)</option>
                    <option value="boys">Boys Only</option>
                    <option value="girls">Girls Only</option>
                    <option value="family">Family Preferred</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Furnishing Status</label>
                  <select
                    value={furnishedStatus}
                    onChange={(e) => setFurnishedStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="fully-furnished">Fully Furnished (Bed, Mat, AC, Desk)</option>
                    <option value="semi-furnished">Semi Furnished (Fan, Lights, Cupboard)</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRICING */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 2: Rent & Financial Terms
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Rent per Bed/Room (₹)</label>
                  <input
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Maintenance (₹)</label>
                  <input
                    type="number"
                    value={maintenanceCharges}
                    onChange={(e) => setMaintenanceCharges(e.target.value)}
                    placeholder="0 if included"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Electricity Billing</label>
                  <select
                    value={electricityChargesType}
                    onChange={(e) => setElectricityChargesType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="per_unit">Per sub-meter reading (₹8-10/unit)</option>
                    <option value="included">Included in monthly rent</option>
                    <option value="fixed_monthly">Fixed monthly electricity fee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Water Charges</label>
                  <select
                    value={waterChargesType}
                    onChange={(e) => setWaterChargesType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="included">Included in rent (24/7 Supply)</option>
                    <option value="fixed_monthly">Fixed monthly fee</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION & DISTANCES */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 3: Location & Nearby Colleges
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Nagpur">Nagpur</option>
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Locality / Landmark</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Dharampeth"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Complete Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot/Flat No., Building Name, Street Name"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Nearby Colleges */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">Nearby Colleges / IT Parks</label>
                  <button
                    type="button"
                    onClick={handleAddCollege}
                    className="text-xs text-teal-400 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Distance</span>
                  </button>
                </div>

                {collegeDistances.map((col, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={col.collegeName}
                      onChange={(e) => {
                        const copy = [...collegeDistances];
                        copy[idx].collegeName = e.target.value;
                        setCollegeDistances(copy);
                      }}
                      placeholder="e.g. VNIT Nagpur"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="number"
                      value={col.distanceKm}
                      onChange={(e) => {
                        const copy = [...collegeDistances];
                        copy[idx].distanceKm = Number(e.target.value);
                        setCollegeDistances(copy);
                      }}
                      placeholder="Km"
                      className="w-24 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCollege(idx)}
                      className="p-2 text-red-400 hover:bg-slate-800 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: AMENITIES */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 4: Amenities Checklist
              </h3>
              <p className="text-xs text-slate-400">Select all amenities available at this property:</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allAmenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`p-3.5 rounded-2xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-950/40 text-teal-300 shadow-md'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span>{amenity}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: PHOTOS & VIDEOS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 5: Photos & Media
              </h3>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste Image URL (or use default high-res photos)"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold"
                >
                  Add Photo
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                    <Image src={img} alt="Uploaded" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: RULES */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 6: House Rules & Timings
              </h3>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="e.g. Visitors allowed in lobby until 8 PM"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold"
                >
                  Add Rule
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {rules.map((rule, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-between text-xs text-slate-200">
                    <span>• {rule}</span>
                    <button
                      type="button"
                      onClick={() => setRules(rules.filter((_, i) => i !== idx))}
                      className="text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: AVAILABILITY */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 7: Room & Bed Availability
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Rooms / Beds</label>
                  <input
                    type="number"
                    value={totalRoomsOrBeds}
                    onChange={(e) => setTotalRoomsOrBeds(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Currently Vacant Beds</label>
                  <input
                    type="number"
                    value={availableRoomsOrBeds}
                    onChange={(e) => setAvailableRoomsOrBeds(Number(e.target.value))}
                    min={1}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Available Move-In Date</label>
                  <input
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: PREVIEW & SUBMIT */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                Step 8: Final Review & Submit for Verification
              </h3>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300">
                🛡️ <strong>Admin Approval Policy:</strong> To maintain strict tenant safety and quality standards, this listing will be reviewed by our verification team. Once approved, it will receive the <strong>✓ StayBite Verified</strong> badge and go live to thousands of searchers.
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                <p><strong>Title:</strong> {title || 'Untitled Room'}</p>
                <p><strong>Location:</strong> {address}, {locality}, {city} - {pincode}</p>
                <p><strong>Rent:</strong> ₹{rent}/month • <strong>Deposit:</strong> ₹{deposit}</p>
                <p><strong>Type:</strong> {roomType} ({sharingType}) • <strong>Furnished:</strong> {furnishedStatus}</p>
                <p><strong>Amenities:</strong> {selectedAmenities.join(', ')}</p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white font-bold text-sm shadow-xl shadow-teal-950/50 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit for Admin Approval'}</span>
              </button>
            </div>
          )}

          {/* PREV & NEXT CONTROLS */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 8 && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !title) {
                    alert('Please enter a listing title');
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center space-x-1 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
