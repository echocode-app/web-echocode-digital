import PortfolioItem from './PortfolioItem';

interface PortfolioListProps {
  list: { link: string; image: string; title: string }[];
}

const PortfolioList = ({ list }: PortfolioListProps) => {
  return (
    <ul className="flex items-center flex-col md:flex-row flex-wrap  gap-10">
      {list.map((item, i) => (
        <PortfolioItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default PortfolioList;
