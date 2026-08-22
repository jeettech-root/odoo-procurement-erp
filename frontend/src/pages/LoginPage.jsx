import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (submitError) {
      setError(submitError.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">GlobeTrotter</p>
        <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to continue planning your next trip.</p>

        <form className="mt-8 space-y-5" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="Enter your password"
              required
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-sky-600 px-4 py-2.5 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {isSubmitting ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need an account?{' '}
          <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-700">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
