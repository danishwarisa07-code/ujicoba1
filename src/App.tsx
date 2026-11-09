/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// 5 Main Components
import AutentikasiCoKelompok5 from './components/autentikasi_co_kelompok_5.tsx';
import DashboardCoKelompok5 from './components/dashboard_co_kelompok_5.tsx';
import MateriPembelajaranCoKelompok5 from './components/materi_pembelajaran_co_kelompok_5.tsx';
import LatihanComprehensionOrale from './components/latihan_compr_hension_orale.tsx';
import PostTestComprehensionOrale from './components/post_test_compr_hension_orale.tsx';

/**
 * PrivateRoute Guard:
 * Restricts access to authenticated users only.
 * Redirects unauthenticated visitors back to the login page (/).
 */
function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 text-gray-700">
        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-sky-800">Memverifikasi sesi pengguna...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Index Route: Autentikasi Screen */}
          <Route path="/" element={<AutentikasiCoKelompok5 />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardCoKelompok5 />
              </PrivateRoute>
            }
          />

          <Route
            path="/materi"
            element={
              <PrivateRoute>
                <MateriPembelajaranCoKelompok5 />
              </PrivateRoute>
            }
          />

          <Route
            path="/latihan"
            element={
              <PrivateRoute>
                <LatihanComprehensionOrale />
              </PrivateRoute>
            }
          />

          <Route
            path="/post-test"
            element={
              <PrivateRoute>
                <PostTestComprehensionOrale />
              </PrivateRoute>
            }
          />

          {/* Fallback to index */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
