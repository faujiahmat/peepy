'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import LogoutModal from '../auth/LogoutModal';
import SearchBar from '../ui/SearchBar';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['500'],
});

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const useClickOutside = (
    ref: React.RefObject<HTMLElement | null>,
    handler: () => void,
    enabled: boolean
  ) => {
    useEffect(() => {
      const listener = (event: MouseEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        handler();
      };

      if (enabled) {
        document.addEventListener('mousedown', listener);
      }

      return () => {
        document.removeEventListener('mousedown', listener);
      };
    }, [ref, handler, enabled]);
  };

  useClickOutside(searchRef, () => setSearchOpen(false), searchOpen);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const getTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const interval = setInterval(() => {
      setCurrentTime(getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" flex justify-between items-center h-full relative">
      {!searchOpen && (
        // Menu mobile
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(true)}
            className={menuOpen ? 'hidden' : 'cursor-pointer'}
          >
            <Image src="/menu.svg" alt="Menu" width={26} height={26}></Image>
          </button>
          <button
            onClick={() => setMenuOpen(false)}
            className={menuOpen ? 'cursor-pointer' : 'hidden'}
          >
            <Image src="/close.svg" alt="Close" width={26} height={26}></Image>
          </button>

          {menuOpen && (
            <div className="h-50 w-fit bg-biru-400 absolute top-8 left-1 rounded-md px-4 py-2 text-putih-100 flex flex-col justify-between ">
              <div className="flex flex-col gap-1">
                <Link href={'/dashboard'} className="pl-2 pr-8 border-b py-1 ">
                  dashboard
                </Link>
                <Link href={'/profile'} className="pl-2 pr-8 border-b py-1 ">
                  profile
                </Link>
                <Link href={'/todo'} className="pl-2 pr-8  py-1 ">
                  todo
                </Link>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="pl-2 pr-8 py-1 text-merah text-left cursor-pointer"
              >
                Logout
              </button>

              {showLogoutModal && (
                <LogoutModal onClose={() => setShowLogoutModal(false)} />
              )}
            </div>
          )}
        </div>
      )}

      <div className={''}>
        {/* Logo mobile*/}
        <Image
          src="/peepy.svg"
          alt="Logo"
          width={70}
          height={26}
          className={'md:hidden'}
        ></Image>
        {/* Logo desktop */}
        <Image
          src="/peepy.svg"
          alt="Logo"
          width={130}
          height={35}
          className={`hidden md:block `}
        ></Image>
      </div>

      {/* Search mobile */}
      <div>
        {pathname === '/todo' && !searchOpen && (
          <button className="md:hidden" onClick={() => setSearchOpen(true)}>
            <Image src="/search-icon.svg" alt="Search" width={24} height={24} />
          </button>
        )}
      </div>

      {searchOpen && (
        <div
          ref={searchRef}
          className="absolute right-0 top-1/2  -translate-y-1/2  flex items-center gap-2 w-1/2 md:hidden justify-end"
        >
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </div>
      )}

      {/* Search desktop */}
      <div className="hidden md:block w-1/3">
        {pathname === '/todo' && (
          <SearchBar value={searchQuery} onChange={handleSearch} />
        )}
      </div>

      {/* Time desktop */}
      <div
        className={`${inter.className} font-medium text-5xl hidden md:block`}
      >
        {currentTime}
      </div>
    </div>
  );
}
