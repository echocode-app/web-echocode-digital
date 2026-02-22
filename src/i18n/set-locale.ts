'use server';

import { Locale } from 'next-intl';
import { cookies } from 'next/headers';

export async function changeLocaleAction(locale: Locale) {
  'use server';
  const store = await cookies();
  store.set('locale', locale);
}
