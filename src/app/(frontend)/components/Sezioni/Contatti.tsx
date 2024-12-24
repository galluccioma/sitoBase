import Image from "next/image"
import Form from "../UI/Form"
export default function Contatti (){
  return (


<section className="">
  <div className="px-8 pb-12 lg:pt-32">
  <div className="grid grid-cols-1 md:grid-cols-3 pt-8 mt-40 border-t gap-8 items-center">
      <div className=" flex flex-col col-span-1">
        <Image
          className="h-full object-cover object-center "
          src="/images/hero.avif"
          alt=""
          width={1000}
          height={400}
        ></Image>
        <div className="w-full p-8 bg-orange-600">
          <p className="text-3xl 2xl:text-6xl font-light text-white lg:text-pretty">
            Grazie per averci contattato
          </p>
          <p className="mt-6 text-pretty text-gray-200 2xl:text-lg lg:text-pretty">
          Utilizzando il modulo sottostante, si prega di fornire informazioni il più possibile dettagliate. Le
            informazioni inviate possono essere condivise con il nostro affiliato indipendente
            franchisee, in modo che i vostri dubbi possano essere affrontati.
            <br />
            <br />
            <small>
              *Please note that by providing your phone number and email address, you are providing
              consent for us to reach out to you via this method.
            </small>
          </p>
        </div>
      </div>
      <div className=" w-full col-span-2">
      <h2 className='text-orange-600 font-bold text-4xl text-center'>Contattaci ora per scoprire tutte le novità!</h2>
        <Form/>
      </div>
    </div>
  </div>
</section>
  )
}