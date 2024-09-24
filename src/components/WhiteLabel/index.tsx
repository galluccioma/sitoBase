import React from 'react';
import Image from 'next/image';

export const Logo = () => (
   <Image 
   width={42} 
   height={42} 
   className="logo"
      src="/favicon.svg"
      alt="Backend"
    />
);

export const Icon = () => (
       <Image 
       className="icon"
       width={42} 
       height={42} 
      src="/favicon.svg"
      alt="Backend"
    />
  );