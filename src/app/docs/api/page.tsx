import type { Metadata } from 'next';
import SwaggerDocClient from '@/app/docs/api/SwaggerDocClient';

export const metadata: Metadata = {
  title: 'API Docs | Echocode',
  description: 'Swagger / OpenAPI documentation for the Echocode backend.',
};

export default function ApiDocsPage() {
  return <SwaggerDocClient />;
}
