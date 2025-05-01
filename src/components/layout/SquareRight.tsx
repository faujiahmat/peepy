export function SquareRight({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-4 lg:px-8 lg:py-5 bg-putih-100 flex flex-col gap-4 rounded-xl basis-4/5 justify-between md:row-span-3 md:col-span-2 lg:col-span-3 shadow-md">
      {children}
    </div>
  );
}
