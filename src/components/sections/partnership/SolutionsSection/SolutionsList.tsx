import SolutionsItem from './SolutionsItem';

const SolutionsList = () => {
  return (
    <ul className="flex justify-center flex-wrap gap-6">
      <SolutionsItem
        title="ANALYTICS"
        desc="Full funnel transparency. Amplitude and AppsFlyer for a deep understanding of user behavior."
      />
      <SolutionsItem
        title="ATTRIBUTION"
        desc="Accurate tracking of traffic sources and optimization of advertising budgets based on ROAS."
      />
      <SolutionsItem
        title="MONETIZATIOn"
        desc="Payment system integration and paywall optimization via RevenueCat, Adapty, and Stripe for Web & App."
      />
      <SolutionsItem
        title="OPTIMIZATION"
        desc="Constant improvement of conversion rates through systematic A/B testing and feedback analysis."
      />
    </ul>
  );
};

export default SolutionsList;
