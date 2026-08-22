import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function getDisplayName(user) {
  const name = typeof user?.name === 'string' ? user.name.trim() : '';
  const email = typeof user?.email === 'string' ? user.email.trim() : '';

  return name || email || 'Traveler';
}

function getInitials(displayName) {
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials || 'T';
}

function getSecondaryLabel(user, displayName) {
  const email = typeof user?.email === 'string' ? user.email.trim() : '';
  const role = typeof user?.role === 'string' ? user.role.trim() : '';

  if (email && email !== displayName) return email;
  if (role) return role;
  return 'Traveler';
}

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const displayName = getDisplayName(user);
  const secondaryLabel = getSecondaryLabel(user, displayName);
  const initials = getInitials(displayName);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div ref={menuRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex max-w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-1"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-semibold text-white">
          {initials}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-[10rem] truncate text-sm font-semibold text-slate-900">{displayName}</span>
          <span className="block max-w-[10rem] truncate text-[11px] uppercase tracking-[0.18em] text-slate-500">{secondaryLabel}</span>
        </span>
        <span className="text-xs text-slate-400" aria-hidden="true">⌄</span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 z-30 mt-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="border-b border-slate-100 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600">Account</p>
            <p className="mt-2 truncate text-base font-bold text-slate-900">{displayName}</p>
            <p className="mt-1 break-words text-sm text-slate-500">{secondaryLabel}</p>
          </div>
          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Logout
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
