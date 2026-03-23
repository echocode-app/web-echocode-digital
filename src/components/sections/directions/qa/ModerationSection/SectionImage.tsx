import Image from 'next/image';

const SectionImage = () => {
  return (
    <div className="relative w-full aspect-540/300 md:aspect-auto md:w-135 md:h-75">
      <Image src={'/images/directions/qa/section.png'} alt="Section" fill />
    </div>
  );
};

export default SectionImage;
