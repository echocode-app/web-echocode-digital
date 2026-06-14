import {
  getClientAnalyticsContextPayload,
  getClientAnalyticsHeaders,
} from '@/components/analytics/clientAnalytics';

type FormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
  };
};

function resolveEmailSubmitErrorKey(status: number): string {
  if (status === 403) return 'form.turnstileFailed';
  if (status === 429) return 'form.rateLimit';
  if (status === 503) return 'form.serviceUnavailable';

  return 'form.submitFailed';
}

const submitEmail = async (formData: FormData, captchaToken: string): Promise<FormState> => {
  try {
    const email = formData.get('email');
    const analyticsContext = getClientAnalyticsContextPayload();
    const res = await fetch('/api/forms/email-submissions', {
      method: 'POST',
      headers: getClientAnalyticsHeaders(),
      body: JSON.stringify({
        email,
        source: 'career_footer',
        // turnstileToken,
        captchaToken,
        ...analyticsContext,
      }),
    });

    if (!res.ok) return { error: resolveEmailSubmitErrorKey(res.status) };

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'form.networkFailed' };
  }
};

export { submitEmail };
