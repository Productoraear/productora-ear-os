export default function PublicLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 dark:bg-black">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-zinc-900"></div>
          <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin dark:border-white dark:border-t-transparent"></div>
        </div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest animate-pulse dark:text-zinc-500">
          Sincronizando Sistema...
        </p>
      </div>
    </div>
  );
}
