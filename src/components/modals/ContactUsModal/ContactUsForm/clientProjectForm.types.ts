export type FormValues = {
  firstName: string;
  countryCode: string;
  phone: string;
  email: string;
  description: string;
  image: File | null;
};

export type FieldName = 'firstName' | 'countryCode' | 'phone' | 'email' | 'description' | 'image';

export type FormErrors = Partial<Record<FieldName | 'form', string>>;

export type SubmitState = 'idle' | 'loading' | 'success';

export type UploadedImagePayload = {
  path: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};
