'use client';

import { TopBar } from '@/components/layout/TopBar';
import { SquareRight } from '@/components/layout/SquareRight';
import { SquareBottomLeft } from '@/components/layout/SquareBottomLeft';
import { SquareTopLeft } from '@/components/layout/SquareTopLeft';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="basis-1/12 md:basis-1/6">
        <TopBar />
      </header>
      <main className="basis-11/12 md:basis-5/6 flex flex-col gap-3 md:gap-10 lg:gap-14 md:grid md:grid-flow-col md:grid-rows-3 md:px-6 md:pb-14 lg:px-10">
        <SquareTopLeft />
        <SquareBottomLeft />
        <SquareRight>{children}</SquareRight>
      </main>
    </>
  );
}
