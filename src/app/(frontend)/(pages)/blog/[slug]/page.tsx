import Image from "next/image";

export default async function BlogPostPage({ params }) {
  
  const slug = await params.slug; 

  const apiUrl = `https://whitelabelcms.netlify.app/api/blog?where[slug][equals]=${slug}`;
  
  const res = await fetch(apiUrl, { cache: 'no-store' });

  if (!res.ok) {
    // Handle error, e.g., display an error message
    return <p>Error fetching data</p>;
  }

  const data = await res.json();

  if (!data.docs || !data.docs[0]) {
    // Handle case where no post is found
    return <p>Post not found</p>;
  }

  const post = data.docs[0];

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
        <p className="mt-6 text-pretty text-gray-500 2xl:text-lg">
          {post.description}</p>
        </div>
      </div>

      <article className="article_styles" dangerouslySetInnerHTML={post?.content_html || " "}></article>

    </section>
  );
}
