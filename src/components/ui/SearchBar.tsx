import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({
  placeholder = 'Search',
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="flex items-center bg-white rounded-xl px-4 py-2 shadow-md  w-full transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-200 ">
      <svg
        className="w-5 h-5 text-gray-400 mr-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 outline-none bg-transparent text-gray-700 text-base w-10"
      />
    </div>
  );
}
