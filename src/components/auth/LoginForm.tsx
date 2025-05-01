'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.data.token);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <h2 className="text-xl md:text-2xl font-semibold md:font-bold  text-hitam-100 ">
        Login
      </h2>

      {(error && (
        <div className="text-red-500 text-xs md:text-sm mb-1">{error}</div>
      )) || <div className="mb-1 invisible text-xs md:text-sm">halo</div>}

      <input
        name="email"
        placeholder="Email"
        className="input mb-3 px-4 py-2 rounded-md border w-full border-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        placeholder="Password"
        className="input mb-4 px-4 py-2 rounded-md border w-full border-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
        value={formData.password}
        onChange={handleChange}
        type="password"
      />
      <div className="flex justify-center">
        <div className="h-0.5 mb-4 w-8/12 bg-slate-300"></div>
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-2  md:py-4 bg-biru-400 hover:bg-[#5b7c9a] rounded-md text-putih-100 cursor-pointer"
      >
        Login
      </button>

      <div className="text-center mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-biru-400">
          Register
        </Link>
      </div>
    </form>
  );
}
