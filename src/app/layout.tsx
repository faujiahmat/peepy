import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

export const sans = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Peepy',
  description:
    'Peepy adalah aplikasi To-Do List sederhana yang dibangun menggunakan Next.js, PostgreSQL, dan JWT Authentication. Aplikasi ini memungkinkan pengguna untuk mencatat, mengelola, dan menyelesaikan tugas harian mereka dengan mudah dan aman.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-linear-to-b from-biru-100 to-biru-200 antialiased px-4 sm:px-8 md:px-10 lg:px-14 h-screen ${sans.className} overflow-hidden flex flex-col pb-3`}
      >
        {children}
      </body>
    </html>
  );
}
