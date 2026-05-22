"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Globe, Check, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"];

export default function CountriesAdminPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCountry, setNewCountry] = useState({
    name: "",
    code: "",
    continent: "Africa",
    coverImageId: null as string | null,
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/countries");
      if (res.ok) {
        const data = await res.json();
        setCountries(data);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch countries");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("Uploading cover image…");
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.media?.[0]) {
        const media = data.media[0];
        setNewCountry((prev) => ({ ...prev, coverImageId: media.id }));
        setCoverPreview(media.fileUrl);
        toast.success("Cover image uploaded!", { id: toastId });
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload cover image", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry.name) return;
    const toastId = toast.loading("Adding country…");

    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCountry),
      });
      const data = await res.json();
      if (res.ok) {
        setCountries((prev) => [...prev, data]);
        toast.success("Country added successfully", { id: toastId });
        setShowAddForm(false);
        setNewCountry({ name: "", code: "", continent: "Africa", coverImageId: null });
        setCoverPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add country", { id: toastId });
    }
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    const toastId = toast.loading("Updating status…");
    try {
      const res = await fetch("/api/countries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setCountries((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, active: !currentActive } : c
          )
        );
        toast.success("Status updated", { id: toastId });
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status", { id: toastId });
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white mb-2">Countries</h1>
          <p className="text-white/40 text-sm">Manage countries for safari destinations.</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); }}
          className="bg-accent text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          {showAddForm ? "Cancel" : "Add Country"}
        </button>
      </div>

      {/* Add Country Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCountry}
          className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl space-y-6 max-w-2xl"
        >
          <h3 className="text-xl font-bold text-white">New Country</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                Country Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Uganda"
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                value={newCountry.name}
                onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              />
            </div>

            {/* Flag Emoji / ISO Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                Flag Emoji or ISO Code
              </label>
              <input
                type="text"
                placeholder="e.g. 🇺🇬 or UG"
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                value={newCountry.code}
                onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })}
              />
            </div>

            {/* Continent */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                Continent
              </label>
              <select
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none appearance-none"
                value={newCountry.continent}
                onChange={(e) => setNewCountry({ ...newCountry, continent: e.target.value })}
              >
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">
              Cover / Banner Image
            </label>

            {coverPreview ? (
              <div className="relative aspect-video w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 group">
                <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/10 text-white hover:bg-accent hover:text-navy px-5 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-white/10 hover:border-accent/40 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/[0.01] hover:bg-white/[0.02] ${uploading ? "pointer-events-none opacity-50" : ""}`}
              >
                {uploading ? (
                  <p className="text-xs font-bold text-white/40">Uploading…</p>
                ) : (
                  <>
                    <Upload size={28} className="mx-auto text-white/20 mb-3" />
                    <span className="block text-xs font-bold text-white/60 mb-1">
                      Click to Upload Cover Image
                    </span>
                    <span className="block text-[10px] text-white/30">
                      Supports WEBP, JPG, PNG
                    </span>
                  </>
                )}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCoverUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className="bg-accent text-navy font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform"
          >
            Save Country
          </button>
        </form>
      )}

      {/* Countries Table */}
      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
              <tr>
                <th className="px-8 py-6">Country</th>
                <th className="px-8 py-6">Flag / Code</th>
                <th className="px-8 py-6">Continent</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-white/40">
                    Loading countries…
                  </td>
                </tr>
              ) : countries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-white/20 italic">
                    No countries found.
                  </td>
                </tr>
              ) : (
                countries.map((country) => (
                  <tr key={country.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {/* Cover thumbnail or fallback icon */}
                        {country.coverImage?.thumbnailUrl ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                            <img
                              src={country.coverImage.thumbnailUrl}
                              alt={country.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Globe size={18} className="text-accent" />
                          </div>
                        )}
                        <span className="text-white font-bold">{country.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-white/60 font-mono text-lg">
                      {country.flagEmoji || "—"}
                    </td>
                    <td className="px-8 py-5 text-white/40 text-sm">
                      {country.continent || "Africa"}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          country.active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {country.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(country.id, country.active)}
                          className={`p-2 bg-white/5 rounded-lg transition-all ${
                            country.active
                              ? "text-red-400 hover:bg-red-400/10 hover:text-red-500"
                              : "text-green-400 hover:bg-green-400/10 hover:text-green-500"
                          }`}
                          title={country.active ? "Deactivate" : "Activate"}
                        >
                          {country.active ? <X size={16} /> : <Check size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
