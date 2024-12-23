import Image from 'next/image';
import Link from 'next/link';

const CardBlog = ({ entry }) => {
  return (
    <Link
      href={`/progetti/${entry.slug}`}
      title="Tri BK Houses"
      className="text-sm 2xl:text-sm duration-300 hover:!opacity-100"
    >
      <div className="relative overflow-hidden">
        <Image
          src={entry.image?.url}
          alt="Tri BK Houses"
          className="aspect-[4/3] rounded object-cover object-center relative group-hover:scale-110 transition-transform duration-500"
          width={300} // Adjust width as needed
          height={225} // Adjust height accordingly
          layout="fixed" 
        />
        <button className="bg-white dark:bg-slate-900 absolute bottom-0 right-0 p-4 w-auto uppercase font-bold">
          Scopri
        </button>
      </div>
      <div className="w-full">
        <div className="gap-4 py-4">
          <div className="text-2xl">{entry.title}</div>
          <div className="text-slate-500 dark:text-slate-300 text-base">{entry.description}</div>
        </div>
      </div>
    </Link>
  );
};

export default CardBlog;