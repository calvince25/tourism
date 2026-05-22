"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, UserMinus, Trash2, Shield } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch users");
      }
    } catch (error: any) {
      console.error("Fetch users error:", error);
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const toastId = toast.loading("Updating user status...");
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        toast.success(`User status updated to ${newStatus}`, { id: toastId });
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      console.error("Update user error:", error);
      toast.error(error.message || "Failed to update user", { id: toastId });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const toastId = toast.loading("Deleting user...");
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        toast.success("User deleted successfully", { id: toastId });
      } else {
        throw new Error(data.error || "API failed");
      }
    } catch (error: any) {
      console.error("Delete user error:", error);
      toast.error(error.message || "Failed to delete user", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-outfit text-white mb-2">User Management</h1>
        <p className="text-white/40 text-sm">Manage dashboard users, editors, and administrative access.</p>
      </div>

      <div className="bg-navy-light/20 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/40">
            <tr>
              <th className="px-8 py-6">User Info</th>
              <th className="px-8 py-6">Role</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-white/40">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-10 text-center text-white/20 italic">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-white font-bold">{user.name}</p>
                      <p className="text-xs text-white/40">{user.email}</p>
                      {user.phone && <p className="text-[10px] text-white/30">{user.phone}</p>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1 text-white/60">
                      <Shield size={14} className="text-accent" />
                      <span className="text-xs font-semibold">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.status === 'ACTIVE' 
                        ? 'bg-green-500/10 text-green-400' 
                        : user.status === 'PENDING' 
                        ? 'bg-yellow-500/10 text-yellow-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {user.status === 'PENDING' && (
                        <button 
                          onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-400/10 transition-all"
                          title="Approve User"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                      {user.status === 'ACTIVE' && user.role !== 'SUPER_ADMIN' && (
                        <button 
                          onClick={() => handleUpdateStatus(user.id, 'SUSPENDED')}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                          title="Suspend User"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                      {user.status === 'SUSPENDED' && (
                        <button 
                          onClick={() => handleUpdateStatus(user.id, 'ACTIVE')}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-green-400 hover:bg-green-400/10 transition-all"
                          title="Activate User"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                      {user.role !== 'SUPER_ADMIN' && (
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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
