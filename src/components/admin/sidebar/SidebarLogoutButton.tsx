'use client';

type SidebarLogoutButtonProps = {
  isSigningOut: boolean;
  onClick: () => void;
};

export default function SidebarLogoutButton({ isSigningOut, onClick }: SidebarLogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSigningOut}
      className="
        block w-full
        rounded-(--radius-secondary)
        border border-gray16
        px-3 py-2.5
        text-center font-main text-main-sm text-gray75
        transition duration-main
        hover:border-accent-hover hover:text-white
        disabled:cursor-not-allowed disabled:opacity-60
      "
    >
      {isSigningOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
