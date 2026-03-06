import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const OPENAPI_ROOT = path.join(process.cwd(), 'docs', 'openapi');

function resolveContentType(filePath: string): string {
  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return 'application/yaml; charset=utf-8';
  }

  if (filePath.endsWith('.json')) {
    return 'application/json; charset=utf-8';
  }

  return 'text/plain; charset=utf-8';
}

function toSafeFilePath(segments: string[]): string | null {
  const resolvedPath = path.join(OPENAPI_ROOT, ...segments);
  const normalizedRoot = `${OPENAPI_ROOT}${path.sep}`;

  if (resolvedPath === OPENAPI_ROOT || resolvedPath.startsWith(normalizedRoot)) {
    return resolvedPath;
  }

  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const params = await context.params;
  const segments = params.path ?? [];
  const filePath = toSafeFilePath(segments);

  if (!filePath) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid OpenAPI asset path',
        },
      },
      { status: 400 },
    );
  }

  try {
    const contents = await readFile(filePath, 'utf8');

    return new NextResponse(contents, {
      status: 200,
      headers: {
        'Content-Type': resolveContentType(filePath),
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'OpenAPI asset was not found',
        },
      },
      { status: 404 },
    );
  }
}
