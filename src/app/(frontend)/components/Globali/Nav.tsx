import React from 'react';
import { LINKS } from '../../utils/const';

// Utility function to conditionally apply classNames (similar to Astro's cn)
const cn = (...classNames: string[]) => classNames.join(' ');

interface Link {
  HREF: string;
  TEXT: string;
}

export default function Nav (){

  return (
    <nav className="flex flex-col lg:flex-row gap-8 text-white text-sm">
      {LINKS.map((LINK: Link) => (
        <a
          key={LINK.HREF} // Add key prop for better performance
          href={LINK.HREF}
          className={cn(
            'h-8 px-3 text-current flex items-center justify-center hover:text-accent-500 transition-colors duration-300 ease-in-out',
          )}
        >
          {LINK.TEXT}
        </a>
      ))}
      <a
        href="/contatti"
        className="px-4 py-2 text-sm transition-all flex items-center justify-center rounded-full text-white bg-orange-500 hover:bg-orange-600 h-8 ring-1 ring-inset ring-white/10"
      >
        Contattaci
      </a>
    </nav>
  );
};
