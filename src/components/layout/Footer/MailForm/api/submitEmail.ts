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

const submitEmail = async (formData: FormData): Promise<FormState> => {
  try {
    const email = formData.get('email');
    const analyticsContext = getClientAnalyticsContextPayload();
    const res = await fetch('/api/forms/email-submissions', {
      method: 'POST',
      headers: getClientAnalyticsHeaders(),
      body: JSON.stringify({
        email,
        source: 'footer-mobile',
        ...analyticsContext,
      }),
    });

    if (!res.ok) throw new Error('Request failed');

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to submit email' };
  }
};

export { submitEmail };
