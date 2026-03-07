import type { ReactNode } from 'react';

const tableShellClassName =
  'overflow-x-auto rounded-(--radius-base) border border-gray16 bg-base-gray p-4';
const headerRowClassName =
  'text-left font-main text-main-xs uppercase tracking-[0.12em] text-gray60';
const headerCellClassName = 'px-2 py-1';
const errorTextClassName = 'mt-3 font-main text-main-sm text-[#ff6d7a]';

export type AdminDataTableColumn = {
  key: string;
  label: string;
};

export function AdminDataTable({
  columns,
  children,
  errorMessage,
  pagination,
}: {
  columns: readonly AdminDataTableColumn[];
  children: ReactNode;
  errorMessage?: string | null;
  pagination?: ReactNode;
}) {
  return (
    <article className={tableShellClassName}>
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr className={headerRowClassName}>
            {columns.map((column) => (
              <th key={column.key} className={headerCellClassName}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>

      {errorMessage ? <p className={errorTextClassName}>{errorMessage}</p> : null}
      {pagination}
    </article>
  );
}
