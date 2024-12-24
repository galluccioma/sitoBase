"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/payload-types";
import Skeleton from "../UI/Skeleton";

const Foods = () => {
  const [foods, setFoods] = useState<Blog[] | null>(null);
  const [originalFoods, setOriginalFoods] = useState<Blog[] | null>(null)
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    // Fetch data from the API
    const fetchFoods = async () => {
      try {
        const response = await fetch("/api/blog"); // Assicurati che l'endpoint sia corretto
        const data = await response.json();
        const transformedData = data.docs.map((item) => ({
          id: item.id,
          name: item.title,
          category: item.category.categorie, // Accesso corretto alla categoria
          image: item.image.url,
        }));
        setFoods(transformedData);
        setOriginalFoods(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Errore durante il fetch dei dati:", error);
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Trova categorie uniche
  const uniqueCategories = [...new Set(originalFoods?.map((item) => item.category))];

  // Filtra per categoria
  const filterType = (category) => {
    if (category === "All") {
      setFoods(originalFoods);
    } else {
      setFoods(originalFoods ? originalFoods.filter((item) => item.category === category) : []);
    }
  };

  if (loading) {
   <Skeleton/>

  }

  return (
    <div className="w-full m-auto px-8 py-12">
      <h2 className="text-orange-600 font-bold text-4xl text-center">Top Rated Menu Items</h2>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row justify-between">
        {/* Filter Type */}
        <div>
          <p className="font-bold text-gray-700">Filter Type</p>
          <div className="flex justify-between flex-wrap gap-4">
            <button
              onClick={() => filterType("All")}
              className="bg-orange-500 text-white p-2 rounded-full hover:text-orange-500 border-orange-500 hover:bg-orange-50"
            >
              All
            </button>
            {uniqueCategories.map((category) => (
              <button
                key={typeof category === 'string' 
                  ? category // Use the string directly if it's a string
                  : category?.categorie || '/fallback-image.jpg' // Extract `url` if it's a Media object
              }
                onClick={() => filterType(category)}
                className="bg-orange-500 text-white p-2 rounded-full hover:text-orange-500 border-orange-500 hover:bg-orange-50"
              >
                 {typeof category === 'string' 
                      ? category // Use the string directly if it's a string
                      : category?.categorie || '/fallback-image.jpg' // Extract `url` if it's a Media object
                  }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Display foods */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {foods?.map((item) => (
          <div key={item.id} className="border shadow-lg rounded-lg hover:scale-105 duration-300">
            <Link href={`/blog/${item.id}`} title={item.title}>
                <Image
                  className="w-full h-[200px] object-cover rounded-t-lg"
                  src={
                    typeof item.image === 'string' 
                      ? item.image // Use the string directly if it's a string
                      : item.image?.url || '/fallback-image.jpg' // Extract `url` if it's a Media object
                  }                  alt={item.title || 'Food item'}
                  width={400}
                  height={300}
                />
                <div className="flex justify-between px-2 py-4">
                  <p className="font-bold">{item.title}</p>
                  <p>
                    <span className="bg-orange-500 text-white p-2 rounded-full hover:text-orange-500 border-orange-500 hover:bg-orange-50">
                      {typeof item.category === 'string' 
                      ? item.category // Use the string directly if it's a string
                      : item.category?.categorie || '/fallback-image.jpg' // Extract `url` if it's a Media object
                  }
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

export default Foods;
