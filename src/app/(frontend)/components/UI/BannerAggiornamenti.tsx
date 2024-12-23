"use client"

import { useState, useEffect } from 'react';
import { Banner } from '@/payload-types';
import Link from "next/link";


export default function BannerAggiornamenti () {
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
    <section>
      {banner.mostra  &&  (
        <Link href={(banner.link as string)} target="_blank" className=" w-full flex backdrop-blur-2xl bg-red-500 ">
          <div className="flex items-center justify-center w-full bg-red-500 mx-auto px-6 lg:px-12 md:px-12 sm:px-6 py-2">
            <p className="text-white text-xs">{banner.description}
            </p> 
          </div>
        </Link>
      )}
     
      {/* <Drawer/> */}
    </section>
  );
}