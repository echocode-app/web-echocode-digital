'use client';

import InfoTooltip from '@/components/admin/dashboard/ui/InfoTooltip';
import PortfolioFormStep from '@/components/admin/portfolio/form/PortfolioFormStep';
import PortfolioImageFileField from '@/components/admin/portfolio/form/PortfolioImageFileField';
import PortfolioOptionGroup from '@/components/admin/portfolio/form/PortfolioOptionGroup';
import PortfolioTextField from '@/components/admin/portfolio/form/PortfolioTextField';
import {
  PORTFOLIO_FORM_CARD_CLASS_NAME,
  PORTFOLIO_FORM_SUBMIT_BUTTON_CLASS_NAME,
} from '@/components/admin/portfolio/shared/portfolioForm.styles';
import {
  isPortfolioCreateFormValid,
  type PortfolioCreateFormErrors,
  type PortfolioCreateFormState,
} from '@/components/admin/portfolio/shared/portfolioForm.types';
import {
  PORTFOLIO_CATEGORY_OPTIONS,
  PORTFOLIO_PLATFORM_OPTIONS,
} from '@/shared/portfolio/portfolio.constants';

type PortfolioCreateFormProps = {
  value: PortfolioCreateFormState;
  errors: PortfolioCreateFormErrors;
  disabled?: boolean;
  resetKey: string;
  onChange: (patch: Partial<PortfolioCreateFormState>) => void;
  onSubmit: () => void;
};

export default function PortfolioCreateForm({
  value,
  errors,
  disabled = false,
  resetKey,
  onChange,
  onSubmit,
}: PortfolioCreateFormProps) {
  const selectedPlatforms = new Set(value.platforms);
  const selectedCategories = new Set(value.categories);
  const isFormValid = isPortfolioCreateFormValid(errors);
  const isSubmitDisabled = disabled || !isFormValid;

  function toggleMultiValue(current: string[], nextValue: string) {
    return current.includes(nextValue)
      ? current.filter((item) => item !== nextValue)
      : [...current, nextValue];
  }

  return (
    <article className={PORTFOLIO_FORM_CARD_CLASS_NAME}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="font-title text-title-lg text-white">Add preview project</h2>
        </div>
        <InfoTooltip
          label="Preview project creation info"
          text="Fill all four required steps. The system generates a safe internal id from the title, uploads the selected image to portfolio storage, and then creates the dynamic preview card."
        />
      </div>

      <PortfolioFormStep
        step={1}
        title="Project title"
        description="Enter the visible title. Internal id will be generated automatically."
      >
        <PortfolioTextField
          label="Project title"
          value={value.title}
          disabled={disabled}
          placeholder="Fintech Wallet"
          error={errors.title}
          onChange={(nextValue) => onChange({ title: nextValue })}
        />
      </PortfolioFormStep>

      <PortfolioFormStep
        step={2}
        title="Project image"
        description="Upload the image file that should be shown on the preview card."
      >
        <PortfolioImageFileField
          file={value.imageFile}
          disabled={disabled}
          resetKey={resetKey}
          error={errors.image}
          onChange={(imageFile) => onChange({ imageFile })}
        />
      </PortfolioFormStep>

      <PortfolioFormStep
        step={3}
        title="Platforms"
        description="Select at least one platform to keep the existing frontend filter compatible."
      >
        <PortfolioOptionGroup
          label="Platforms"
          options={PORTFOLIO_PLATFORM_OPTIONS}
          selected={selectedPlatforms}
          disabled={disabled}
          error={errors.platforms}
          onToggle={(nextValue) =>
            onChange({
              platforms: toggleMultiValue(value.platforms, nextValue),
            })
          }
        />
      </PortfolioFormStep>

      <PortfolioFormStep
        step={4}
        title="Categories"
        description="Select at least one niche/category for the same public filter contract."
      >
        <PortfolioOptionGroup
          label="Categories"
          options={PORTFOLIO_CATEGORY_OPTIONS}
          selected={selectedCategories}
          disabled={disabled}
          error={errors.categories}
          onToggle={(nextValue) =>
            onChange({
              categories: toggleMultiValue(value.categories, nextValue),
            })
          }
        />
      </PortfolioFormStep>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="font-main text-main-xs text-gray60">
            Required before saving: title, image, at least one platform and at least one category.
          </p>
          <InfoTooltip
            label="Save button requirements info"
            text="The save button stays disabled until every required step is valid, so incomplete cards cannot be created."
          />
        </div>

        <button
          type="button"
          disabled={isSubmitDisabled}
          onClick={onSubmit}
          className={PORTFOLIO_FORM_SUBMIT_BUTTON_CLASS_NAME}
        >
          {disabled ? 'Saving...' : 'Create card'}
        </button>
      </div>
    </article>
  );
}
