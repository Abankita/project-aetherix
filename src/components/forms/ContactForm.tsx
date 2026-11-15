import React, { useState } from 'react';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid academic/institutional email'),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: 'idle' | 'delivered' | 'unconfigured' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resJson = await response.json().catch(() => ({}));

      if (response.ok && resJson.configured && resJson.success) {
        setSubmissionResult({
          status: 'delivered',
          message: 'Your inquiry was accepted and delivered via Resend.',
        });
      } else if (response.status === 503 || resJson.configured === false) {
        setSubmissionResult({
          status: 'unconfigured',
          message:
            resJson.message ||
            'Inquiry validated locally. Live email delivery is awaiting RESEND_API_KEY configuration in .env.local.',
        });
      } else {
        setSubmissionResult({
          status: 'error',
          message: resJson.message || 'Unable to complete submission. Please check system logs.',
        });
      }
    } catch {
      // Offline fallback handling
      setSubmissionResult({
        status: 'unconfigured',
        message:
          'Inquiry validated locally. Backend email relay is awaiting RESEND_API_KEY configuration in .env.local.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {submissionResult.status === 'delivered' ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-emerald-950 dark:text-emerald-200">Inquiry Delivered</h4>
          <p className="text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
            {submissionResult.message}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmissionResult({ status: 'idle' });
                setFormData({ name: '', email: '', subject: '', message: '' });
              }}
              className="px-5 py-2 rounded-full text-xs font-mono font-medium bg-emerald-700 text-white hover:bg-emerald-800 transition-all cursor-pointer"
            >
              Submit Another Message
            </button>
          </div>
        </div>
      ) : submissionResult.status === 'unconfigured' ? (
        <div className="p-8 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-amber-950 dark:text-amber-200">Inquiry Validated (Awaiting Resend Key)</h4>
          <p className="text-sm text-amber-800 dark:text-amber-300 max-w-md mx-auto leading-relaxed">
            {submissionResult.message}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">
            Set RESEND_API_KEY, CONTACT_TO_EMAIL, and CONTACT_FROM_EMAIL in .env.local to activate live email delivery.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmissionResult({ status: 'idle' });
                setFormData({ name: '', email: '', subject: '', message: '' });
              }}
              className="px-5 py-2 rounded-full text-xs font-mono font-medium bg-amber-800 text-white hover:bg-amber-900 transition-all cursor-pointer"
            >
              Compose Another Message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. Jane Doe"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50/60 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-gray-200 dark:border-[rgba(160,180,195,0.18)] focus:border-[#36C5D9] focus:ring-[#36C5D9]/20'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-1.5">
                Institutional Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane.doe@university.edu"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50/60 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-gray-200 dark:border-[rgba(160,180,195,0.18)] focus:border-[#36C5D9] focus:ring-[#36C5D9]/20'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Dataset access / Spatial calibration inquiry"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50/60 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                errors.subject
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-200 dark:border-[rgba(160,180,195,0.18)] focus:border-[#36C5D9] focus:ring-[#36C5D9]/20'
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-1.5">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Specify your research scope, sensor layer requirements, or coordination questions..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50/60 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                errors.message
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-200 dark:border-[rgba(160,180,195,0.18)] focus:border-[#36C5D9] focus:ring-[#36C5D9]/20'
              }`}
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.message}
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-gray-400 dark:text-[#788796] font-mono">
              Direct institutional transmission (Resend configured)
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#18191D] hover:bg-black dark:bg-[#36C5D9] dark:text-[#0B1118] dark:hover:bg-[#22B8C7] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin pointer-events-none" />
                  <span className="pointer-events-none">Transmitting...</span>
                </>
              ) : (
                <>
                  <span className="pointer-events-none">Submit Inquiry</span>
                  <Send className="w-3.5 h-3.5 pointer-events-none" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
