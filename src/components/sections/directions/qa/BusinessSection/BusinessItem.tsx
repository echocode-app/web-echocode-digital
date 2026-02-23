interface BusinessItem {
  title: string;
}

const BusinessItem = ({ title }: BusinessItem) => {
  return <div className="max-w-47.5 w-full font-title px-3 border-l border-accent">{title}</div>;
};

export default BusinessItem;
