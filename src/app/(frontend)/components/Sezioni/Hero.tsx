import Image from "next/image"

export default function Hero(){
    return (

<section className="">
  
  <div className="px-8 pb-12">
    
    <div className="relative">
      <Image
        className="w-full h-[60vh] 2xl:h-[75vh] object-cover relative"
        src="/images/hero.avif"
        alt="hero"
        width={1080}
        height={700}
      ></Image>
      <div className="absolute bg-white bottom-0 right-0 p-8 w-full md:max-w-xs flex flex-col">
        
        <p className="text-sm">Quartiere / Real Estate</p>
        <p>
          
          <a className="text-xs" href="tel:+1-202-555-0123">
            Tel: (202) 555-0123
          </a>
        </p>
      </div>
    </div>
    <div className="mt-12">
      
      <h1 className="text-balance text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl text-black">
        <span className="lg:block"> Discover your dream home.</span> Explore our real estate
        listings today
      </h1>
    </div>
    <div className="grid lg:grid-cols-3 pt-8 mt-40 border-t">
      <div className="text-3xl font-light text-black">Why choose us</div>
      <div className="lg:col-span-2 grid lg:grid-cols-2 lg:col-start-2 gap-8">
        
        <div className=" flex flex-col ">
          
          <p className="text-3xl font-light text-black      "> Easy Financing </p>
          <p className="mt-6 text-pretty text-gray-500 2xl:text-lg">
            
            We offer hassle-free financing options tailored to your needs. Our flexible payment
            plans make it easy to get the services you need without breaking the bank.
          </p>
        </div>
        <div className=" flex flex-col ">
          
          <p className="text-3xl font-light text-black      "> Free Consultations </p>
          <p className="mt-6 text-pretty text-gray-500 2xl:text-lg">
            
            Schedule a free consultation in thxe comfort of your own home. Our experts will assess
            your needs and provide personalized recommendations tailored to your space and
            lifestyle.
          </p>
        </div>
        <div className=" flex flex-col ">
          
          <p className="text-3xl font-light text-black      "> Award Winning Service </p>
          <p className="mt-6 text-pretty text-gray-500 2xl:text-lg">
            
            Our commitment to excellence has earned us numerous awards and accolades in the
            industry. Rest assured, you re in good hands with our team of dedicated professionals.
          </p>
        </div>
        <div className=" flex flex-col ">
          
          <p className="text-3xl font-light text-black"> Licensed &amp; Insured </p>
          <p className="mt-6 text-pretty text-gray-500 2xl:text-lg">
            
            We are fully licensed and insured, giving you peace of mind knowing that your project is
            in compliance with all regulations and standards. Your safety and satisfaction are our
            top priorities.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
    )
}