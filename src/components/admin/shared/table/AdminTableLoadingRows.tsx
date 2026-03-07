type AdminTableLoadingRowsProps = {
  rowCount?: number;
  cellWidths: string[];
};

export function AdminTableLoadingRows({ rowCount = 4, cellWidths }: AdminTableLoadingRowsProps) {
  return (
    <>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <tr key={`loading-${rowIndex}`}>
          {cellWidths.map((widthClass, cellIndex) => (
            <td key={`${rowIndex}-${cellIndex}`} className="px-2 py-2">
              <div className={`h-4 ${widthClass} animate-pulse rounded bg-gray16`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
