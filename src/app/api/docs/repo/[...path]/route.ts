import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const REPO_ROOT = process.cwd();
const ALLOWED_MARKDOWN_FILES = new Set([
  'README.md',
  'README.uk.md',
  'docs/openapi/README.md',
  'docs/openapi/SCENARIOS.md',
  'scripts/storage/README.md',
  'src/app/docs/CLIENT_PROJECT_FORM_FRONTEND_HANDOFF.md',
  'src/app/docs/QA_CHECKLIST.md',
  'src/app/docs/README.md',
  'src/app/docs/SUBMISSIONS_INTEGRATION_HANDOFF.md',
  'src/app/docs/instructions/README-analytics-utm-en.md',
  'src/app/docs/instructions/README-analytics-utm-ru.md',
  'src/app/docs/instructions/README-portfolio-en.md',
  'src/app/docs/instructions/README-portfolio-ru.md',
  'src/app/docs/instructions/README-setup-deployment-en.md',
  'src/app/docs/instructions/README-setup-deployment-ru.md',
  'src/app/docs/instructions/README-vacancies-en.md',
  'src/app/docs/instructions/README-vacancies-ru.md',
  'src/app/docs/utm-tracking.md',
]);

function toAllowedMarkdownPath(segments: string[]): string | null {
  const relativePath = segments.join('/');
  if (!ALLOWED_MARKDOWN_FILES.has(relativePath)) return null;

  const resolvedPath = path.join(REPO_ROOT, relativePath);
  const normalizedRoot = `${REPO_ROOT}${path.sep}`;

  if (resolvedPath === REPO_ROOT || resolvedPath.startsWith(normalizedRoot)) {
    return resolvedPath;
  }

  return null;
}

export async function GET(_request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const params = await context.params;
  const filePath = toAllowedMarkdownPath(params.path ?? []);

  if (!filePath) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Repository document is not available from API docs.',
        },
      },
      { status: 404 },
    );
  }

  try {
    const contents = await readFile(filePath, 'utf8');

    return new NextResponse(contents, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Repository document was not found.',
        },
      },
      { status: 404 },
    );
  }
}
