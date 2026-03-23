import type { ReactNode } from 'react';
import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import { PORTFOLIO_FORM_STEP_CARD_CLASS_NAME } from '@/components/admin/portfolio/shared/portfolioForm.styles';

type PortfolioFormStepProps = {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
};

export default function PortfolioFormStep({
  step,
  title,
  description,
  children,
}: PortfolioFormStepProps) {
  return (
    <section className={PORTFOLIO_FORM_STEP_CARD_CLASS_NAME}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-title text-title-xs uppercase tracking-[0.12em] text-[#ffd38e]">
            Step {step}
          </p>
          <h3 className="font-title text-title-sm text-white">{title}</h3>
        </div>
        <InfoTooltip
          label={`${title} step info`}
          text={description}
        />
      </div>
      {children}
    </section>
  );
}
