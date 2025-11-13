'use client';

import Link from 'next/link';
import { HOME, MUSEO, ABOUT, SHOP } from '../lib/routes';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav
      className="navbar sticky top-0 z-50 bg-background backdrop-blur-md border-b border-base-300/50 shadow-lg"
      style={{ minHeight: 'var(--navbar-height)' }}
    >
      <div className="navbar-start">
        <Link 
          href={HOME} 
          className="btn btn-accent text-xl font-bold tracking-wide text-accent hover:text-accent transition-all duration-300 hover:scale-105"
        >
          <Image
            src="/ideas/isotipo.png"
            alt="Museo Nacional del Drama"
            width={4}
            height={4}
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(0,191,255,0.5)]"
            priority
          />
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link 
              href={MUSEO} 
              className="btn btn-ghost btn-sm normal-case hover:text-primary transition-colors"
            >
              Museo
            </Link>
          </li>
          {/* <li>
            <Link 
              href={SHOP} 
              className="btn btn-ghost btn-sm normal-case hover:text-secondary transition-colors"
            >
              Tienda
            </Link>
          </li> */}
          <li>
            <Link 
              href={ABOUT} 
              className="btn btn-ghost btn-sm normal-case hover:text-primary transition-colors"
            >
              Sobre
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        {/* Redes Sociales */}
        <div className="flex gap-2">
          <a
            href="https://www.instagram.com/dramaveintiseis/"
            className="btn btn-circle btn-ghost btn-sm hover:bg-primary/20 hover:text-accent transition-all"
            aria-label="Instagram"
            target="_blank"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href="https://open.spotify.com/intl-es/artist/1N6c3ECvv9DOLrAI2EKJSH?si=6IvTYCiRQRumRnP9VE2kyA"
            className="btn btn-circle btn-ghost btn-sm hover:bg-secondary/20 hover:text-accent transition-all"
            aria-label="Spotify"
            target="_blank"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@_DRAMAVISION"
            className="btn btn-circle btn-ghost btn-sm hover:bg-accent/20 hover:text-accent transition-all"
            aria-label="YouTube"
            target="_blank"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
        
        {/* Menú hamburguesa solo para móvil */}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-200 rounded-box w-52 border border-base-300"
          >
            <li>
              <Link href={MUSEO} className="hover:text-black">Museo</Link>
            </li>
            {/* <li>
              <Link href={SHOP} className="hover:text-secondary">Tienda</Link>
            </li> */}
            <li>
              <Link href={ABOUT} className="hover:text-black">Sobre</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}


