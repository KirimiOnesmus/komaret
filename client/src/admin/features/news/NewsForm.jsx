import { useState } from 'react';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import { NEWS_CATEGORY_OPTIONS } from './useAdminNews';

const EMPTY = {
  title: '',
  category: 'COMPANY_UPDATES',
  excerpt: '',
  body: '',
  isPublished: false,
};

export default function NewsForm({
  mode = 'create',
  initialValues,
  submitting = false,
  submitError = '',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState({ ...EMPTY, ...(initialValues || {}) });
  const [errors, setErrors] = useState({});

  const setField = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = 'Title is required.';
    if (!values.body.trim()) next.body = 'Article body is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title: values.title.trim(),
      category: values.category,
      excerpt: values.excerpt.trim() || null,
      body: values.body,
      isPublished: !!values.isPublished,
    });
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-5">
      {submitError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Input
        id="title"
        label="Title"
        value={values.title}
        onChange={(e) => setField('title', e.target.value)}
        error={errors.title}
        placeholder="e.g. New office block completed in Meru"
      />

      <Select
        id="category"
        label="Category"
        value={values.category}
        onChange={(e) => setField('category', e.target.value)}
        options={NEWS_CATEGORY_OPTIONS}
      />

      <Input
        id="excerpt"
        label="Excerpt (short summary shown on cards)"
        value={values.excerpt}
        onChange={(e) => setField('excerpt', e.target.value)}
        placeholder="One or two sentences that appear on the news listing."
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="text-sm font-medium text-gray-700">
          Body
        </label>
        <textarea
          id="body"
          rows={12}
          value={values.body}
          onChange={(e) => setField('body', e.target.value)}
          placeholder="Write the full article here."
          className={`rounded-md border px-3 py-2 text-sm leading-6 focus:outline-none focus:ring focus:ring-blue-500 focus:border-none ${
            errors.body ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.body ? (
          <span className="text-xs text-red-600">{errors.body}</span>
        ) : (
          <span className="text-xs text-gray-400">
            Basic HTML tags are allowed. Leave a blank line between paragraphs or wrap them in
            {' '}&lt;p&gt; tags.
          </span>
        )}
      </div>

      <label className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
        <input
          type="checkbox"
          checked={!!values.isPublished}
          onChange={(e) => setField('isPublished', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-[#f5b400] focus:ring-[#f5b400]"
        />
        <span className="text-sm text-gray-700">
          Publish to the public news page
          <span className="block text-xs text-gray-400">
            Unpublished articles are saved as drafts and stay hidden from visitors.
          </span>
        </span>
      </label>

      {mode === 'create' && (
        <p className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Save the article first, then add a cover image on the edit screen.
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'create' ? 'Create article' : 'Save changes'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
