'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TodoType } from '@/type/todo';
import Image from 'next/image';
import { Modal } from '../ui/Modal';
import { CustomSelect } from '../ui/Select';
import Loader from '../ui/Loader';

export default function TodoDetailClient() {
  const { id } = useParams();
  const router = useRouter();
  const [todo, setTodo] = useState<TodoType | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalError, setModalError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING',
  });

  const fetchTodo = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('No token found. Please login first.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || 'Failed to fetch todo.');
        return;
      }

      setTodo(data.data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setModalError('No token found. Please login first.');
      return;
    }

    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.message || 'Failed to update To-Do.');
        return;
      }

      setOpenEditModal(false);
      fetchTodo();
    } catch (error) {
      setModalError('Something went wrong: ' + (error as Error).message);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setModalError('No token found. Please login first.');
      return;
    }

    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.message || 'Failed to delete To-Do.');
        return;
      }

      router.push('/todo');
    } catch (error) {
      setModalError('Something went wrong: ' + (error as Error).message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  if (errorMessage)
    return <p className="text-center text-red-500">{errorMessage}</p>;
  if (!todo)
    return <p className="text-center text-gray-500">To-Do not found.</p>;

  return (
    <div className="bg-linear-to-b from-biru-100 to-biru-200 h-full rounded-xl">
      <div className="flex flex-col  items-center h-full">
        <Image
          src="/imageList.png"
          alt="Image list"
          width={300}
          height={250}
        ></Image>
        <div className="bg-putih-100 w-4/5 px-4 py-2 rounded-xl mb-5 text-hitam-200 text-center">
          <h1>{todo.title}</h1>
        </div>
        <div className="bg-putih-100 w-4/5 px-4 py-2 rounded-xl h-full mb-5 text-hitam-200">
          <p>{todo.description || ''}</p>
        </div>

        <div className="flex justify-between w-4/5 px-4 py-2 mb-2">
          <button
            onClick={() => {
              setFormData({
                title: todo.title,
                description: todo.description || '',
                status: todo.status,
              });
              setOpenEditModal(true);
            }}
            className="btn-primary bg-kuning px-3 py-1 rounded-full text-putih-100 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => setOpenDeleteModal(true)}
            className="btn-danger bg-merah px-3 py-1 rounded-full text-putih-100 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal isOpen={openEditModal} onClose={() => setOpenEditModal(false)}>
        <h2 className="text-xl font-semibold mb-4 text-hitam-100">Edit List</h2>

        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="input-primary w-full px-4 py-2 rounded-lg border-gray-400 border shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-black/60 text-gray-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="input-primary w-full px-4 py-2 rounded-lg border-gray-400 border shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-black/60 text-gray-500"
          />
          <div className="flex justify-between items-center">
            {(modalError && (
              <div className="text-merah px-2 -mt-2 ">{modalError}</div>
            )) || <div className="-mt-2 invisible">halo</div>}
            <CustomSelect
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              options={[
                { label: 'pending', value: 'PENDING' },
                { label: 'completed', value: 'COMPLETED' },
              ]}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn-primary w-fit px-3 py-1 border-2 border-slate-500 rounded-full text-hitam-100 hover:bg-biru-400 hover:text-putih-100 cursor-pointer"
            >
              Edit
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Delete */}
      <Modal isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <h2 className="text-xl font-bold mb-4 text-merah">Confirm Delete</h2>
        <p>Are you sure you want to delete this List?</p>
        <div className="flex justify-between space-x-4 mt-4">
          <button
            onClick={handleDelete}
            className="btn-danger w-fit px-4 py-2 cursor-pointer hover:bg-merah rounded-full hover:text-putih-100 transition-all duration-300 ease-out"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setOpenDeleteModal(false)}
            className="btn-secondary w-fit px-4 py-2 cursor-pointer "
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
