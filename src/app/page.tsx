'use client';

import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('@/components/HomeContent'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>
  ),
});

export default function HomePage() {
  return <HomeContent />;
}
