'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import VacancyImage from './VacancyImage';

interface VacancyFormProps {
  vacancy: string;
}

const VacancyForm = ({ vacancy }: VacancyFormProps) => {
  console.log(vacancy);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <section className="pb-10 md:pb-4.5">
      <div className="mb-10 bg-main-gradient w-full h-px" />
      <div
        className="relative max-w-318 px-8 mx-auto flex flex-col  xl:flex-row xl:justify-between 
      items-center xl:items-start gap-58 xl:gap-40"
      >
        <h2 className=" text-[26px] min-[490px]:text-[40px] text-left max-w-149.5 w-full font-extra uppercase font-extrabold tracking-[-0.8px]">
          Are you the one?
        </h2>
        <VacancyImage />
        <form action="" className="max-w-149.5 w-full">
          <strong className="block mb-2 text-main-sm font-medium">
            Send your CV and a link to LinkedIn or GitHub.
          </strong>
          <div className="mb-4">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileName(file ? file.name : null);
              }}
            />

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="relative
                   flex flex-col gap-1 py-2 pl-4 pr-6 w-full text-left border rounded-secondary leading-3.5 
                   hover:border-accent focus:border-accent duration-main
                 outline-0 text-[10px]  placeholder:text-white 
                  border-white cursor-pointer
                  "
            >
              <p className="font-title">your cv</p>
              <div className="flex gap-1">
                <Image src={'/UI/clip.svg'} alt="Clip" width={12} height={16} />
                <span className="block text-primary-gray text-main-sm leading-4">
                  {fileName ?? 'your cv'}
                </span>
              </div>
            </button>
          </div>
          <div className="relative mb-4">
            <Image
              src={'/UI/chain.svg'}
              alt="Clip"
              width={14}
              height={16}
              className="absolute top-7 left-4"
            />
            <label
              htmlFor="needs"
              className=" absolute top-2 left-4
               pointer-events-none text-[10px] font-title text-white border-white"
            >
              Link LinkedIn／GitHub
            </label>
            <input
              type="text"
              name="needs"
              placeholder="paste your link"
              className="indent-4 block pt-6.5 pb-2 pl-4 pr-6 border rounded-secondary leading-4 w-full
         hover:border-accent focus:border-accent duration-main transition-colors
       outline-0 text-main-xs font-main text-white placeholder:text-primary-gray border-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-6 font-title bg-main-gradient rounded-base text-[10px]"
          >
            Apply For this poition
          </button>
        </form>
      </div>
    </section>
  );
};

export default VacancyForm;
