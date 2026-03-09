import PortfolioFormFieldLabel from '@/components/admin/portfolio/form/PortfolioFormFieldLabel';
import {
  PORTFOLIO_FORM_OPTION_BUTTON_ACTIVE_CLASS_NAME,
  PORTFOLIO_FORM_OPTION_BUTTON_BASE_CLASS_NAME,
  PORTFOLIO_FORM_OPTION_BUTTON_IDLE_CLASS_NAME,
} from '@/components/admin/portfolio/shared/portfolioForm.styles';

type PortfolioOptionGroupProps = {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: Set<string>;
  disabled: boolean;
  error?: string | null;
  onToggle: (value: string) => void;
};

export default function PortfolioOptionGroup({
  label,
  options,
  selected,
  disabled,
  error,
  onToggle,
}: PortfolioOptionGroupProps) {
  return (
    <div className="space-y-2">
      <PortfolioFormFieldLabel>{label}</PortfolioFormFieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selected.has(option.value);

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(option.value)}
              className={`${PORTFOLIO_FORM_OPTION_BUTTON_BASE_CLASS_NAME} ${
                checked
                  ? PORTFOLIO_FORM_OPTION_BUTTON_ACTIVE_CLASS_NAME
                  : PORTFOLIO_FORM_OPTION_BUTTON_IDLE_CLASS_NAME
              }`}
              aria-pressed={checked}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? <p className="font-main text-main-xs text-[#ff9ca6]">{error}</p> : null}
    </div>
  );
}
