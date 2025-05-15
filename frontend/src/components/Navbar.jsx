'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      const imageData = localStorage.getItem('profileImage');

      if (userData) {
        setUser(JSON.parse(userData));
      }

      if (imageData) {
        setProfileImage(imageData);
      }
    }
  }, []);


  return (
    <div className="w-full bg-[#FFFBF2] text-black font-poppins px-6 py-4 flex justify-between items-center border-[3px] border-black rounded-t-none rounded-b-xl shadow-sm sticky top-0 z-50">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-1 -mr-7">
        <Image
          src="/images/Logo Empati.png"
          alt="Empati Logo"
          width={120}
          height={32}
        />
      </div>

      {/* Center: Nav Links */}
      <div className="flex items-center text-[18px] gap-8 text-md ml-20 font-semibold">
        <Link href="/#home" className="hover:underline">Home</Link>
        <Link href="/#features" className="hover:underline">Features</Link>
      </div>

      {/* Right: Conditional */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="px-3 py-1 border-[3px] border-black rounded-[5px] text-md">
              {user.name}
            </div>
            <Link href="/profile">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full border-[2px] border-black object-cover cursor-pointer hover:opacity-80 transition"
                />
              ) : (
                <Image
                  src="images/profile-avatar.svg"
                  alt="Default Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-black object-cover cursor-pointer hover:opacity-80 transition"
                />
              )}
            </Link>
          </>
        ) : (
          <>
            <Link href="/signup">
              <button className="bg-[#FCEEBE] hover:bg-[#fbe7a3] transition-all duration-200 text-black font-semibold px-4 py-1 rounded-full border-[2px] border-black shadow-sm">
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button className="hover:bg-gray-200 transition-all duration-200 text-black font-semibold px-4 py-1 rounded-full border-[2px] border-black shadow-sm">
                Log In
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
