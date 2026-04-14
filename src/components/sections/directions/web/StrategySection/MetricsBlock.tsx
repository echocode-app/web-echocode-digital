import Counter from './Counter';

const MetricsBlock = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-120 mx-auto lg:mx-0">
      <ul className="flex flex-wrap gap-1 lg:gap-3 max-w-84">
        <li className="px-1 md:px-2">#TYPESCRIPT</li>
        <li className="px-1 md:px-2">#Node.js</li>
        <li className="px-1 md:px-2">#Next.js</li>
        <li className="px-1 md:px-2">#WordPress</li>
        <li className="px-1 md:px-2">#OpenCart</li>
        <li className="px-1 md:px-2">#Shopify</li>
      </ul>
      <ul className="flex gap-6 w-full flex-col sm:flex-row">
        <li className="w-full sm:max-w-57 p-3 text-title-xs rounded-secondary border-2 border-accent">
          <h3 className="mb-3 font-wadik text-accent">SUCCESSFUL RELEASES</h3>
          <div className="flex items-center">
            <div className="w-14.5">
              <Counter to={250} />
            </div>
            <span className="font-wadik text-[20px] leading-7.5">+</span>
          </div>
        </li>
        <li className="w-full sm:max-w-57 p-3 text-title-xs rounded-secondary border-2 border-accent">
          <h3 className="mb-3 sm:max-w-20 font-title text-accent">AVERAGE UPTIME</h3>
          <div className="flex items-center">
            <div className="w-16.5">
              <Counter to={99.9} decimals={1} />
            </div>
            <span className="flex items-center text-[20px] align-text-top leading-5.5">%</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MetricsBlock;
