import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';
import { api } from '../../lib/api';
import type { UserAccount } from '../../lib/api';

const ROLE_OPTIONS = [
  { id: 'super_admin', name: 'Super Admin' },
  { id: 'admin_hr', name: 'Admin HR' },
  { id: 'manager_divisi', name: 'Manager Divisi' },
  { id: 'staf_viewer', name: 'Staf Viewer' },
];

const DEPARTEMENT_OPTIONS = [
  'Direksi', 'Sekretariat', 'Keuangan', 'Program',
  'Fundraising & Partnership', 'HRD', 'Humas, GA, dan IT'
];

const AVATAR_COLORS = ['#1e3a7a', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#be185d', '#4338ca'];

const emptyUser: Omit<UserAccount, 'id' | 'created_at'> = {
  email: '',
  nama: '',
  role_id: 'staf_viewer',
  role_name: 'Staf Viewer',
  departement: '',
  is_active: true,
  avatar_color: '#1e3a7a',
};

export const UserManagement: React.FC = () => {
  const session = useStore($userSession);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [formData, setFormData] = useState(emptyUser);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsersList();
      if (res.success) setUsers(res.data);
    } catch (e) {}
    finally { setLoading(false); }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search || u.nama.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = !filterRole || u.role_id === filterRole;
      const matchStatus = !filterStatus || (filterStatus === 'active' ? u.is_active : !u.is_active);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, filterRole, filterStatus]);

  const openAddForm = () => {
    setEditingUser(null);
    setFormData(emptyUser);
    setShowForm(true);
  };

  const openEditForm = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      nama: user.nama,
      role_id: user.role_id,
      role_name: user.role_name,
      departement: user.departement,
      is_active: user.is_active,
      avatar_color: user.avatar_color,
    });
    setShowForm(true);
  };

  const handleRoleChange = (roleId: string) => {
    const role = ROLE_OPTIONS.find(r => r.id === roleId);
    setFormData(prev => ({ ...prev, role_id: roleId, role_name: role?.name || '' }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    try {
      if (editingUser) {
        const updated: UserAccount = { ...editingUser, ...formData };
        await api.saveUser(updated, session.user.email);
      } else {
        const newUser: UserAccount = {
          id: 'usr_' + Math.random().toString(36).substring(2, 11),
          ...formData,
          created_at: new Date().toISOString(),
        };
        await api.saveUser(newUser, session.user.email);
      }
      setShowForm(false);
      await fetchUsers();
    } catch (e) {
      alert('Gagal menyimpan user.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: UserAccount) => {
    if (!session) return;
    if (!confirm(`${user.is_active ? 'Nonaktifkan' : 'Aktifkan'} akun ${user.nama}?`)) return;
    await api.toggleUserStatus(user.id, session.user.email);
    await fetchUsers();
  };

  const handleDelete = async () => {
    if (!session || !deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteUser(deleteTarget.id, session.user.email);
      setDeleteTarget(null);
      await fetchUsers();
    } catch (e) {
      alert('Gagal menghapus user.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (d?: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Stats
  const totalActive = users.filter(u => u.is_active).length;
  const totalInactive = users.filter(u => !u.is_active).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1e3a7a]"></div>
        <p className="text-sm text-slate-500 mt-4 font-semibold">Memuat data akun...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Akun</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Aktif</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalActive}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Nonaktif</p>
          <p className="text-2xl font-extrabold text-rose-500 mt-1">{totalInactive}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Role Terbanyak</p>
          <p className="text-sm font-extrabold text-blue-600 mt-2 truncate">
            {(() => {
              const counts: Record<string, number> = {};
              users.forEach(u => counts[u.role_name] = (counts[u.role_name] || 0) + 1);
              const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
              return top ? top[0] : '-';
            })()}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-grow">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold w-64"
            />
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold bg-white"
            >
              <option value="">Semua Role</option>
              {ROLE_OPTIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold bg-white"
            >
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
          <button
            onClick={openAddForm}
            className="px-5 py-2.5 bg-[#1e3a7a] hover:bg-[#162d63] text-white rounded-xl font-bold transition-all shadow-md whitespace-nowrap"
          >
            + Tambah Akun
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Departemen</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Terdaftar</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Login Terakhir</th>
                <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-semibold">
                    Tidak ada data akun yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: user.avatar_color }}
                        >
                          {user.nama[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{user.nama}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {user.role_name}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-600 hidden md:table-cell">{user.departement || '-'}</td>
                    <td className="px-5 py-3 text-slate-500 font-medium hidden lg:table-cell">{formatDate(user.created_at)}</td>
                    <td className="px-5 py-3 text-slate-500 font-medium hidden lg:table-cell">{formatDateTime(user.last_login)}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-lg font-bold text-[10px] ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEditForm(user)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-1.5 rounded-lg transition-colors ${user.is_active ? 'hover:bg-amber-50 text-amber-500 hover:text-amber-700' : 'hover:bg-emerald-50 text-emerald-500 hover:text-emerald-700'}`}
                          title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {user.is_active ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-400 hover:text-rose-600 transition-colors"
                          title="Hapus"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
            Menampilkan {filteredUsers.length} dari {users.length} akun
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-[#0f2557]">{editingUser ? 'Edit Akun' : 'Tambah Akun Baru'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={e => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold"
                  required
                  disabled={!!editingUser}
                />
                {editingUser && <p className="text-[10px] text-slate-400 mt-1">Email tidak dapat diubah.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Role *</label>
                  <select
                    value={formData.role_id}
                    onChange={e => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold bg-white"
                    required
                  >
                    {ROLE_OPTIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Departemen *</label>
                  <select
                    value={formData.departement}
                    onChange={e => setFormData(prev => ({ ...prev, departement: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#1e3a7a] font-semibold bg-white"
                    required
                  >
                    <option value="">Pilih Departemen</option>
                    {DEPARTEMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Warna Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar_color: color }))}
                      className={`w-8 h-8 rounded-xl transition-all ${formData.avatar_color === color ? 'ring-2 ring-offset-2 ring-[#1e3a7a] scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status Akun</label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 max-w-xs">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                    className="text-[#1e3a7a] focus:ring-[#1e3a7a] w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-slate-700">Akun Aktif</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#1e3a7a] hover:bg-[#162d63] disabled:bg-blue-300 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  {saving ? 'Menyimpan...' : editingUser ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 mb-2">Hapus Akun</h3>
              <p className="text-sm text-slate-500 mb-6">
                Yakin ingin menghapus akun <strong className="text-slate-800">{deleteTarget.nama}</strong> ({deleteTarget.email})? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
