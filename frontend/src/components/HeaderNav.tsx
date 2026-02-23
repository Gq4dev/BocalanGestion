'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const navLink =
  'px-3 py-2 rounded-lg text-yellow-400 text-sm font-medium transition-all duration-200 block w-full text-left sm:w-auto sm:inline-block hover:bg-yellow-400 hover:text-black hover:shadow-md';

export function HeaderNav() {
  const [perrosOpen, setPerrosOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setPerrosOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
      <div
        className="relative"
        ref={menuRef}
        onMouseEnter={() => setPerrosOpen(true)}
        onMouseLeave={() => setPerrosOpen(false)}
      >
        <button
          type="button"
          onClick={() => setPerrosOpen((o) => !o)}
          className={`${navLink} flex items-center gap-1 sm:inline-flex ${perrosOpen ? 'bg-yellow-400 text-black shadow-md' : ''}`}
          aria-expanded={perrosOpen}
          aria-haspopup="true"
        >
          Perros
          <span className={`inline-block text-[10px] transition-transform ${perrosOpen ? 'rotate-180' : ''}`} aria-hidden>▼</span>
        </button>
        <div
          className={`absolute top-full left-0 mt-1 min-w-[200px] rounded-lg bg-black border border-yellow-400/50 shadow-xl py-1 z-50 sm:min-w-[220px] ${
            perrosOpen ? 'block' : 'hidden'
          }`}
        >
          <Link
            href="/cachorros"
            className="px-3 py-2.5 text-yellow-400 text-sm block rounded-md mx-1 transition-all duration-200 hover:bg-yellow-400 hover:text-black"
            onClick={() => setPerrosOpen(false)}
          >
            Cachorros
          </Link>
          <Link
            href="/adolescentes"
            className="px-3 py-2.5 text-yellow-400 text-sm block rounded-md mx-1 transition-all duration-200 hover:bg-yellow-400 hover:text-black"
            onClick={() => setPerrosOpen(false)}
          >
            En entrenamiento
          </Link>
          <Link
            href="/graduados"
            className="px-3 py-2.5 text-yellow-400 text-sm block rounded-md mx-1 transition-all duration-200 hover:bg-yellow-400 hover:text-black"
            onClick={() => setPerrosOpen(false)}
          >
            Entregados
          </Link>
        </div>
      </div>
      <Link href="/entrenadores" className={navLink}>
        Entrenadores
      </Link>
      <Link href="/familias" className={navLink}>
        Familias
      </Link>
    </nav>
  );
}
