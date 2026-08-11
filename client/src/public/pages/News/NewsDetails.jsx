import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  FaArrowLeft,
  FaCalendarAlt,
} from 'react-icons/fa';

import Loading from '../../../shared/components/common/Loading';

import publicService from '../../../shared/services/publicService';

import { formatDate } from '../../../shared/utils/formatters';


function NewsDetails() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  useEffect(() => {

    let active = true;

    publicService
      .getNewsBySlug(slug)

      .then(({ data }) => {

        if (active) {
          setArticle(data);
        }

      })

      .catch((err) => {

        if (active) {
          setError(
            err.message ||
            'Unable to load this article.'
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

  }, [slug]);


  if (loading) {
    return (
      <div className="py-20">
        <Loading label="Loading article..." />
      </div>
    );
  }


  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">

        <p className="text-sm text-red-600">
          {error}
        </p>

      </div>
    );
  }


  if (!article) {
    return null;
  }


  const image =
    article.image ||
    article.imageUrl ||
    article.featuredImage ||
    article.coverImage;


  const category =
    article.category ||
    article.type ||
    'Company Updates';


  return (
    <div className="bg-white">


  
      <section className="bg-[#071525]">

        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">

          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs text-gray-300 transition-colors cursor-pointer hover:text-[#f5b400]"
          >
            <FaArrowLeft />
            Back to News
          </Link>


          <div className="mt-7">

            <span className="inline-block bg-[#f5b400] px-3 py-1 text-[10px] font-bold uppercase text-[#071525]">
              {category}
            </span>


            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>


            <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">

              <FaCalendarAlt className="text-[#f5b400]" />

              {formatDate(article.publishedAt)}

            </div>

          </div>

        </div>

      </section>

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">



        {image && (

          <div className="overflow-hidden rounded-xl">

            <img
              src={image}
              alt={article.title}
              className="max-h-[550px] w-full object-cover"
            />

          </div>

        )}


    
        {article.body && (

          <div
            className="prose prose-lg mt-10 max-w-none text-gray-600"
            dangerouslySetInnerHTML={{
              __html: article.body,
            }}
          />

        )}


        <div className="mt-12 border-t border-gray-200 pt-8">

          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#071525] transition-colors 
            hover:text-[#f5b400] cursor-pointer"
          >
            <FaArrowLeft />
            Back to News
          </Link>

        </div>

      </article>

    </div>
  );
}


export default NewsDetails;