import Image from 'next/image'

import { fetchBlogPost } from '@/app/_data';

export default async function BlogPostPage({ params }) {
  const slug =  params.slug

  const getBlogPost =  fetchBlogPost
  const post = await getBlogPost(slug)



  return (
    <section className="">
      <div className="px-8 pb-12">
        <div className="relative">
          <Image
            className="w-full h-[60vh] 2xl:h-[75vh] object-cover relative"
            src={post.image.url} 
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
        <div className="my-12">
          <h1 className="text-balance text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl text-black">
            {post.title}
          </h1>
        </div>
        <div className=" pt-8 border-t">
          <p className="mt-6 text-pretty text-gray-500 2xl:text-lg">{post.description}</p>
        </div>
      </div>

      <article
        className="max-w-7xl mx-auto [&>img]:w-80 "
        dangerouslySetInnerHTML={{
          __html: post.content_html,
        }}
      ></article>
    </section>
  )
}
