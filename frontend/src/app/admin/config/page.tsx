'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import {
  Settings,
  MapPin,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Globe,
  Bell,
  X,
  Grid,
  Pencil
} from 'lucide-react';

interface City {
  name: string;
  state: string;
  image: string;
  listingCount: number;
  isActive: boolean;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  isActive: boolean;
}

export default function AdminConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'cities' | 'banners'>('cities');

  // New city form
  const [newCity, setNewCity] = useState({ name: '', state: '', image: '', listingCount: 0 });

  // New banner form
  const [newBanner, setNewBanner] = useState({ title: '', description: '', linkUrl: '/', isActive: true });

  const fetchConfig = async () => {
    setLoading(true);
    const res = await fetchApi('/admin/config');
    if (res.success && res.data) setConfig(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    const res = await fetchApi('/admin/config', {
      method: 'PUT',
      body: JSON.stringify({
        popularCities: config.popularCities,
        bannerAnnouncements: config.bannerAnnouncements
      })
    });

    if (res.success) {
      alert('Configuration saved and published to live site!');
    } else {
      alert(res.message || 'Save failed');
    }
    setSaving(false);
  };

  const addCity = () => {
    if (!newCity.name || !newCity.state) return;
    setConfig({
      ...config,
      popularCities: [
        ...(config.popularCities || []),
        {
          name: newCity.name,
          state: newCity.state,
          image: newCity.image || 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
          listingCount: Number(newCity.listingCount || 0),
          isActive: true
        }
      ]
    });
    setNewCity({ name: '', state: '', image: '', listingCount: 0 });
  };

  const removeCity = (idx: number) => {
    setConfig({
      ...config,
      popularCities: (config.popularCities || []).filter((_: any, i: number) => i !== idx)
    });
  };

  const toggleCity = (idx: number) => {
    const cities = [...(config.popularCities || [])];
    cities[idx].isActive = !cities[idx].isActive;
    setConfig({ ...config, popularCities: cities });
  };

  const addBanner = () => {
    if (!newBanner.title || !newBanner.description) return;
    setConfig({
      ...config,
      bannerAnnouncements: [
        ...(config.bannerAnnouncements || []),
        {
          id: `b${Date.now()}`,
          title: newBanner.title,
          description: newBanner.description,
          linkUrl: newBanner.linkUrl,
          isActive: true
        }
      ]
    });
    setNewBanner({ title: '', description: '', linkUrl: '/', isActive: true });
  };

  const removeBanner = (idx: number) => {
    setConfig({
      ...config,
      bannerAnnouncements: (config.bannerAnnouncements || []).filter((_: any, i: number) => i !== idx)
    });
  };

  const toggleBanner = (idx: number) => {
    const banners = [...(config.bannerAnnouncements || [])];
    banners[idx].isActive = !banners[idx].isActive;
    setConfig({ ...config, bannerAnnouncements: banners });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" /> System Administration
          </div>
          <h1 className="text-2xl font-black text-white">Platform Configuration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage popular city cards, homepage banners, and dynamic content across the StayBite platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchConfig}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Reload
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !config}
            className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save & Publish Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('cities')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'cities'
              ? 'bg-teal-600 text-white'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Popular Cities ({config?.popularCities?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'banners'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          Banners ({config?.bannerAnnouncements?.length || 0})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-500 mb-2" />
          <p className="text-slate-400 text-xs">Loading configuration...</p>
        </div>
      ) : (
        <>
          {/* Popular Cities Tab */}
          {activeTab === 'cities' && (
            <div className="space-y-5">
              {/* Existing Cities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(config?.popularCities || []).map((city: City, idx: number) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border overflow-hidden relative group ${
                      city.isActive ? 'border-slate-700 bg-slate-950' : 'border-slate-800 bg-slate-950 opacity-50'
                    }`}
                  >
                    <div className="relative h-32">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <h4 className="font-bold text-sm">{city.name}</h4>
                        <p className="text-xs text-slate-300">{city.state}</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition">
                        <button
                          onClick={() => toggleCity(idx)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                            city.isActive
                              ? 'bg-amber-500/80 text-slate-900'
                              : 'bg-teal-500/80 text-slate-900'
                          }`}
                        >
                          {city.isActive ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => removeCity(idx)}
                          className="p-1 bg-rose-500/80 text-white rounded-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{city.listingCount} listings</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        city.isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {city.isActive ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New City */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-teal-400" /> Add New City
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="City name (e.g. Nashik)"
                    value={newCity.name}
                    onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="State (e.g. Maharashtra)"
                    value={newCity.state}
                    onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Image URL (Unsplash recommended)"
                    value={newCity.image}
                    onChange={(e) => setNewCity({ ...newCity, image: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="number"
                    placeholder="Listing count"
                    value={newCity.listingCount}
                    onChange={(e) => setNewCity({ ...newCity, listingCount: parseInt(e.target.value) })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={addCity}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Add City to List
                </button>
              </div>
            </div>
          )}

          {/* Banners Tab */}
          {activeTab === 'banners' && (
            <div className="space-y-5">
              {/* Existing Banners */}
              <div className="space-y-3">
                {(config?.bannerAnnouncements || []).map((banner: Banner, idx: number) => (
                  <div
                    key={idx}
                    className={`bg-slate-950 rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      banner.isActive ? 'border-slate-700' : 'border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{banner.title}</h4>
                      <p className="text-xs text-slate-400">{banner.description}</p>
                      <a
                        href={banner.linkUrl}
                        className="text-[11px] text-teal-400 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        → {banner.linkUrl}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleBanner(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          banner.isActive
                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                            : 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30'
                        }`}
                      >
                        {banner.isActive ? 'Hide Banner' : 'Show Banner'}
                      </button>
                      <button
                        onClick={() => removeBanner(idx)}
                        className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg border border-rose-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Banner */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" /> Add New Announcement Banner
                </h3>
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Banner title (with emoji!) e.g. 🎉 Student Launch Offer!"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Short description shown below the title"
                    value={newBanner.description}
                    onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="CTA Link URL (e.g. /pricing or /rooms)"
                    value={newBanner.linkUrl}
                    onChange={(e) => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={addBanner}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-xs transition"
                >
                  Add Banner
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
