import { useTranslations } from 'next-intl';

import ContactFile from './ContactFile';
import ContactInput from './ContactInput';
import SubmitButton from './SubmitBtn';
import YourNeedsInput from './YourNeedInput';
import { useClientProjectForm } from '@/components/modals/ContactUsModal/ContactUsForm/useClientProjectForm';
import type { SubmitState } from '@/components/modals/ContactUsModal/ContactUsForm/useClientProjectForm';

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
  const t = useTranslations('ProjectModal.projectForm');

  const {
    values,
    errors,
    submitState,
    isLocked,
    onSubmit,
    onChangeText,
    onChangeImage,
    onBlurField,
  } = useClientProjectForm(onSuccessNavigate, onAutoClose, onSubmitStateChange);

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-8">
        <ContactInput
          name="firstName"
          label={t('firstNamePlaceholder')}
          value={values.firstName}
          error={errors.firstName}
          autoComplete="given-name"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('firstName')}
          onChange={(value) => onChangeText('firstName', value)}
        />
        <ContactInput
          name="lastName"
          label={t('lastNamePlaceholder')}
          value={values.lastName}
          error={errors.lastName}
          autoComplete="family-name"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('lastName')}
          onChange={(value) => onChangeText('lastName', value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-8">
        <ContactInput
          name="email"
          label={t('emailPlaceholder')}
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          required
          disabled={isLocked}
          onBlur={() => onBlurField('email')}
          onChange={(value) => onChangeText('email', value)}
        />
        <ContactFile
          file={values.image}
          error={errors.image}
          disabled={isLocked}
          onBlur={() => onBlurField('image')}
          onChange={onChangeImage}
        />
      </div>
      <div className="mb-4 md:mb-8">
        <YourNeedsInput
          value={values.description}
          error={errors.description}
          disabled={isLocked}
          onBlur={() => onBlurField('description')}
          onChange={(value) => onChangeText('description', value)}
        />
      </div>
      <div className="min-h-5 mb-1" aria-live="polite">
        <p
          className={`text-main-xs text-[#ff8d8d] transition-opacity duration-main ${errors.form ? 'opacity-100' : 'opacity-0'}`}
        >
          {errors.form ?? ' '}
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
