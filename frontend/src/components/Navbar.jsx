'use client';
import Image from 'next/image';
import { CircleUserRound } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="w-full bg-[#FFFBF2] text-black font-poppins px-6 py-4 flex justify-between items-center border border-black rounded-3xl shadow-sm">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-1 -mr-7">
        <Image
          src="/images/Logo Empati.png"
          alt="Empati Logo"
          width={120}
          height={32}
          style={{ height: "auto" }}
        />
      </div>

      {/* Center: Nav Links */}
      <div className="flex gap-8 text-md font-semibold">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">Features</a>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 border border-black rounded-md text-sm">John Doe</div>
        <CircleUserRound className="w-8 h-8" />
      </div>
    </div>
  );
}
