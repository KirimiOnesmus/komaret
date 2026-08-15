import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import Loading from "../../../shared/components/common/Loading";
import EmptyState from "../../../shared/components/common/EmptyState";
import SearchBar from "../../../shared/components/common/SearchBar";
import useServices from "../../../shared/hooks/useServices";
import useCategories from "../../../shared/hooks/useCategories";
import ServiceCard from "../../features/services/ServiceCard";

function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const { data: categories } = useCategories();

  const params = useMemo(
    () => ({
      ...(activeCategory ? { category: activeCategory } : {}),
      ...(search ? { search } : {}),
    }),
    [activeCategory, search]
  );

  const { data: services, loading, error } = useServices({ params });

  const setCategory = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setSearchParams(next);
  };

  const setSearch = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("search", value);
    else next.delete("search");
    setSearchParams(next);
  };

  const activeCategoryName =
    Array.isArray(categories) &&
    categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
              WHAT WE DO
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#071525] sm:text-4xl">
              {activeCategoryName || "Our Services"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              {activeCategoryName
                ? `Services under ${activeCategoryName}. Choose one to learn more and get an instant estimate.`
                : "Choose a service below to learn more about our construction solutions and get an instant estimate for your project."}
            </p>
          </div>

          <div className="w-full md:max-w-sm">
            <SearchBar onSearch={setSearch} placeholder="Search services..." />
          </div>
        </div>

        {/* Category filter chips */}
        {Array.isArray(categories) && categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory("")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === ""
                  ? "border-[#071525] bg-[#071525] text-white"
                  : "border-gray-200 text-gray-600 hover:border-[#f5b400] hover:text-[#071525]"
              }`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setCategory(category.slug)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === category.slug
                    ? "border-[#071525] bg-[#071525] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#f5b400] hover:text-[#071525]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="mt-10">
            <Loading label="Loading services..." />
          </div>
        )}

        {error && (
          <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="mt-10">
            <EmptyState
              title="No services found"
              message={
                activeCategory
                  ? "No services in this category yet. Try another filter."
                  : "Try a different search term."
              }
            />
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
