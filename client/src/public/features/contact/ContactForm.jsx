import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

import Input from '../../../shared/components/common/Input';
import publicService from '../../../shared/services/publicService';

import {
  isRequired,
  isValidPhone,
  isWithinLength,
} from '../../../shared/validators/formValidators';

import { isValidEmail } from '../../../shared/validators/authValidators';


const MESSAGE_MAX_LENGTH = 2000;

const CONTACT_TYPES = [
  { value: 'ENQUIRY', label: 'General enquiry' },
  { value: 'TESTIMONIAL', label: 'Testimonial / feedback' },
  { value: 'COMPLAINT', label: 'Complaint' },
];


function ContactForm() {
  const [values, setValues] = useState({
    type: 'ENQUIRY',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');


  const handleChange = (field) => (e) => {
    setValues((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };


  const validate = () => {
    const next = {};

    if (!isRequired(values.name)) {
      next.name = 'Name is required.';
    }

    if (!isValidEmail(values.email)) {
      next.email = 'Enter a valid email address.';
    }

    if (values.phone && !isValidPhone(values.phone)) {
      next.phone = 'Enter a valid phone number.';
    }

    if (!isRequired(values.message)) {
      next.message = 'Message is required.';
    } else if (
      !isWithinLength(values.message, MESSAGE_MAX_LENGTH)
    ) {
      next.message = `Keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      await publicService.submitContactForm(values);
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">

        <div className="flex items-start gap-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            
          </div>

          <div>
            <p className="text-sm font-bold text-green-800">
              Message sent successfully.
            </p>

            <p className="mt-1 text-xs leading-5 text-green-700">
              Thanks for reaching out. We've sent a confirmation to your
              email, and our team will get back to you shortly.
            </p>
          </div>

        </div>
      </div>
    );
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >


      <div className="flex flex-col gap-1">
        <label htmlFor="type" className="text-xs font-medium text-gray-700">
          What's this about?
        </label>
        <select
          id="type"
          value={values.type}
          onChange={handleChange('type')}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none transition focus:border-[#f5b400] focus:ring-1 focus:ring-[#f5b400]"
        >
          {CONTACT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <Input
          id="name"
          label="Full Name"
          placeholder="Your full name"
          maxLength={150}
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="Your email address"
          maxLength={254}
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />

      </div>



      <Input
        id="phone"
        label="Phone Number"
        type="tel"
        placeholder="Your phone number"
        maxLength={20}
        value={values.phone}
        onChange={handleChange('phone')}
        error={errors.phone}
      />


  
      <Input
        id="subject"
        label="Subject"
        placeholder="How can we help you?"
        maxLength={150}
        value={values.subject}
        onChange={handleChange('subject')}
      />


 
      <div className="flex flex-col gap-1">

        <label
          htmlFor="message"
          className="text-xs font-medium text-gray-700"
        >
          Message
        </label>

        <textarea
          id="message"
          rows={6}
          maxLength={MESSAGE_MAX_LENGTH}
          value={values.message}
          onChange={handleChange('message')}
          placeholder="Tell us more about your project..."
          className={`w-full resize-none rounded-md border bg-white px-3 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#f5b400] focus:ring-1 focus:ring-[#f5b400] ${
            errors.message
              ? 'border-red-500'
              : 'border-gray-200'
          }`}
        />

        {errors.message && (
          <span className="text-xs text-red-600">
            {errors.message}
          </span>
        )}

      </div>


     
      {serverError && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-600"
        >
          {serverError}
        </p>
      )}



      <button
        type="submit"
        disabled={submitting}
        className="inline-flex cursor-pointer items-center gap-3 bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition-all hover:bg-[#dca500] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Sending...' : 'Send Message'}

        <FaPaperPlane className="text-xs" />
      </button>

    </form>
  );
}


export default ContactForm;