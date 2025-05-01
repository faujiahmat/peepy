'use client';

import { useEffect, useState } from 'react';

export function SquareBottomLeft() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setName('Guest');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setName(data?.data?.name || 'Guest');
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setName('Guest');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="bg-biru-400 basis-1/5 rounded-xl text-putih-100 flex items-center justify-center px-7 shadow-lg">
      <div>
        <p className="font-semibold text-2xl">
          Hi,{' '}
          {loading
            ? '...'
            : name
            ? name.split(' ')[0].charAt(0).toUpperCase() +
              name.split(' ')[0].slice(1)
            : 'Guest'}
        </p>
        <p className="font-light text-sm">nice to meet you :)</p>
      </div>
    </div>
  );
}
