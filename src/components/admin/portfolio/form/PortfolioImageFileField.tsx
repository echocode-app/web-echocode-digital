import PortfolioFormFieldLabel from '@/components/admin/portfolio/form/PortfolioFormFieldLabel';
import { PORTFOLIO_FORM_INPUT_CLASS_NAME } from '@/components/admin/portfolio/shared/portfolioForm.styles';

type PortfolioImageFileFieldProps = {
  file: File | null;
  disabled: boolean;
  resetKey: string;
  error?: string | null;
  onChange: (file: File | null) => void;
};

export default function PortfolioImageFileField({
  file,
  disabled,
  resetKey,
  error,
  onChange,
}: PortfolioImageFileFieldProps) {
  return (
    <div className="space-y-2">
      <PortfolioFormFieldLabel>Image</PortfolioFormFieldLabel>
      <input
        key={resetKey}
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className={PORTFOLIO_FORM_INPUT_CLASS_NAME}
      />
      <p className="font-main text-main-xs text-gray60">
        {file ? `${file.name} (${Math.ceil(file.size / 1024)} KB)` : 'Select an image from device'}
      </p>
      {error ? <p className="font-main text-main-xs text-[#ff9ca6]">{error}</p> : null}
    </div>
  );
}
