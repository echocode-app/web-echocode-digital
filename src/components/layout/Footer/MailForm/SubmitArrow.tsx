import Image from 'next/image';

interface SubmitArrowProps {
  islocalError: boolean;
}

const SubmitArrow = ({ islocalError }: SubmitArrowProps) => {
  return (
    <button type="submit" disabled={islocalError} className="relative w-7.5 h-2.5">
      <Image src="/UI/right-arrow.svg" fill alt="Right Arrow" />
    </button>
  );
};

export default SubmitArrow;
