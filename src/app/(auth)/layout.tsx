'use client';

import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-full flex justify-center items-center">
        <div className="bg-putih-100 p-6 rounded-xl shadow-lg   max-w-md w-full">
          <div className="flex justify-center items-center pb-4 md:pb-10">
            {' '}
            <Image
              src="/peepy.svg"
              alt="Logo"
              width={90}
              height={26}
              className={'md:hidden'}
            ></Image>
            <Image
              src="/peepy.svg"
              alt="Logo"
              width={130}
              height={35}
              className={`hidden md:block `}
            ></Image>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
