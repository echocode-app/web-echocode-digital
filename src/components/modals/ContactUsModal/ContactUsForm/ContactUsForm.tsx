import { useLocale, useTranslations } from 'next-intl';

import ContactInput from './ContactInput';
import SubmitButton from './SubmitBtn';
import YourNeedsInput from './YourNeedInput';
// import TurnstileWidget from '@/widgets/TurnstileWidget';
import RecaptchaWidget from '@/widgets/RecaptchaWidget';
import { useClientProjectForm } from '@/components/modals/ContactUsModal/ContactUsForm/useClientProjectForm';
import type { SubmitState } from '@/components/modals/ContactUsModal/ContactUsForm/useClientProjectForm';
import ContactInputNumber from './ContactInputNumber';

type ContactUsFormProps = {
  onSuccessNavigate: () => void;
  onAutoClose: () => void;
  onSubmitStateChange?: (state: SubmitState) => void;
};

const ContactUsForm = ({
  onSuccessNavigate,
  onAutoClose,
  onSubmitStateChange,
}: ContactUsFormProps) => {
  const formErrorT = useTranslations('ProjectValidation');
  const t = useTranslations('ProjectModal.projectForm');
  const locale = useLocale();

  const translateError = (key?: string) => (key ? formErrorT(key) : undefined);

  const {
    values,
    errors,
    submitState,
    isLocked,
    // turnstileKey,
    captchaKey,
    onSubmit,
    onChangeText,
    onBlurField,
    onClearPhoneWithoutValidation,
    // onTurnstileVerify,
    onCaptchaVerify,
    // onTurnstileError,
    onCaptchaError,
  } = useClientProjectForm(onSuccessNavigate, onAutoClose, onSubmitStateChange);

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="address"
        className="pointer-events-none absolute -left-2499.75 h-px w-px opacity-0"
      >
        Address *
      </label>

      <input
        id="address"
        type="text"
        name="address"
        autoComplete="street-address"
        tabIndex={-1}
        aria-hidden="true"
        data-required="true"
        aria-required="true"
        className="pointer-events-none absolute -left-2499.75 h-px w-px opacity-0"
      />
      <div className="flex flex-col gap-4 md:gap-6 mb-4 md:mb-6">
        <ContactInput
          name="firstName"
          label={t('firstNamePlaceholder')}
          value={values.firstName}
          error={translateError(errors.firstName)}
          autoComplete="given-name"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('firstName')}
          onChange={(value) => onChangeText('firstName', value)}
        />
        <ContactInputNumber
          name="phone"
          label={t('phonePlaceholder')}
          value={values.phone}
          countryCode={values.countryCode}
          locale={locale}
          error={translateError(errors.phone)}
          required
          disabled={isLocked}
          onBlur={() => onBlurField('phone')}
          onChange={(phone) => onChangeText('phone', phone)}
          onClearWithoutValidation={onClearPhoneWithoutValidation}
          onCountryCodeChange={(countryCode) => onChangeText('countryCode', countryCode)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4 md:mb-6">
        <ContactInput
          name="email"
          label={t('emailPlaceholder')}
          type="email"
          value={values.email}
          error={translateError(errors.email)}
          autoComplete="email"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('email')}
          onChange={(value) => onChangeText('email', value)}
        />
      </div>
      <div className="mb-4">
        <YourNeedsInput
          value={values.description}
          error={translateError(errors.description)}
          disabled={isLocked}
          onBlur={() => onBlurField('description')}
          onChange={(value) => onChangeText('description', value)}
        />
      </div>
      <div className="mx-auto w-fit min-h-19.5">
        {/* <TurnstileWidget
          key={turnstileKey}
          action="client-project"
          onVerify={onTurnstileVerify}
          onError={onTurnstileError}
        /> */}
        <RecaptchaWidget
          resetSignal={captchaKey}
          onVerify={onCaptchaVerify}
          onError={onCaptchaError}
        />
      </div>
      <div className="min-h-5 mb-1" aria-live="polite">
        <p
          className={`text-main-xs text-[#ff8d8d] transition-opacity duration-main ${errors.form ? 'opacity-100' : 'opacity-0'}`}
        >
          {translateError(errors.form) ?? ' '}
        </p>
      </div>
      <SubmitButton state={submitState} />
      <div className="min-h-7 pt-4 lg:pt-8 text-center" aria-live="polite">
        <p
          className={`font-title text-title-sm text-accent transition-opacity duration-main ${submitState === 'success' ? 'opacity-100' : 'opacity-0'}`}
        >
          {t('submitMessage')}
        </p>
      </div>
    </form>
  );
};

export default ContactUsForm;
