'use client';

import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';

export default function ProfileClient() {
  const [profile, setProfile] = useState<{ name: string; email: string }>({
    name: '',
    email: '',
  });
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No token found. Please login first.');
      return;
    }

    console.log(token);

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Gagal mengambil data profil');

        const data = await res.json();
        setProfile({
          name: data.data.name || '',
          email: data.data.email || '',
        });

        setForm({
          name: data.data.name || '',
          email: data.data.email || '',
          password: '',
        });
      } catch (error) {
        console.error(error);
        setMessage('Gagal memuat profil');
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Token tidak ditemukan');
      return;
    }

    try {
      setLoadingSave(true);

      const updatedFields: Record<string, string> = {};
      if (form.name) updatedFields.name = form.name;
      if (form.email) updatedFields.email = form.email;
      if (form.password) updatedFields.password = form.password;

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage('Profil berhasil diperbarui');
      setProfile({ name: form.name, email: form.email });
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat menyimpan');
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Token tidak ditemukan');
      return;
    }

    try {
      setLoadingDelete(true);
      const res = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        setMessage(data.message || 'Gagal menghapus akun');
        return;
      }

      setMessage('Akun berhasil dihapus. Mengalihkan...');
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat menghapus akun');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full gap-4">
      <div className="text-center px-5 max-w-md w-11/12">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-biru-400 rounded-lg px-4 py-4 text-putih-100 flex flex-col gap-2">
          <div>{profile.name}</div>
          <div className="flex justify-center">
            <div className="h-0.5 w-4/5 bg-putih-100"></div>
          </div>
          <div>{profile.email}</div>
        </div>
      </div>
      <div className="text-center px-5 max-w-md w-11/12">
        <h1 className="text-2xl font-bold mb-4">Edit</h1>
        <div className="bg-biru-400 rounded-lg px-4 pb-2 pt-4 text-biru-400 flex flex-col gap-2 ">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-putih-100 px-4 py-2 rounded-md text-center border-none shadow-sm focus:outline-none focus:ring-1 focus:ring-putih-100 focus:border-none text-sm md:text-base"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-putih-100 px-4 py-2 rounded-md text-center border-none shadow-sm focus:outline-none focus:ring-1 focus:ring-putih-100 focus:border-none text-sm md:text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="bg-putih-100 px-4 py-2 rounded-md text-center border-none shadow-sm focus:outline-none focus:ring-1 focus:ring-putih-100 focus:border-none text-sm md:text-base"
          />
          <button
            onClick={handleSave}
            disabled={loadingSave}
            className="btn-primary text-putih-100 cursor-pointer h-fit"
          >
            {loadingSave ? 'Loading...' : 'Save'}
          </button>
        </div>
        {(message && (
          <div className="text-biru-400 text-xs">{message}</div>
        )) || <div className="text-biru-400 text-xs invisible">halo</div>}
      </div>
      <button
        onClick={() => setOpenModal(true)}
        className="btn-danger text-merah -mt-3 cursor-pointer"
      >
        Delete account
      </button>

      {openModal && (
        <Modal isOpen={true} onClose={() => setOpenModal(false)}>
          <h2 className="text-xl font-bold mb-4 text-merah">Confirm Delete</h2>
          <p>Are you sure you want to delete this Account?</p>
          <div className="flex justify-between space-x-4 mt-4">
            <button
              onClick={handleDelete}
              className="btn-danger w-fit px-4 py-2 cursor-pointer hover:bg-merah rounded-full hover:text-putih-100 transition-all duration-300 ease-out"
            >
              {loadingDelete ? 'Loading...' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setOpenModal(false)}
              className="btn-secondary w-fit px-4 py-2 cursor-pointer "
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
