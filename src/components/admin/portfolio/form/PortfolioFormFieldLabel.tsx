import { PORTFOLIO_FORM_LABEL_CLASS_NAME } from '@/components/admin/portfolio/shared/portfolioForm.styles';

export default function PortfolioFormFieldLabel({ children }: { children: string }) {
  return <label className={PORTFOLIO_FORM_LABEL_CLASS_NAME}>{children}</label>;
}
