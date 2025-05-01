import Image from 'next/image';
import React from 'react';

const DashboardPage = async () => {
  return (
    <div className="px-4 py-10 max-w-xl mx-auto flex flex-col items-center text-center text-hitam-100">
      <Image src="/imageList.png" alt="image" width={300} height={100}></Image>
      <h1 className="text-3xl font-bold mb-4 ">
        Selamat datang di To-Do List kamu!
      </h1>
      <p className="text-lg ">
        Atur harimu, capai lebih banyak. Tambahkan tugas, tandai yang sudah
        selesai, dan tetap produktif setiap hari.
      </p>
    </div>
  );
};

export default DashboardPage;
