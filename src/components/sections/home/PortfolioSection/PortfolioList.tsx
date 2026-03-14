import PortfolioItem from './PortfolioItem';

interface PortfolioListProps {
  list: { link: string; image: string; title: string }[];
}

const PortfolioList = ({ list }: PortfolioListProps) => {
  return (
    <ul className="grid sm:grid-cols-2 md:grid-cols-3 justify-items-center gap-4 lg:gap-10">
      {list.map((item, i) => (
        <PortfolioItem key={i} {...item} />
      ))}
    </ul>
  );
};

export default PortfolioList;
