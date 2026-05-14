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
  widthClassName?: string;
};

export function AdminDataTable({
  columns,
  children,
  errorMessage,
  pagination,
  fixedLayout,
}: {
  columns: readonly AdminDataTableColumn[];
  children: ReactNode;
  errorMessage?: string | null;
  pagination?: ReactNode;
  fixedLayout?: boolean;
}) {
  return (
    <article className={`${tableShellClassName} max-w-full`}>
      <table
        className={`${
          fixedLayout ? 'table-fixed min-w-[1080px]' : 'min-w-full'
        } w-full border-separate border-spacing-y-2`}
      >
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} className={column.widthClassName ?? undefined} />
          ))}
        </colgroup>
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
