"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Globe, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CountriesAdminPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCountry, setNewCountry] = useState({ name: "", code: "", description: "" });

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/countries");
      if (res.ok) {
        const data = await res.json();
        setCountries(data);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      console.warn("DB offline, loading mock countries.");
      setCountries([
        {
          id: "mock-c-1",
          name: "Kenya",
          code: "KE",
          description: "East African country famous for its scenic landscapes and vast wildlife preserves.",
          isActive: true
        },
        {
          id: "mock-c-2",
          name: "Tanzania",
          code: "TZ",
          description: "Known for its vast wilderness areas, including the plains of Serengeti National Park.",
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry.name || !newCountry.code) return;

    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCountry),
      });
      if (res.ok) {
        const created = await res.json();
        setCountries([...countries, created]);
        toast.success("Country added successfully");
        setShowAddForm(false);
        setNewCountry({ name: "", code: "", description: "" });
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      const mockCreated = {
        id: `mock-c-${Date.now()}`,
        name: newCountry.name,
        code: newCountry.code.toUpperCase(),
        description: newCountry.description,
        isActive: true
      };
      setCountries([...countries, mockCreated]);
      toast.success("Mock: Country added successfully (Offline mode)");
      setShowAddForm(false);
      setNewCountry({ name: "", code: "", description: "" });
    }
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/countries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });
      if (res.ok) {
        setCountries(countries.map(c => c.id === id ? { ...c, isActive: !currentActive } : c));
        toast.success("Status updated");
      } else {
        throw new Error("API failed");
      }
    } catch (error) {
      setCountries(countries.map(c => c.id === id ? { ...c, isActive: !currentActive } : c));
      toast.success("Mock: Status updated");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white mb-2">Countries</h1>
          <p className="text-white/40 text-sm">Manage countries for safari destinations.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-accent text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          {showAddForm ? "Cancel" : "Add Country"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCountry} className="bg-navy-light/10 border border-white/5 p-8 rounded-3xl space-y-6 max-w-xl">
          <h3 className="text-xl font-bold text-white">New Country</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">Country Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Uganda"
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                value={newCountry.name}
                onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">ISO Code</label>
              <input 
                type="text" 
                required
                placeholder="e.g. UG"
                maxLength={2}
                className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none"
                value={newCountry.code}
                onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Description</label>
            <textarea 
              placeholder="Brief description of safari features..."
              className="w-full bg-navy border border-white/10 rounded-xl px-6 py-4 text-white focus:border-accent outline-none h-28 resize-none"
              value={newCountry.description}
              onChange={(e) => setNewCountry({ ...newCountry, description: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-accent text-navy font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform">
            Save Country
          </button>
        </form>
      )}

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">Country</th>
              <th className="px-8 py-6">Code</th>
              <th className="px-8 py-6">Continent</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-white/40">
                  Loading countries...
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
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-accent" />
                      <span className="text-white font-bold">{country.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-white/60 font-mono text-sm">
                    {country.flagEmoji || country.code}
                  </td>
                  <td className="px-8 py-6 text-white/40 text-sm max-w-xs truncate">
                    {country.continent || "Africa"}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      (country.active !== undefined ? country.active : country.isActive) ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {(country.active !== undefined ? country.active : country.isActive) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(country.id, country.active !== undefined ? country.active : country.isActive)}
                        className={`p-2 bg-white/5 rounded-lg transition-all ${
                          (country.active !== undefined ? country.active : country.isActive) 
                            ? 'text-red-400 hover:bg-red-400/10 hover:text-red-500' 
                            : 'text-green-400 hover:bg-green-400/10 hover:text-green-500'
                        }`}
                        title={(country.active !== undefined ? country.active : country.isActive) ? "Deactivate" : "Activate"}
                      >
                        {(country.active !== undefined ? country.active : country.isActive) ? <X size={18} /> : <Check size={18} />}
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
  );
}
