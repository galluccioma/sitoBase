"use client"

import { useState, useEffect } from 'react';
import { Banner } from '@/payload-types';
import Link from "next/link";


export default function BannerAggiornamenti () {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [open, setOpen] = useState(true)

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
    <section>
      {banner.mostra  && open === true && (
        <div className="grid w-full place-items-center overflow-x-scroll rounded-lg p-4 lg:overflow-visible">
        <div role="alert" className="relative block w-full text-base font-regular px-4 py-4 rounded-lg bg-red-500 text-white ">
            <div className=" mr-12">
                <p className="font-bold text-black">
                    🌟 {banner.title}
                    <span className="text-white">
                    {banner.description}
                    </span>
                    <Link  href={(banner.link as string)} target="_blank" title="" className="inline-flex items-center justify-center text-sm font-bold text-yellow-300 transition-all ml-4 duration-200 rounded-md hover:text-gray-700" role="button">
                       {banner.cta} <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                    </Link>
                </p>
            </div>
            <button onClick={() => setOpen(false)} className=" align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 !absolute top-3 right-3" type="button">
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
            </button>
        </div>
    </div>
      )}
     
      {/* <Drawer/> */}
    </section>
  );
}