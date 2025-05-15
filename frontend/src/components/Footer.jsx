'use client';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white px-6 py-4 flex justify-center items-center gap-52 rounded-t-xl font-poppins text-center">
      {/* Teks */}
      <div className="text-sm">
        © 2025 <span className="font-semibold">Empati</span>. All rights reserved.
      </div>

      {/* Logo */}
      <Image
        src="/images/Logo Empati Putih.svg"
        alt="Empati Logo"
        width={100}
        height={24}
      />
    </footer>
  );
}
