
export const SERVICE_CATEGORIES = [
  'General Construction',
  'Interior Design',
  'Renovation',
  'Real Estate Development',
  'Machinery Hire',
  'Labour Supply',
  'Consultation',
  'Other',
];


export function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;