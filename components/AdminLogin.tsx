'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Proste logowanie (w produkcji powinno być przez API)
    // Domyślne dane: admin / admin123
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      router.push('/admin');
    } else {
      setError('Nieprawidłowa nazwa użytkownika lub hasło');
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-black min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-black border-2 border-white/20 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Panel Administratora</h1>
            <p className="text-white/70 text-center mb-8">Zaloguj się do panelu zarządzania</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Nazwa użytkownika</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black border-2 border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Hasło</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border-2 border-white/20 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-white"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border-2 border-red-500 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-white text-black px-6 py-3 font-semibold rounded-lg hover:opacity-80 transition-opacity duration-300"
              >
                Zaloguj się
              </button>
            </form>

            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-white/70 text-sm text-center">
                Domyślne dane: <span className="font-semibold text-white">admin / admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




