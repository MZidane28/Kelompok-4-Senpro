'use client'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('John Doe');
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [profileImage, setProfileImage] = useState('images/profile-avatar.svg');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameEdit = () => {
    setEditingUsername(true);
  };

  const handleUsernameSave = () => {
    setUsername(newUsername);
    setEditingUsername(false);
  };

  const handleProfileImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.type !== 'image/jpeg') {
      alert('Hanya file JPG yang diperbolehkan.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran file maksimal 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfileImage(base64);
      localStorage.setItem('profileImage', base64);
    };
    reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('profileImage');
    }

    // Delay sedikit untuk memastikan localStorage selesai
    setTimeout(() => {
      router.push('/');
    }, 100);
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#fffaf4] text-black">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="bg-white border-[2px] border-black rounded-2xl shadow-md w-full max-w-md p-8">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={profileImage}
                alt="Profile Avatar"
                className="w-24 h-24 border-[2px] border-black rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 border-[0.5px] hover:bg-gray-100 cursor-pointer">
                <Pencil size={16} />
                <input
                  type="file"
                  accept=".jpg"
                  onChange={handleProfileImageChange}
                  className="hidden"
              />
              </label>
            </div>

            {editingUsername ? (
              <div className="flex flex-col items-center w-full mb-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="text-2xl font-bold text-center border-b border-black focus:outline-none mb-1"
                />
                <button onClick={handleUsernameSave} className="text-sm text-blue-600 hover:underline">
                  Save
                </button>
              </div>
            ) : (
              <div className="relative mb-4">
                <h2 className="text-2xl font-bold text-center">
                  {username}
                </h2>
                <div className="h-1 bg-black mt-1 mx-auto" style={{ width: `${username.length}ch` }}></div>
                <button
                  onClick={handleUsernameEdit}
                  className="absolute top-0 right-[-24px] text-gray-600 hover:text-black"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                defaultValue="tungtung@gmail.com"
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="password123"
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-black"
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

            <p className="text-sm text-center">
              Want to change your password? No worries —{' '}
              <Link href="/forgot-password" className="font-semibold underline">reset it here.</Link>
            </p>

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
                onClick={handleLogout}
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
