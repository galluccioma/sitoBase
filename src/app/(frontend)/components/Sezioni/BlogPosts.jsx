import Image from "next/image";
import Link from "next/link";
import { fetchBlogPosts } from "@/app/_data";
import { fetchCategory } from "@/app/_data";

// Componente Server
const LocalBlogPosts = async () => {
  // Recupera i dati dei post direttamente nel server
  const getBlogPosts =  fetchBlogPosts
  const blogPosts = await getBlogPosts()

  const getCategory =  fetchCategory
  const category = await getCategory()


  return (
    <div className="w-full m-auto px-8 py-12">
      <h2 className="text-orange-600 font-bold text-4xl text-center">Top Rated Menu Items</h2>

      <div className="flex flex-col lg:flex-row justify-between">
        {/* Filter Type */}
        <div>
          <p className="font-bold text-gray-700">Filter Type</p>
          <div className="flex justify-between flex-wrap gap-4">
            <button
             key='All'
              // onClick={() => filterType("All")}
              className="bg-orange-500 text-white p-2 rounded-full hover:text-orange-500 border-orange-500 hover:bg-orange-50"
            >
              All
            </button>
            {category.map((item,index) => (
              <button
                key={index}
                // onClick={() => filterType(category)}
                className="bg-orange-500 text-white p-2 rounded-full hover:text-orange-500 border-orange-500 hover:bg-orange-50"
              >
                {item.categorie }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizza i post */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {blogPosts.map((item) => (
          <div key={item.slug} className="border shadow-lg rounded-lg hover:scale-105 duration-300">
            <Link href={`/blog/${item.slug}`} title={item.title || 'Missing Title'}>
              <Image
                className="w-full h-[200px] object-cover rounded-t-lg"
                src={item.image?.url || '/fallback-image.jpg'}
                alt={item.title || 'Food item'}
                width={400}
                height={300}
              />
              <div className="flex justify-between px-2 py-4">
                <p className="font-bold">{item.title}</p>
                <p>
                  <span className="bg-orange-500 text-white p-2 rounded-full hover:text-orange-500 border-orange-500 hover:bg-orange-50">
                    {item.category?.categorie || 'Nessuna categoria'}
                  </span>
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocalBlogPosts;
