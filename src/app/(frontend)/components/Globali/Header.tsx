"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { LINKS } from '../../utils/const';

import {
  AiFillTag,
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineSearch,
} from 'react-icons/ai';
import { BsFillCartFill, BsFillSaveFill } from 'react-icons/bs';
import { IoIosLink } from "react-icons/io";

import BannerAggiornamenti from '../UI/BannerAggiornamenti';

const Header = () => {
  const [nav, setNav] = useState(false);

  return (
    <>
    <BannerAggiornamenti/>
    <nav className="w-full mx-auto flex justify-between items-center px-12 py-4">
      {/* Left Side */}
      <div className="flex items-center">
        
        <div className="cursor-pointer" onClick={() => setNav(!nav)}>
          <AiOutlineMenu size={30} className="hover:text-gray-400" />
        </div>
        <Link href='/' className="text-2xl sm:text-3xl lg:text-4xl px-2 ">
          Sito <span className="font-bold">Standard</span>
        </Link>
      </div>
      {/* Seach Input */}
      <div className="bg-gray-200 rounded-full flex items-center px-2 w-[200px] sm:w-[400px] lg:w-[500px]">
        <AiOutlineSearch size={25} />
        <input
          className="bg-transparent p-2 focus:outline-none"
          type="text"
          placeholder="Search Food"
        />
      </div>
      {/* Cart Button */}
      <button className="bg-black text-white hidden md:flex items-center py-2 px-8 rounded-full hover:opacity-[.8] transition-all">
        <BsFillCartFill size={20} className="mr-2" /> Cart
      </button>



      {/* Mobile Menu */}
      {/* Overlay */}
      {nav ? (
        <div
          className="bg-black/80 fixed w-full h-screen z-10 top-0 left-0"
          onClick={() => setNav(!nav)}
        ></div>
      ) : (
        ''
      )}

      {/* Side Drawer Menu */}
      <div
        className={
          nav
            ? 'fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300'
            : 'fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300'
        }
      >
        <AiOutlineClose
          onClick={() => setNav(!nav)}
          size={30}
          className="absolute top-4 right-4 cursor-pointer hover:text-gray-400"
        />
        <h2 className="text-2xl p-4 ">
          Best <span className="font-bold">Eats</span>
        </h2>
        <nav>
          <ul className="flex flex-col p-4 text-gray-800">

            {LINKS.map((prop) =>  
            <li key={prop.TEXT} className="hover:bg-gray-200 duration-200">
              <a href={prop.HREF} className="text-xl py-4 pl-2 flex">
                <IoIosLink size={25} className="mr-4" /> {prop.TEXT}
              </a>
            </li>
            )}
            
          </ul>
        </nav>
      </div>
    </nav>
    </>
  );
};

export default Header;