"use client"
import { useState, useEffect } from 'react';
import CardBlog from '../UI/CardBlog';
import { Blog } from '@/payload-types';

const Articoli = () => {
  const [blog, setBlog] = useState<Blog[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/blog`);
        const data = await res.json();
        setBlog(data.docs);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Caricamento degli articoli in corso...</p>;
  }

  if (error) {
    return <p>Si è verificato un errore: {error.message}</p>;
  }

  return (
    <section className="flex mx-auto max-w-6xl mt-36">
      <div className="px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div data-aos="fade-up" data-aos-duration="1500" data-aos-delay="500">
            <h2 className="text-2xl font-bold md:text-4xl">Esempi di successo.</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-300">
              Abbiamo portato a termine numerosi progetti di grandi impianti fotovoltaici. Scopri come abbiamo semplificato il permitting per questi impianti in tutta Italia.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 pt-8 lg:grid-cols-3 gap-8 mt-8 [&:hover>a]:opacity-30 duration-500">
          {blog?.map((blogPost) => ( // Use optional chaining to handle potential null value
            <CardBlog key={blogPost.id} entry={blogPost} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articoli;