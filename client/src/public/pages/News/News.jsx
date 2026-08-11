import { useEffect, useMemo, useState } from 'react';

import {
  FaSearch,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';

import publicService from '../../../shared/services/publicService';
import NewsCard from '../../features/news/NewsCard';

import extractList from '../../../shared/utils/api';

import newsHero from '../../../assets/images/news.jpg';


const CATEGORIES = [
  'All News',
  'Company Updates',
  'Industry Insights',
  'Projects',
  'Sustainability',
];


function News() {
  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('All News');

  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    let active = true;

    publicService
      .getNews()
      .then(({ data }) => {

        if (active) {
          setArticles(extractList(data));
        }

      })
      .catch((err) => {

        if (active) {
          setError(
            err.message || 'Unable to load news right now.'
          );
        }

      })
      .finally(() => {

        if (active) {
          setLoading(false);
        }

      });


    return () => {
      active = false;
    };
  }, []);


 
  const filteredArticles = useMemo(() => {

    let result = [...articles];



    if (activeCategory !== 'All News') {

      result = result.filter((article) => {

        const category =
          article.category ||
          article.type ||
          'Company Updates';

        return (
          category.toLowerCase() ===
          activeCategory.toLowerCase()
        );

      });

    }


    if (search.trim()) {

      const query = search.toLowerCase();

      result = result.filter((article) => {

        return (
          article.title?.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.category?.toLowerCase().includes(query)
        );

      });

    }


    return result;

  }, [
    articles,
    activeCategory,
    search,
  ]);



  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredArticles.length / ITEMS_PER_PAGE
    )
  );


  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategory,
    search,
  ]);


  return (
    <div className="bg-white">

      <section className="relative h-[500px] overflow-hidden bg-[#071525]">

 
        <div className="absolute inset-0">

          <img
            src={newsHero}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#071525]/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/80 to-transparent" />

        </div>


 
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

     
          <div className="flex items-center gap-2 text-md text-gray-300">

            <Link
              to="/"
              className="transition-colors hover:text-[#f5b400]"
            >
              Home
            </Link>

            <span>›</span>

            <span className="text-white">
              News
            </span>

          </div>


          <div className="mt-7 max-w-xl">

            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              News & Insights
            </h1>

            <div className="mt-5 h-1 w-12 bg-[#f5b400]" />

            <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base">
              Stay updated with the latest news, industry insights
              and company updates.
            </p>

          </div>

        </div>

      </section>

      <section className="py-12 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">


 
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


            <div className="flex flex-wrap gap-2">

              {CATEGORIES.map((category) => (

                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-md border px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
                    activeCategory === category
                      ? 'border-[#f5b400] bg-[#f5b400] text-[#071525]'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#f5b400] hover:text-[#071525]'
                  }`}
                >
                  {category}
                </button>

              ))}

            </div>


  
            <div className="relative w-full lg:w-64">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news..."
                className="h-10 w-full rounded-md border border-gray-200 bg-white px-4 pr-10 text-xs outline-none transition focus:border-[#f5b400] focus:ring-1 focus:ring-[#f5b400]"
              />

              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

            </div>

          </div>



          {loading && (
            <div className="py-16">
              <Loading label="Loading news..." />
            </div>
          )}

          {error && !loading && (

            <div className="py-16 text-center">

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

          )}



          {!loading &&
            !error &&
            filteredArticles.length === 0 && (

              <div className="py-16">

                <EmptyState
                  title={
                    search
                      ? 'No matching articles found'
                      : 'No news yet'
                  }
                />

              </div>

            )}



          {!loading &&
            !error &&
            paginatedArticles.length > 0 && (

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {paginatedArticles.map((article) => (

                  <NewsCard
                    key={article.slug}
                    article={article}
                  />

                ))}

              </div>

            )}



          {!loading &&
            !error &&
            filteredArticles.length > ITEMS_PER_PAGE && (

              <div className="mt-12 flex items-center justify-center gap-2">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-xs
                   text-gray-600 transition hover:border-[#f5b400] hover:text-[#071525] disabled:cursor-not-allowed
                    disabled:opacity-40"
                >
                  <FaChevronLeft />
                </button>


                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-xs font-medium 
                      transition cursor-pointer ${
                      currentPage === page
                        ? 'border-[#f5b400] bg-[#f5b400] text-[#071525]'
                        : 'border-gray-200 text-gray-600 hover:border-[#f5b400]'
                    }`}
                  >
                    {page}
                  </button>

                ))}


                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-xs cursor-pointer
                   text-gray-600 transition hover:border-[#f5b400] hover:text-[#071525] disabled:cursor-not-allowed
                    disabled:opacity-40"
                >
                  <FaChevronRight />
                </button>

              </div>

            )}

        </div>

      </section>

    </div>
  );
}


export default News;