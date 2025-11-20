'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/presentation/contexts/AdminAuthContext';
import AdminSidebar from '@/presentation/components/admin/AdminSidebar';
import AdminHeader from '@/presentation/components/admin/AdminHeader';
import { 
  fetchAllUsers, 
  approveUser, 
  rejectUser, 
  blockUser, 
  unblockUser,
  type UserWithStats 
} from '@/infrastructure/services/database/adminUsers';

export default function AdminUsersPage() {
  const { user, profile, loading: authLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'blocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && profile) {
      setUsersLoaded(false); // Reset when filter changes
      loadUsers();
    }
  }, [authLoading, profile, filter]);

  const loadUsers = async () => {
    if (usersLoaded) return; // Skip if already loaded
    
    try {
      setLoading(true);
      console.log('👥 Loading admin users...');
      const startTime = Date.now();
      
      const data = await fetchAllUsers(filter === 'all' ? undefined : filter);
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Users query took: ${duration}ms`);
      console.log(`✅ Loaded ${data.length} users`);
      
      setUsers(data);
      setUsersLoaded(true);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string, userEmail: string) => {
    if (!profile) return;
    
    if (!confirm(`Approve user "${userEmail}"?`)) {
      return;
    }

    try {
      const result = await approveUser(profile.id, userId);
      if (result.success) {
        alert('User approved successfully');
        loadUsers();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId: string, userEmail: string) => {
    if (!profile) return;
    
    const reason = prompt(`Reject user "${userEmail}"?\n\nEnter reason (optional):`);
    if (reason === null) return; // User cancelled

    try {
      const result = await rejectUser(profile.id, userId, reason);
      if (result.success) {
        alert('User rejected');
        loadUsers();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  const handleBlock = async (userId: string, userEmail: string) => {
    if (!profile) return;
    
    const reason = prompt(`Block user "${userEmail}"?\n\nEnter reason (optional):`);
    if (reason === null) return; // User cancelled

    try {
      const result = await blockUser(profile.id, userId, reason);
      if (result.success) {
        alert('User blocked');
        loadUsers();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('Failed to block user');
    }
  };

  const handleUnblock = async (userId: string, userEmail: string) => {
    if (!profile) return;
    
    if (!confirm(`Unblock user "${userEmail}"?`)) {
      return;
    }

    try {
      const result = await unblockUser(profile.id, userId);
      if (result.success) {
        alert('User unblocked');
        loadUsers();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('Failed to unblock user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const pendingCount = users.filter(u => u.status === 'pending').length;

  if (authLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <AdminHeader user={profile} />
        
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
              <p className="text-slate-400">
                Manage permit holder accounts
                {pendingCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
                    {pendingCount} pending
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected', 'blocked'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No users found</p>
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.email}</p>
                            <p className="text-slate-400 text-xs">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-slate-600 text-slate-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          user.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(user.id, user.email)}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-all"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(user.id, user.email)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {user.status === 'approved' && user.role !== 'admin' && (
                            <button
                              onClick={() => handleBlock(user.id, user.email)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
                            >
                              Block
                            </button>
                          )}
                          {user.status === 'blocked' && (
                            <button
                              onClick={() => handleUnblock(user.id, user.email)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-all"
                            >
                              Unblock
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 text-slate-400 text-sm">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </main>
      </div>
    </div>
  );
}

