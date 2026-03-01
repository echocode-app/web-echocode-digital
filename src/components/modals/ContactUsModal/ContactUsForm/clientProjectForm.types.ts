export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  image: File | null;
};

export type FieldName = 'firstName' | 'lastName' | 'email' | 'description' | 'image';

export type FormErrors = Partial<Record<FieldName | 'form', string>>;

export type SubmitState = 'idle' | 'loading' | 'success';

export type UploadedImagePayload = {
  path: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};
