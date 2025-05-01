'use client';

import Link from 'next/link';
import { useState } from 'react';
import LogoutModal from '../auth/LogoutModal';

export function SquareTopLeft() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="hidden md:flex bg-putih-100 rounded-xl md:row-span-2 flex-col p-4 shadow-md ">
      <div className=" basis-4/5 space-y-2 flex flex-col">
        <Link
          href="/dashboard"
          className="rounded-lg cursor-pointer bg-linear-to-r to-biru-100 from-biru-200 px-4 py-2"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="rounded-lg cursor-pointer bg-linear-to-r to-biru-100 from-biru-200 px-4 py-2"
        >
          Profile
        </Link>
        <Link
          href="/todo"
          className="rounded-lg cursor-pointer bg-linear-to-r to-biru-100 from-biru-200 px-4 py-2"
        >
          Todo
        </Link>
      </div>
      <button
        onClick={() => setShowLogoutModal(true)}
        className="text-merah basis-1/5 px-4  flex items-center cursor-pointer"
      >
        logout
      </button>
      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
    </div>
  );
}
