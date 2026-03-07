type AdminTableEmptyRowProps = {
  colSpan: number;
  message: string;
};

export function AdminTableEmptyRow({ colSpan, message }: AdminTableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-2 py-6 text-center font-main text-main-sm text-gray75">
        {message}
      </td>
    </tr>
  );
}
