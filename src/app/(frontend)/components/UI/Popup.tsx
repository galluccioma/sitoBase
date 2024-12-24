'use client'
import { useState, useEffect } from 'react'
import { Banner } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'

export default function Popup() {
  const [open, setOpen] = useState(true)
  const [banner, setBanner] = useState<Banner | null>(null)

  function Popup() {
    sessionStorage.setItem('open', 'true')
    setOpen(false)
  }

  const isOpened = sessionStorage.getItem('open')

  useEffect(() => {
    const fetchBanner = async () => {
      const res = await fetch(`/api/globals/banner`)
      const data = await res.json()
      setBanner(data)
    }
    fetchBanner()
  }, [])

  if (!banner) return null

  return (
    <div
      className={`relative z-10 ${!isOpened ? 'block' : 'hidden'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {banner.mostra && (
        <>
          <div className="fixed inset-0 bg-black/75 transition-opacity" aria-hidden="true"></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="grid min-h-2xl h-full w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
              <div className="flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                <div className="relative w-2/5 m-0 overflow-hidden text-gray-700 bg-white shrink-0">
                  <Image
                    width={300}
                    height={400}
                    src={
                      typeof banner.image === 'string' 
                        ? banner.image // Use the string directly if it's a string
                        : banner.image?.url || '/fallback-image.jpg' // Extract `url` if it's a Media object
                    }                  alt={banner.title || 'Food item'}                    
                    
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-75">
                    <button
                      onClick={() => Popup()}
                      className=" align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 !absolute top-3 right-3"
                      type="button"
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </div>
                    </button>
                    <h2 className="text-4xl font-bold text-center">
                      {' '}
                      {banner.title} <br />
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <h6 className="block mb-4 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-red-500 uppercase">
                    {banner.title}
                  </h6>
                  <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                    {banner.title}
                  </h4>
                  <p className="block mb-8 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                    {banner.description}
                  </p>
                  <a className="inline-block" href="#">
                    <button
                      onClick={() => Popup()}
                      className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-red-500 uppercase align-middle transition-all rounded-lg select-none hover:bg-pink-500/10 active:bg-pink-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                      type="button"
                    >
                      {banner.cta}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        ></path>
                      </svg>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
