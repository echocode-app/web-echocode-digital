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
    const res = await fetch('/api/forms/email-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'footer-mobile' }),
    });

    if (!res.ok) throw new Error('Request failed');

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to submit email' };
  }
};

export { submitEmail };
