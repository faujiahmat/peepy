'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TodoType } from '@/type/todo';
import Image from 'next/image';
import { Modal } from '../ui/Modal';
import { CustomSelect } from '../ui/Select';
import NotFoundList from '../common/NotFoundList';
import Loader from '../ui/Loader';

export default function TodoClient() {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [modalError, setModalError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING',
  });

  const fetchGetTodos = async (currentPage: number, searchQuery = '') => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setPageError('No token found. Please login first.');
      setLoading(false);
      return;
    }
    setPageError('');

    try {
      const res = await fetch(
        `/api/todo?page=${currentPage}&search=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setPageError(data.message || 'Failed to fetch todos.');
        setTodos([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const data = await res.json();

      setTodos(data.data.todos || []);
      setTotalPages(data.data.pagination.totalPages || 1);
    } catch (err) {
      setPageError('something went wrong : ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetTodos(page, search);
  }, [page, search]);

  const handleDetail = (id: string) => {
    router.push(`/todo/${id}`);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setModalError('No token found. Please login first.');
      return;
    }
    try {
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.message || 'Failed to create todo.');
        return;
      }

      setOpenModal(false);
      setFormData({ title: '', description: '', status: 'PENDING' });
      fetchGetTodos(page);
    } catch (error) {
      setModalError('something went wrong : ' + (error as Error).message);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader />
        </div>
      ) : pageError ? (
        <p className="text-red-500">{pageError}</p>
      ) : !loading && todos.length === 0 ? (
        <NotFoundList />
      ) : (
        <div className="flex flex-col gap-3 h-full">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="px-4 py-2 rounded-lg cursor-pointer bg-linear-to-r to-[var(--color-biru-100)] from-[var(--color-biru-200)] flex justify-between items-center basis-[18%] "
              onClick={() => handleDetail(todo.id)}
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {todo.title.length > 10
                    ? `${todo.title.slice(0, 10)}...`
                    : todo.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {todo.description && todo.description.length > 20
                    ? `${todo.description.slice(0, 20)}...`
                    : todo.description}
                </p>
              </div>

              <div
                className={
                  todo.status === 'PENDING' ? 'text-kuning' : 'text-biru-300'
                }
              >
                {todo.status.toLocaleLowerCase()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn-primary disabled:invisible bg-[var(--color-biru-400)] px-2 py-1 rounded-full text-[var(--color-putih-100)] cursor-pointer"
        >
          prev
        </button>
        <div className="flex items-center pt-1 ">
          <button
            onClick={() => setOpenModal(true)}
            className="btn-primary cursor-pointer"
          >
            <Image src="/add.svg" alt="add" width={26} height={26} />
          </button>
        </div>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="btn-primary  disabled:invisible bg-biru-400 px-2 py-1 rounded-full text-putih-100 cursor-pointer"
        >
          next
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-xl font-semibold mb-4 text-hitam-100">
          Create New List
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
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
              Create
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
