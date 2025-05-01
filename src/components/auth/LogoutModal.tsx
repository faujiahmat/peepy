'use client';

import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';

export default function LogoutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');

      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-merah">Confirm Logout</h2>
      <p className="text-hitam-100">Are you sure you want to logout?</p>
      <div className="flex justify-between space-x-4 mt-4 text-hitam-100">
        <button
          onClick={handleLogout}
          className="btn-danger w-fit px-4 py-2 cursor-pointer hover:bg-merah rounded-full hover:text-putih-100 transition-all duration-300 ease-out"
        >
          Yes, I am out
        </button>
        <button
          onClick={onClose}
          className="btn-secondary w-fit px-4 py-2 cursor-pointer "
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
