import React from 'react';
import Image from 'next/image';


 const Logo = () => (
   <Image 
   width={42} 
   height={42} 
   className="logo"
      src="/ico/favicon.ico"
      alt="Backend"
    />
);

export default Logo;

