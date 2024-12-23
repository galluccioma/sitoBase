import Image from "next/image"
import Form from "./ui/Form"
export default function Contatti (){
  return (


<section className="">
  <div className="px-8 pb-12 lg:pt-32">
    <h1 className="text-balance text-3xl md:text-5xl lg:text-4xl text-black ">Contact us</h1>
    <div className="flex pt-8 mt-40 border-t gap-8 items-center">
      <div className=" flex flex-col">
        <Image
          className="h-full object-cover object-center "
          src="/images/hero.avif"
          alt=""
          width={1000}
          height={400}
        ></Image>
        <div className="w-full p-8 bg-black">
          <p className="text-3xl 2xl:text-6xl font-light text-white lg:text-pretty">
            Thank you for contacting Quartiere international realty
          </p>
          <p className="mt-6 text-pretty text-gray-200 2xl:text-lg lg:text-pretty">
            Using the form below, please provide as much detailed information as possible. The
            information you submit may be shared with our independently owned and operated
            franchisee so that your concerns can be addressed.
            <br />
            <br />
            <small>
              *Please note that by providing your phone number and email address, you are providing
              consent for us to reach out to you via this method.
            </small>
          </p>
        </div>
      </div>
      <div className=" w-full">
        <Form/>
      </div>
    </div>
  </div>
</section>
  )
}