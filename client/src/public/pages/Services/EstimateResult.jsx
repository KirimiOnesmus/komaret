import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaCalculator, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

import Loading from '../../../shared/components/common/Loading';
import useServiceRequest from '../../../shared/hooks/useServiceRequest';
import useServices from '../../../shared/hooks/useServices';
import { getCategoryIcon } from '../../features/services/categoryIcons';
import { formatCurrency } from '../../../shared/utils/formatters';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';

/**
 * Rate-card-driven instant estimate. Each service exposes an active rate card
 * (label / unit / unitPrice / minQty / defaultQty); we render one quantity
 * input per rate line and POST { serviceId, items:[{rateId, quantity}] } to the
 * estimate API, which returns a priced breakdown + an indicative low–high band.
 */
function EstimateResult() {
  const { slug } = useParams();
  const location = useLocation();

  const { data: service, loading: serviceLoading } = useServices({ slug });
  const { requestEstimate, estimating, error } = useServiceRequest();

  const rates = useMemo(() => service?.rates || [], [service]);
  const canEstimate = Boolean(service?.supports?.estimate) && rates.length > 0;

  const Icon = getCategoryIcon(service?.category?.slug) || FaCalculator;

  const [quantities, setQuantities] = useState({});
  const [estimate, setEstimate] = useState(location.state?.estimate ?? null);
  const [formError, setFormError] = useState(null);

  // Seed each quantity with the rate's defaultQty once the service loads.
  useEffect(() => {
    if (rates.length === 0) return;
    setQuantities((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const seed = {};
      for (const r of rates) seed[r.id] = r.defaultQty != null ? String(r.defaultQty) : '';
      return seed;
    });
  }, [rates]);

  const setQty = (rateId) => (e) =>
    setQuantities((q) => ({ ...q, [rateId]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const items = rates
      .map((r) => ({ rateId: r.id, quantity: Number(quantities[r.id]) || 0 }))
      .filter((i) => i.quantity > 0);

    if (items.length === 0) {
      setFormError('Enter a quantity for at least one item to calculate an estimate.');
      return;
    }

    const data = await requestEstimate({ serviceId: service.id, items }).catch(() => null);
    if (data) setEstimate(data);
  };

  if (serviceLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading label="Loading estimate…" />
      </div>
    );
  }

  const serviceName = service?.name || 'Service';

  const Hero = ({ crumb }) => (
    <section className="relative overflow-hidden bg-[#071525]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/95 to-[#071525]/80" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link to={PUBLIC_PATHS.HOME} className="hover:text-[#f5b400]">Home</Link>
          <span>›</span>
          <Link to={`/services/${encodeURIComponent(slug)}`} className="hover:text-[#f5b400]">{serviceName}</Link>
          <span>›</span>
          <span className="text-white">{crumb}</span>
        </div>
        <div className="mt-7 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f5b400] text-[#071525]">
            <Icon className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">Instant Estimate</p>
            <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{serviceName}</h1>
          </div>
        </div>
      </div>
    </section>
  );

  // Service can't be estimated (no rate card / estimate disabled).
  if (!canEstimate) {
    return (
      <div className="bg-white">
        <Hero crumb="Estimate" />
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#071525]">An instant estimate isn’t available for this service</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              This service is priced case by case. Send us your project details and our team will prepare a custom quote for you.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={`/services/${encodeURIComponent(slug)}/request`}>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition hover:bg-[#dca200] sm:w-auto">
                  Request a Quote <FaArrowRight />
                </button>
              </Link>
              <Link to={`/services/${encodeURIComponent(slug)}`}>
                <button type="button" className="w-full rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-[#071525] transition hover:bg-gray-50 sm:w-auto">
                  Back to service
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Result view
  if (estimate) {
    const lines = estimate.lines || [];
    return (
      <div className="bg-white">
        <Hero crumb="Your Estimate" />
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                  <FaCheckCircle className="text-3xl" />
                </div>
                <p className="mt-6 text-sm font-medium text-gray-500">Indicative estimate for</p>
                <h2 className="mt-1 text-2xl font-bold text-[#071525]">{estimate.service?.name || serviceName}</h2>
              </div>

              <div className="mt-8 rounded-lg bg-[#071525] px-6 py-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Estimated Range</p>
                <p className="mt-3 text-3xl font-bold text-[#f5b400] sm:text-4xl">
                  {formatCurrency(estimate.range?.low)} – {formatCurrency(estimate.range?.high)}
                </p>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">{estimate.note}</p>
              </div>

              {/* breakdown */}
              <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Item</th>
                      <th className="px-4 py-2 font-medium text-right">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">Unit price</th>
                      <th className="px-4 py-2 font-medium text-right">Line total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {lines.map((l) => (
                      <tr key={l.rateId}>
                        <td className="px-4 py-2 text-[#071525]">{l.label}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{Number(l.quantity)} {l.unit}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(l.unitPrice)}</td>
                        <td className="px-4 py-2 text-right text-gray-800">{formatCurrency(l.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <dl className="mt-4 ml-auto max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="text-gray-900">{formatCurrency(estimate.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">VAT ({Number(estimate.taxRatePct)}%)</dt><dd className="text-gray-900">{formatCurrency(estimate.taxAmount)}</dd></div>
                <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold"><dt className="text-[#071525]">Total</dt><dd className="text-[#071525]">{formatCurrency(estimate.total)}</dd></div>
              </dl>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={() => setEstimate(null)} className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-[#071525] transition hover:bg-gray-50">
                  Adjust Estimate
                </button>
                <Link to={`/services/${encodeURIComponent(slug)}/request`}>
                  <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition hover:bg-[#dca200] sm:w-auto">
                    Request Full Quote <FaArrowRight />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Input form
  return (
    <div className="bg-white">
      <Hero crumb="Estimate" />
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">How It Works</p>
              <h2 className="mt-2 text-3xl font-bold text-[#071525]">Get a quick project estimate</h2>
              <p className="mt-4 text-sm leading-7 text-gray-600">
                Enter the quantities that apply to your project for <strong>{serviceName}</strong> and we’ll calculate an
                indicative cost from our current rates.
              </p>
              <div className="mt-8 space-y-5">
                {[
                  ['1', 'Enter your quantities', 'Fill in the amounts for the items relevant to your project.'],
                  ['2', 'We calculate the estimate', 'Your quantities are priced against this service’s rate card, with VAT.'],
                  ['3', 'Request a detailed quote', 'Happy with the range? Ask our team for a formal quotation.'],
                ].map(([n, title, desc]) => (
                  <div key={n} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                      <span className="font-bold">{n}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#071525]">{title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#071525]">Project Information</h2>
                <p className="mt-1 text-sm text-gray-500">Estimating: <strong>{serviceName}</strong></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {rates.map((r) => (
                  <div key={r.id} className="flex flex-col gap-1">
                    <label htmlFor={`rate-${r.id}`} className="text-sm font-medium text-gray-700">
                      {r.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`rate-${r.id}`}
                        type="number"
                        min="0"
                        step="any"
                        value={quantities[r.id] ?? ''}
                        onChange={setQty(r.id)}
                        placeholder="0"
                        className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none transition focus:border-[#f5b400] focus:ring focus:ring-[#f5b400]/20"
                      />
                      <span className="shrink-0 text-sm text-gray-400">{r.unit}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(r.unitPrice)} / {r.unit}
                      {r.minQty != null && Number(r.minQty) > 0 ? ` · min ${Number(r.minQty)}` : ''}
                    </p>
                  </div>
                ))}

                {(formError || error) && (
                  <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {formError || error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={estimating}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition hover:bg-[#dca200] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaCalculator />
                  {estimating ? 'Calculating Estimate…' : 'Calculate Estimate'}
                </button>

                <p className="text-center text-xs leading-5 text-gray-400">
                  Estimates are indicative only and are not a binding quotation. Final pricing is confirmed after project assessment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EstimateResult;
