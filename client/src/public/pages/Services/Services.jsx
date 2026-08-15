import { useState } from "react";

import Loading from "../../../shared/components/common/Loading";
import EmptyState from "../../../shared/components/common/EmptyState";
import SearchBar from "../../../shared/components/common/SearchBar";
import useServices from "../../../shared/hooks/useServices";
import ServiceCard from "../../features/services/ServiceCard";

function Services() {
  const [search, setSearch] = useState("");
 
  const {
    data: services,
    loading,
    error,
  } = useServices({
    params: {
      search,
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">

     
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
              WHAT WE DO
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#071525] sm:text-4xl">
              Our Services
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Choose a service below to learn more about our construction
              solutions and get an instant estimate for your project.
            </p>
          </div>


          <div className="w-full md:max-w-sm">
            <SearchBar
              onSearch={setSearch}
              placeholder="Search services..."
            />
          </div>
        </div>


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
              message="Try a different search term."
            />
          </div>
        )}


        {!loading && !error && services.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;