import React from 'react';
import Image from 'next/image';


 const Logo = () => (
   <Image 
   width={42} 
   height={42} 
   className="logo"
      src="/favicon.svg"
      alt="Backend"
    />
);

export default Logo;

