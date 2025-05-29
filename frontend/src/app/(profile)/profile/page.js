'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Tambahan
import { Pencil, Eye, EyeOff } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const router = useRouter(); // ✅ Tambahan
  const { ensureUser, user, handleLogout } = useAuth();

  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState(user?.username ?? '');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  const handleUsernameEdit = () => {
    setEditingUsername(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleBack = () => {
    window.history.back();
  };

  const Logout = async () => {
    const validLogout = await handleLogout()
    if(validLogout) {
      router.push('/'); // ✅ Redirect ke halaman home
    }
  };

  const handleEnsureUser = async () => {
    const validUser = await ensureUser();
    console.log("USER", validUser)
    if (validUser == false) {
      router.push('/')
    }
  }

  useEffect(() => {
    handleEnsureUser()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#fffaf4] text-black">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white border-[2px] border-black rounded-2xl shadow-md w-full max-w-md p-8">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <img
                src="images/profile-avatar.svg"
                alt="Profile Avatar"
                className="w-24 h-24 border-[2px] border-black rounded-full object-cover"
              />
            </div>

            <div className="relative mb-4">
              {editingUsername ? (
                <div className="flex flex-col items-center w-full mb-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="text-2xl font-bold text-center border-b border-black focus:outline-none mb-1"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center">{username}</h2>
                  <div
                    className="h-1 bg-black mt-1 mx-auto"
                    style={{ width: `${username?.length}ch` }}
                  ></div>
                  <button
                    onClick={handleUsernameEdit}
                    className="absolute top-0 right-[-24px] text-gray-600 hover:text-black"
                  >
                    <Pencil size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email}
                readOnly
                className="w-full px-4 py-2 border rounded-full bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black"
                  placeholder='New Password'
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {(editingUsername || password !== 'password123') && (
              <button
                type="button"
                onClick={() => {
                  setUsername(newUsername);
                  setEditingUsername(false);
                  alert('Perubahan profil berhasil disimpan.');
                }}
                className="w-full py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              >
                Save Changes
              </button>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 rounded-full border border-black hover:bg-black hover:text-white transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="px-6 py-2 rounded-full bg-yellow-300 hover:bg-yellow-400 transition shadow-md"
              >
                Log Out
              </button>
            </div>
          </form>
        </div>

        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white border-[2px] border-black rounded-xl p-6 max-w-sm w-full text-center">
              <h2 className="text-xl font-semibold mb-4">Apakah kamu yakin ingin logout?</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 border border-black rounded-full hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  onClick={Logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  Ya
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
