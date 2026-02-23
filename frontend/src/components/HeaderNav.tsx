'use client';

import Link from 'next/link';

const navLink =
  'px-3 py-2 rounded-lg text-yellow-400 text-sm font-medium transition-all duration-200 block w-full text-left sm:w-auto sm:inline-block hover:bg-yellow-400 hover:text-black hover:shadow-md';

export function HeaderNav() {
  return (
    <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
      <Link href="/perros" className={navLink}>
        Perros
      </Link>
      <Link href="/personas" className={navLink}>
        Personas
      </Link>
    </nav>
  );
}
