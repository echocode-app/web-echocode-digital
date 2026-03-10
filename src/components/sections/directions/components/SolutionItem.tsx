import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface SolutionItemProps {
  title: string;
  desc: string;
  technologies: string[];
  translateKey: string;
}

const SolutionItem = ({ title, desc, technologies, translateKey }: SolutionItemProps) => {
  const t = useTranslations(translateKey);

  return (
    <li className="flex flex-col gap-3 py-3">
      <div className="flex gap-2">
        <div className="relative w-5.5 h-6">
          <Image src={'/UI/check.svg'} alt="Check" fill />
        </div>
        <h3 className="font-title uppercase font-bold">{t(title)}</h3>
      </div>
      <p className="text-main-sm text-gray75">{t(desc)}</p>
      <ul className="flex gap-3 text-accent text-main-sm justify-end">
        {technologies.map((item, i) => (
          <li key={i} className="px-2">
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default SolutionItem;
