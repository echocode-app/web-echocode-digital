import Image from 'next/image';

interface CloseBtnProps {
  onClose: () => void;
  disabled?: boolean;
}

const CloseBtn = ({ onClose, disabled = false }: CloseBtnProps) => {
  return (
    <button
      type="button"
      onClick={onClose}
      disabled={disabled}
      aria-label="Close modal"
      title="Close modal"
      className="relative flex h-11 w-8.5 items-center justify-center rounded-secondary
       transition-[color,opacity] duration-main hover:opacity-60 focus-visible:opacity-60 
       focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
    >
      <Image src={'/UI/close.svg'} alt="Close" fill />
    </button>
  );
};

export default CloseBtn;
