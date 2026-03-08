import Image from 'next/image';

const CandidateImage = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 translate-y-15 xl:translate-0 xl:left-84 xl:top-2">
      <div className="relative w-74 h-49.5">
        <Image
          src={'/images/rabbits/resume.png'}
          alt="CV"
          fill
          sizes="296px"
          className="object-contain -scale-x-100"
        />
      </div>
    </div>
  );
};

export default CandidateImage;
