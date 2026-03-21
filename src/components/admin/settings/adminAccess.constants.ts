export const ADMIN_ACCESS_CARD_CLASS_NAME = `
  rounded-(--radius-base)
  border border-gray16
  bg-base-gray
  p-4
  shadow-main
`;

export const ADMIN_ACCESS_INPUT_CLASS_NAME = `
  w-full
  rounded-(--radius-secondary)
  border border-gray16
  bg-black/20
  px-3 py-2
  font-main text-main-sm text-white
  outline-none
  transition duration-main
  focus:border-accent
  disabled:cursor-not-allowed disabled:opacity-60
`;

export const ADMIN_ACCESS_SELECT_CLASS_NAME = `
  w-full
  appearance-none
  rounded-(--radius-secondary)
  border border-gray16
  bg-black/20
  px-3 py-2 pr-11
  font-main text-main-sm text-white
  outline-none
  transition duration-main
  focus:border-accent
  disabled:cursor-not-allowed disabled:opacity-60
`;

export const ADMIN_ACCESS_LABEL_CLASS_NAME = `
  mb-1 block
  font-main text-main-xs uppercase tracking-[0.12em] text-gray60
`;

export const ADMIN_ACCESS_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'developer', label: 'Developer' },
] as const;
