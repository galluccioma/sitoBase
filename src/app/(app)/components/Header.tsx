"use client"
import { useState, useEffect } from 'react';
import { Banner } from '@/payload-types';
import Link from "next/link";
import Nav from './ui/Nav'

export default function Header () {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      const res = await fetch(`/api/globals/banner`);
      const data = await res.json();
      setBanner(data);
    };
    fetchBanner();
  }, []);

  if (!banner) return null;

  return (
    // Il resto del codice rimane lo stesso
    <header>
      {banner.mostra  &&  (
        <Link href={(banner.link as string)} target="_blank" className=" w-full flex backdrop-blur-2xl bg-red-500 ">
          <div className="flex items-center justify-center w-full bg-red-500 mx-auto px-6 lg:px-12 md:px-12 sm:px-6 py-2">
            <p className="text-white text-xs">{banner.description}
            </p> 
          </div>
        </Link>
      )}
      <section className="z-50 w-full relatve backdrop-blur-2xl bg-black">
        <div
          className="relative flex w-full py-5 mx-auto items-center justify-between max-w-7xl px-6 lg:px-12 xl:px-6 2xl:px-0"
        >
          <div
            className="flex items-center justify-between text-white lg:justify-start"
          >
            <Link href="/" className="flex items-center justify-center">
              <p className="font-semibold italic lg:text-4xl text-2xl uppercase">author.</p>
            </Link>
          </div>
          <nav
            id="navbar-default"
            className="flex items-center md:pb-0 md:flex gap-10"
          >
            <Nav/> 
            <button id="header-drawer-button" aria-label="toggle drawer"  className= "flex lg:hidden gap-2 items-center justify-center bg-transparent stroke-white transition-colors duration-300 ease-in-out">
              <p className="font-bold text-white">menu</p>
              <svg id="drawer-open" className="size-6">
                <use href="/ui.svg#menu"></use>
              </svg>
              <svg id="drawer-close" className="size-6">
                <use href="/ui.svg#x"></use>
              </svg>
            </button>
            <button id="header-theme-button" aria-label="toggle theme" className= "hidden md:flex size-9 rounded-full p-2 items-center justify-center bg-transparent hover:bg-white/20 stroke-white hover:stroke-white border border-white/25 transition-colors duration-300 ease-in-out">
              <svg className="size-full block dark:hidden">
                <use href="/ui.svg#sun"></use>
              </svg>
              <svg className="size-full hidden dark:block">
                <use href="/ui.svg#moon"></use>
              </svg>
            </button>
          </nav>
        </div>
      </section>
      {/* <Drawer/> */}
    </header>
  );
}