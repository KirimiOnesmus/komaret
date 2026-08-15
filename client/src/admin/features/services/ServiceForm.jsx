import { useState } from 'react';
import { FaMagic, FaLink } from 'react-icons/fa';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { slugify, SLUG_PATTERN } from './serviceCatalog';
import useAdminCategories from './useAdminCategories';

const NAVY = 'bg-[#071525] text-white hover:bg-[#0d2036]';


function RequestToggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-[#f5b400]/60 has-[:checked]:border-[#f5b400] has-[:checked]:bg-[#f5b400]/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#071525] focus:ring-[#071525]"
      />
      <span>
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        <span className="block text-xs text-gray-500">{hint}</span>
      </span>
    </label>
  );
}

function Section({ title, children }) {
  return (
    <fieldset className="rounded-xl border border-gray-200 p-5">
      <legend className="px-1 text-xs font-bold uppercase tracking-wide text-gray-400">
        {title}
      </legend>
      <div className="mt-2 flex flex-col gap-5">{children}</div>
    </fieldset>
  );
}


export default function ServiceForm({
  mode = 'create',
  initialValues,
  submitting,
  submitError,
  onSubmit,
  onCancel,
}) {
  const { categories, loading: categoriesLoading } = useAdminCategories();

  const [values, setValues] = useState(() => ({
    name: '',
    slug: '',
    categoryId: '',
    summary: '',
    description: '',
    isPublished: true,
    sortOrder: 0,
    supportsServiceRequest: true,
    supportsMachineryRequest: false,
    supportsLabourRequest: false,
    supportsEstimate: false,
    estimateMarginPct: 10,
    ...initialValues,
  }));


  const [slugLocked, setSlugLocked] = useState(mode === 'edit');
  const [errors, setErrors] = useState({});

  const set = (field, value) => setValues((v) => ({ ...v, [field]: value }));

  const handleName = (e) => {
    const name = e.target.value;
    setValues((v) => ({
      ...v,
      name,
      slug: slugLocked ? v.slug : slugify(name),
    }));
  };

  const regenerateSlug = () => {
    set('slug', slugify(values.name));
    setSlugLocked(false);
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Service name is required.';

    const slug = slugify(values.slug || values.name);
    if (!slug) next.slug = 'A slug is required (it comes from the name).';
    else if (!SLUG_PATTERN.test(slug)) next.slug = 'Use lowercase letters, numbers and hyphens only.';

    if (values.supportsEstimate) {
      const m = Number(values.estimateMarginPct);
      if (Number.isNaN(m) || m < 0 || m > 100) next.estimateMarginPct = 'Enter a margin between 0 and 100.';
    }
    if (values.sortOrder !== '' && Number(values.sortOrder) < 0) {
      next.sortOrder = 'Display order cannot be negative.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: values.name.trim(),
      slug: slugify(values.slug || values.name),
      categoryId: values.categoryId || null,
      summary: values.summary.trim() || null,
      description: values.description.trim() || null,
      isPublished: Boolean(values.isPublished),
      sortOrder: Number(values.sortOrder) || 0,
      supportsServiceRequest: Boolean(values.supportsServiceRequest),
      supportsMachineryRequest: Boolean(values.supportsMachineryRequest),
      supportsLabourRequest: Boolean(values.supportsLabourRequest),
      supportsEstimate: Boolean(values.supportsEstimate),
      estimateMarginPct: values.supportsEstimate ? Number(values.estimateMarginPct) : 0,
    };
    onSubmit(payload);
  };

  const previewSlug = slugify(values.slug || values.name) || 'your-service';

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-6" noValidate>
      {submitError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <Section title="Details">
        <Input
          id="name"
          label="Service name"
          placeholder="e.g. General Construction"
          maxLength={200}
          value={values.name}
          onChange={handleName}
          error={errors.name}
          required
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="slug" className="text-sm font-medium text-gray-700">
              Public link
            </label>
            {slugLocked ? (
              <button
                type="button"
                onClick={regenerateSlug}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#071525] hover:text-[#f5b400]"
              >
                <FaMagic className="text-[10px]" /> Regenerate from name
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSlugLocked(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#071525]"
              >
                <FaLink className="text-[10px]" /> Edit manually
              </button>
            )}
          </div>

          <div
            className={`flex items-stretch overflow-hidden rounded-md border ${
              errors.slug ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <span className="flex select-none items-center bg-gray-50 px-3 text-sm text-gray-400">
              /services/
            </span>
            <input
              id="slug"
              value={values.slug}
              readOnly={slugLocked}
              onChange={(e) => set('slug', e.target.value)}
              onBlur={(e) => set('slug', slugify(e.target.value))}
              placeholder={previewSlug}
              className={`flex-1 px-3 py-2 text-sm text-gray-900 focus:outline-none ${
                slugLocked ? 'cursor-default bg-gray-50 text-gray-500' : 'bg-white'
              }`}
            />
          </div>
          {errors.slug ? (
            <span className="text-xs text-red-600">{errors.slug}</span>
          ) : (
            <span className="text-xs text-gray-400">
              Auto-generated from the name. This is the address clients will see.
            </span>
          )}
        </div>

   
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={values.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
            disabled={categoriesLoading}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#071525] focus:outline-none focus:ring-1 focus:ring-[#071525] disabled:opacity-60"
          >
            <option value="">
              {categoriesLoading ? 'Loading categories…' : 'Select a category…'}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isPublished ? '' : ' (internal)'}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="summary"
          label="Short summary (optional)"
          placeholder="One line shown on service cards"
          maxLength={300}
          value={values.summary}
          onChange={(e) => set('summary', e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={5}
            maxLength={2000}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe the service…"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#071525] focus:outline-none focus:ring-1 focus:ring-[#071525]"
          />
        </div>
      </Section>

      <Section title="What clients can request">
        <div className="grid gap-3 sm:grid-cols-2">
          <RequestToggle
            label="Service request"
            hint="Standard enquiry for this service"
            checked={values.supportsServiceRequest}
            onChange={(v) => set('supportsServiceRequest', v)}
          />
          <RequestToggle
            label="Machinery request"
            hint="Clients can request machinery here"
            checked={values.supportsMachineryRequest}
            onChange={(v) => set('supportsMachineryRequest', v)}
          />
          <RequestToggle
            label="Labour request"
            hint="Clients can request labour here"
            checked={values.supportsLabourRequest}
            onChange={(v) => set('supportsLabourRequest', v)}
          />
          <RequestToggle
            label="Instant estimate"
            hint="Show the rate-card estimate form"
            checked={values.supportsEstimate}
            onChange={(v) => set('supportsEstimate', v)}
          />
        </div>

        {values.supportsEstimate && (
          <div className="max-w-xs">
            <Input
              id="estimateMarginPct"
              label="Estimate margin (± %)"
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={values.estimateMarginPct}
              onChange={(e) => set('estimateMarginPct', e.target.value)}
              error={errors.estimateMarginPct}
            />
            <p className="mt-1 text-xs text-gray-400">
              The indicative estimate is shown as a ± band of this size.
            </p>
          </div>
        )}
      </Section>

      <Section title="Visibility">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={values.isPublished}
            onChange={(e) => set('isPublished', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#071525] focus:ring-[#071525]"
          />
          <span className="text-sm text-gray-700">
            Published <span className="text-gray-400">— visible on the public site</span>
          </span>
        </label>

        <div className="max-w-xs">
          <Input
            id="sortOrder"
            label="Display order"
            type="number"
            min="0"
            step="1"
            value={values.sortOrder}
            onChange={(e) => set('sortOrder', e.target.value)}
            error={errors.sortOrder}
          />
          <p className="mt-1 text-xs text-gray-400">Lower numbers appear first.</p>
        </div>
      </Section>

      <div className="flex items-center gap-3 border-t border-gray-200 pt-5">
        <button type="submit" disabled={submitting} className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${NAVY}`}>
          {submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create service'}
        </button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}