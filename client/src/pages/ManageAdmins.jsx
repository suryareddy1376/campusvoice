import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { formatDateTime } from '../utils/formatters';
import Navbar from '../components/Navbar';

const DEPARTMENTS = [
  { id: 'Hostel',         label: '🏠 Hostel & Accommodation',     color: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50',   ring: 'ring-indigo-500/30'  },
  { id: 'Academic',       label: '📚 Academic & Faculty',          color: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/50',         ring: 'ring-cyan-500/30'    },
  { id: 'Infrastructure', label: '🏗️ Infrastructure & Facilities', color: 'bg-orange-900/50 text-orange-300 border-orange-700/50',   ring: 'ring-orange-500/30'  },
  { id: 'IT',             label: '💻 IT & Technology',             color: 'bg-purple-900/50 text-purple-300 border-purple-700/50',   ring: 'ring-purple-500/30'  },
  { id: 'Cafeteria',      label: '🍽️ Cafeteria & Mess',            color: 'bg-rose-900/50 text-rose-300 border-rose-700/50',         ring: 'ring-rose-500/30'    },
  { id: 'Sports',         label: '⚽ Sports & Recreation',         color: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50', ring: 'ring-emerald-500/30' },
  { id: 'Finance',        label: '💰 Finance & Fees',              color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',   ring: 'ring-yellow-500/30'  },
  { id: 'Security',       label: '🛡️ Security & Safety',           color: 'bg-slate-700/50 text-slate-300 border-slate-600/50',      ring: 'ring-slate-500/30'   },
];

export default function ManageAdmins() {
  const { user } = useAuth();
  const { admins, loading, fetchAdmins, createAdmin, deleteAdmin } = useUsers();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('All');
  const [adminLevel, setAdminLevel] = useState(1);
  const [creationError, setCreationError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [openDepts, setOpenDepts] = useState(new Set(DEPARTMENTS.map(d => d.id)));

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreationError(null);
    setIsCreating(true);
    try {
      await createAdmin(name, email, password, department, adminLevel);
      setName('');
      setEmail('');
      setPassword('');
      setDepartment('All');
      setAdminLevel(1);
      fetchAdmins();
    } catch (err) {
      setCreationError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAdmin = async (id, adminName) => {
    if (window.confirm(`Are you sure you want to delete the admin account for ${adminName}?`)) {
      try {
        await deleteAdmin(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const prefillDepartment = (deptId) => {
    setDepartment(deptId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDept = (deptId) => {
    setOpenDepts(prev => {
      const next = new Set(prev);
      next.has(deptId) ? next.delete(deptId) : next.add(deptId);
      return next;
    });
  };

  const adminsByDept = DEPARTMENTS.reduce((acc, dept) => {
    acc[dept.id] = admins.filter(a => a.role === 'admin' && a.department === dept.id);
    return acc;
  }, {});

  const superAdmins = admins.filter(a => a.role === 'super_admin');
  const totalAdmins = admins.filter(a => a.role === 'admin').length;

  return (
    <div className="min-h-screen bg-slate-900 pb-20 sm:pb-0">
      <Navbar
        title="👑 Manage Admins"
        subtitle="Create and remove system administrators"
        links={[
          { to: '/admin', label: '🏠 Dashboard', className: 'text-slate-400 hover:text-white transition-colors' },
        ]}
      />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Create Admin Form ── */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24 bg-slate-900/60 border border-white/10">
              <h2 className="text-base font-semibold text-white mb-1">Create New Admin</h2>
              {department !== 'All' ? (
                <p className="text-xs text-violet-400 mb-4">
                  Pre-filling for: <span className="font-semibold">{department}</span> dept
                </p>
              ) : (
                <p className="text-xs text-slate-500 mb-4">Click "+ Add" on a department to pre-fill</p>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {creationError && (
                  <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-xs rounded-lg px-3 py-2">
                    {creationError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full clay-input px-3 py-2 text-sm text-white placeholder-slate-500"
                    placeholder="Jane Admin"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full clay-input px-3 py-2 text-sm text-white placeholder-slate-500"
                    placeholder="admin@campus.edu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <input
                    type="password" required minLength={6} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full clay-input px-3 py-2 text-sm text-white placeholder-slate-500"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department Scope</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none"
                  >
                    <option value="All">All Departments (General Admin)</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.id}</option>
                    ))}
                  </select>
                </div>

                {department !== 'All' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Role Type</label>
                    <select
                      value={adminLevel}
                      onChange={(e) => setAdminLevel(Number(e.target.value))}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple transition-all outline-none"
                    >
                      <option value={1}>👤 Department Staff (Level 1)</option>
                      <option value={2}>🎓 Head of Department — HOD (Level 2)</option>
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {adminLevel === 1 
                        ? 'Staff handle new complaints. Auto-escalated to HOD after 48h.' 
                        : 'HOD receives escalated complaints. Auto-escalated to Chairman after 7 days.'}
                    </p>
                  </div>
                )}

                <button
                  type="submit" disabled={isCreating}
                  className="w-full bg-gradient-to-r from-neonPurple to-neonBlue text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-neonPurple/20 disabled:opacity-50 transition-all hover:-translate-y-0.5 uppercase tracking-wide flex justify-center items-center gap-2 mt-4"
                >
                  {isCreating ? 'Creating...' : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Admin
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right Column: Department Admins ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Super Admins */}
            {superAdmins.length > 0 && (
              <div className="glass-card overflow-hidden bg-slate-900/60 border border-white/10">
                <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-purple-900/20">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg text-base bg-purple-800/60 border border-purple-600/50">👑</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Super Admins</h3>
                    <p className="text-xs text-purple-400">Full system access</p>
                  </div>
                  <span className="ml-auto text-xs bg-purple-900/60 text-purple-300 border border-purple-700/50 px-2.5 py-0.5 rounded-full">
                    {superAdmins.length} account{superAdmins.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {superAdmins.map(admin => (
                    <div key={admin.id} className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-300 font-bold shrink-0">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white flex items-center gap-2 flex-wrap">
                          {admin.name}
                          {admin.id === user?.id && (
                            <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">You</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{admin.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-3 px-1">
              <h2 className="text-sm font-semibold text-white">Department Admins</h2>
              <span className="text-xs text-slate-500">
                {totalAdmins} admins across {DEPARTMENTS.filter(d => adminsByDept[d.id]?.length > 0).length} departments
              </span>
            </div>

            {/* Department Accordion */}
            {DEPARTMENTS.map((dept) => {
              const deptAdmins = adminsByDept[dept.id] || [];
              const isOpen = openDepts.has(dept.id);
              return (
                <div key={dept.id} className={`glass-card overflow-hidden bg-slate-900/40 border border-white/10 ring-1 ${dept.ring}`}>
                  {/* Header row */}
                  <button
                    onClick={() => toggleDept(dept.id)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-slate-700/20 transition-colors text-left"
                  >
                    <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full border font-medium ${dept.color}`}>
                      {dept.id}
                    </span>
                    <span className="text-sm font-medium text-white flex-1 truncate">{dept.label}</span>

                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      deptAdmins.length > 0
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {deptAdmins.length} admin{deptAdmins.length !== 1 ? 's' : ''}
                    </span>

                    <button
                      onClick={(e) => { e.stopPropagation(); prefillDepartment(dept.id); }}
                      className="shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-700/50 hover:bg-violet-600/30 text-slate-400 hover:text-violet-300 border border-slate-600 hover:border-violet-500/50 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add
                    </button>

                    <svg className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Admin rows */}
                  {isOpen && (
                    <div className="border-t border-white/5">
                      {deptAdmins.length === 0 ? (
                        <div className="p-5 text-center">
                          <p className="text-xs text-slate-500 mb-2">No admins assigned yet</p>
                          <button
                            onClick={() => prefillDepartment(dept.id)}
                            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            + Assign the first admin →
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-700/50">
                          {deptAdmins.map(admin => (
                            <div key={admin.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-700/10 transition-colors">
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm shrink-0 ${dept.color}`}>
                                {admin.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white flex items-center gap-2 flex-wrap">
                                  {admin.name}
                                  {admin.level === 2 && (
                                    <span className="bg-amber-900/40 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 font-bold tracking-wider">HOD</span>
                                  )}
                                  {admin.level === 1 && (
                                    <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-600/50">STAFF</span>
                                  )}
                                  {admin.id === user?.id && (
                                    <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">You</span>
                                  )}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{admin.email}</p>
                              </div>
                              <div className="text-right shrink-0 hidden sm:block">
                                <p className="text-[10px] text-slate-500">Added</p>
                                <p className="text-[10px] text-slate-400">{formatDateTime(admin.created_at)}</p>
                              </div>
                              {admin.id !== user?.id && (
                                <button
                                  onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                                  title="Remove Admin"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
