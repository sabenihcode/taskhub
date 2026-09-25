'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-slate-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🚀 TaskHub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Task Management System
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold text-lg"
            >
              Register
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Manage your tasks efficiently</p>
          </div>
        </div>
      </div>
    </div>
  );
}
