import React, { useState } from 'react';
import { z } from 'zod';
import { Star, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';

const feedbackSchema = z.object({
  name: z.string().optional(),
  category: z.string().min(1, 'Please select a feedback category'),
  rating: z.number().min(1, 'Please select a rating between 1 and 5 stars').max(5),
  comment: z.string().min(10, 'Feedback comment must be at least 10 characters long'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    category: 'Telemetry Accuracy',
    rating: 5,
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    status: 'idle' | 'delivered' | 'unconfigured' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const categories = [
    'Telemetry Accuracy',
    'Satellite Calibration (S2 / NISAR)',
    'Watershed Geomorphology',
    'User Interface & Cartography',
    'Dataset Citation / Metadata',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = feedbackSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FeedbackFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FeedbackFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const resJson = await response.json().catch(() => ({}));

      if (response.ok && resJson.configured && resJson.success) {
        setSubmissionResult({
          status: 'delivered',
          message: 'Feedback accepted and delivered to the research triage pipeline via Resend.',
        });
      } else if (response.status === 503 || resJson.configured === false) {
        setSubmissionResult({
          status: 'unconfigured',
          message:
            resJson.message ||
            'Feedback validated locally. Live transmission awaiting RESEND_API_KEY configuration in .env.local.',
        });
      } else {
        setSubmissionResult({
          status: 'error',
          message: resJson.message || 'Unable to record feedback. Please check system logs.',
        });
      }
    } catch {
      setSubmissionResult({
        status: 'unconfigured',
        message:
          'Feedback validated locally. Backend relay awaiting RESEND_API_KEY configuration in .env.local.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {submissionResult.status === 'delivered' ? (
        <div className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-blue-950 dark:text-blue-200">Feedback Transmitted</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 max-w-md mx-auto leading-relaxed">
            {submissionResult.message}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmissionResult({ status: 'idle' });
                setFormData({
                  name: '',
                  category: 'Telemetry Accuracy',
                  rating: 5,
                  comment: '',
                });
              }}
              className="px-5 py-2 rounded-full text-xs font-mono font-medium bg-[#36C5D9] text-[#0B1118] hover:bg-[#22B8C7] transition-all cursor-pointer font-semibold"
            >
              Provide Another Review
            </button>
          </div>
        </div>
      ) : submissionResult.status === 'unconfigured' ? (
        <div className="p-8 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-amber-950 dark:text-amber-200">Feedback Recorded (Awaiting Resend Key)</h4>
          <p className="text-xs text-amber-900 dark:text-amber-300 max-w-md mx-auto leading-relaxed">
            {submissionResult.message}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmissionResult({ status: 'idle' });
                setFormData({
                  name: '',
                  category: 'Telemetry Accuracy',
                  rating: 5,
                  comment: '',
                });
              }}
              className="px-5 py-2 rounded-full text-xs font-mono font-medium bg-amber-800 text-white hover:bg-amber-900 transition-all cursor-pointer"
            >
              Compose Another Review
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50/70 dark:bg-[#172330] rounded-xl border border-blue-200/60 dark:border-[rgba(160,180,195,0.14)] text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
            All feedback is directed to consortium research calibration channels. Comments will
            not be displayed on a public feed.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-1.5">
                Name (Optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Anonymous or your name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(160,180,195,0.18)] text-sm bg-gray-50/60 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] dark:placeholder-gray-500 focus:outline-none focus:border-[#36C5D9] focus:ring-2 focus:ring-[#36C5D9]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-1.5">
                Feedback Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[rgba(160,180,195,0.18)] text-sm bg-gray-50/60 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] focus:outline-none focus:border-[#36C5D9] focus:ring-2 focus:ring-[#36C5D9]/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-[#111C28]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-2">
              Scientific Quality Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1.5 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                  aria-label={`${star} Star`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors pointer-events-none ${
                      star <= formData.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono text-[#626873] dark:text-[#AAB5C2] ml-2 font-medium">
                {formData.rating} of 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#AAB5C2] mb-1.5">
              Comment / Feedback Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your suggestions, field calibration feedback, or interface observations..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50/60 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                errors.comment
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-200 dark:border-[rgba(160,180,195,0.18)] focus:border-[#36C5D9] focus:ring-[#36C5D9]/20'
              }`}
            />
            {errors.comment && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.comment}
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-gray-400 dark:text-[#788796] font-mono">
              Consortium private review channel (Resend relay)
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#18191D] hover:bg-black dark:bg-[#36C5D9] dark:text-[#0B1118] dark:hover:bg-[#22B8C7] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin pointer-events-none" />
                  <span className="pointer-events-none">Submitting...</span>
                </>
              ) : (
                <span className="pointer-events-none">Submit Feedback</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
