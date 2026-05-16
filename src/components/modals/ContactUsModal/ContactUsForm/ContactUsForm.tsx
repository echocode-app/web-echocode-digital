import { useLocale, useTranslations } from 'next-intl';

import ContactFile from './ContactFile';
import ContactInput from './ContactInput';
import SubmitButton from './SubmitBtn';
import YourNeedsInput from './YourNeedInput';
import TurnstileWidget from '@/widgets/TurnstileWidget';
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
    turnstileKey,
    onSubmit,
    onChangeText,
    onChangeImage,
    onBlurField,
    onClearPhoneWithoutValidation,
    onTurnstileVerify,
    onTurnstileError,
  } = useClientProjectForm(onSuccessNavigate, onAutoClose, onSubmitStateChange);

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-8">
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
        <ContactFile
          file={values.image}
          error={translateError(errors.image)}
          disabled={isLocked}
          onBlur={() => onBlurField('image')}
          onChange={onChangeImage}
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
      <div className="mx-auto w-fit min-h-[71.5px]">
        <TurnstileWidget
          key={turnstileKey}
          action="client-project"
          onVerify={onTurnstileVerify}
          onError={onTurnstileError}
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
