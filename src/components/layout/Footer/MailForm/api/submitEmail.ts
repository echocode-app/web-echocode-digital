import { emailSchema } from '../shemas/emailSchema';

type FormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
  };
};

const submitEmail = async (formData: FormData): Promise<FormState> => {
  const rawData = {
    email: formData.get('email'),
  };

  const result = emailSchema.safeParse(rawData);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await fetch('/api/forms/email-submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: result.data.email,
        source: 'footer-mobile',
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
