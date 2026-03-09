import PortfolioFormFieldLabel from '@/components/admin/portfolio/form/PortfolioFormFieldLabel';
import { PORTFOLIO_FORM_INPUT_CLASS_NAME } from '@/components/admin/portfolio/shared/portfolioForm.styles';

type PortfolioTextFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  error?: string | null;
  onChange: (value: string) => void;
};

export default function PortfolioTextField({
  label,
  value,
  placeholder,
  disabled,
  error,
  onChange,
}: PortfolioTextFieldProps) {
  return (
    <div className="space-y-2">
      <PortfolioFormFieldLabel>{label}</PortfolioFormFieldLabel>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={PORTFOLIO_FORM_INPUT_CLASS_NAME}
      />
      {error ? <p className="font-main text-main-xs text-[#ff9ca6]">{error}</p> : null}
    </div>
  );
}
