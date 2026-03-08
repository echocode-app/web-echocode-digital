'use server';

// import { candidateSubmissionSchema } from '@/shared/validation/submissions.candidate';

export async function submitApplication(formData: FormData) {
  const data = {
    profileUrl: formData.get('profileUrl'),
    path: formData.get('path'),
    vacancyId: formData.get('vacancyId'),
    vacancySlug: formData.get('vacancySlug'),
    vacancyTitle: formData.get('vacancyTitle'),
    level: formData.get('level'),
  };
  console.log(data);
  // const parsed = candidateSubmissionSchema.safeParse(data);

  // if (!parsed.success) {
  //   return {
  //     success: false,
  //     errors: parsed.error.flatten().fieldErrors,
  //   };
  // }

  // await fetch(`${process.env.API_URL}/api/forms/vacancy-submissions`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(parsed.data),
  // });

  return { success: true };
}
