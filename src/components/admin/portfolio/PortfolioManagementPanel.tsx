'use client';

import { useEffect, useState } from 'react';
import PortfolioCardsSection from '@/components/admin/portfolio/panel/PortfolioCardsSection';
import PortfolioStatusCard from '@/components/admin/portfolio/panel/PortfolioStatusCard';
import PortfolioCreateForm from '@/components/admin/portfolio/PortfolioCreateForm';
import {
  createAdminPortfolioProject,
  deleteAdminPortfolioProject,
  fetchAdminPortfolioProjects,
  initAdminPortfolioImageUpload,
  uploadAdminPortfolioImage,
} from '@/components/admin/portfolio/shared/adminPortfolio.api';
import {
  INITIAL_PORTFOLIO_CREATE_FORM_STATE,
  isPortfolioCreateFormValid,
  type PortfolioCreateFormState,
  validatePortfolioCreateForm,
} from '@/components/admin/portfolio/shared/portfolioForm.types';
import AdminToast, { type AdminToastState } from '@/components/admin/ui/AdminToast';
import type { AdminPortfolioPreviewProjectDto } from '@/server/portfolio';

const BASE_CARD_CLASS_NAME = 'rounded-(--radius-base) border bg-base-gray p-4 shadow-main';
const DEFAULT_CARD_CLASS_NAME = `${BASE_CARD_CLASS_NAME} border-gray16`;
const ERROR_CARD_CLASS_NAME = `${BASE_CARD_CLASS_NAME} border-[#ff6d7a]/40`;

export default function PortfolioManagementPanel() {
  const [items, setItems] = useState<AdminPortfolioPreviewProjectDto[]>([]);
  const [form, setForm] = useState<PortfolioCreateFormState>(INITIAL_PORTFOLIO_CREATE_FORM_STATE);
  const formErrors = validatePortfolioCreateForm(form);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<AdminToastState>(null);
  const [formResetKey, setFormResetKey] = useState(() => String(Date.now()));

  useEffect(() => {
    const controller = new AbortController();

    fetchAdminPortfolioProjects(controller.signal)
      .then((payload) => {
        setItems(payload);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        setState('error');
        setToast({
          id: Date.now(),
          tone: 'error',
          message:
            error instanceof Error ? error.message : 'Failed to load portfolio preview cards.',
        });
      });

    return () => controller.abort();
  }, []);

  function updateForm(patch: Partial<PortfolioCreateFormState>) {
    setForm((prev) => ({
      ...prev,
      ...patch,
    }));
  }

  async function handleCreate() {
    if (!isPortfolioCreateFormValid(formErrors)) {
      setToast({
        id: Date.now(),
        tone: 'error',
        message:
          formErrors.title ??
          formErrors.image ??
          formErrors.platforms ??
          formErrors.categories ??
          'Review the highlighted fields and fix the validation errors.',
      });
      return;
    }

    const imageFile = form.imageFile;
    if (!imageFile) return;

    setIsSubmitting(true);

    try {
      const upload = await initAdminPortfolioImageUpload(imageFile);
      await uploadAdminPortfolioImage(imageFile, upload.uploadUrl);

      const created = await createAdminPortfolioProject({
        title: form.title,
        platforms: form.platforms,
        categories: form.categories,
        image: {
          path: upload.path,
          originalName: upload.originalName,
          mimeType: upload.mimeType,
          sizeBytes: upload.sizeBytes,
        },
      });

      setItems((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
      setForm(INITIAL_PORTFOLIO_CREATE_FORM_STATE);
      setFormResetKey(String(Date.now()));
      setToast({
        id: Date.now(),
        tone: 'success',
        message: `${created.title} preview card created.`,
      });
      window.dispatchEvent(new CustomEvent('admin-dashboard-refresh'));
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? mapPortfolioCreateError(error.message)
          : 'Failed to create portfolio preview card.';
      setToast({
        id: Date.now(),
        tone: 'error',
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(projectId: string) {
    const current = items.find((item) => item.id === projectId);
    if (!current) return;

    const isConfirmed = window.confirm(
      `Delete "${current.title}" from dynamic portfolio preview cards?`,
    );

    if (!isConfirmed) return;

    setDeletingId(projectId);

    try {
      await deleteAdminPortfolioProject(projectId);
      setItems((prev) => prev.filter((item) => item.id !== projectId));
      setToast({
        id: Date.now(),
        tone: 'success',
        message: `${current.title} preview card deleted.`,
      });
      window.dispatchEvent(new CustomEvent('admin-dashboard-refresh'));
    } catch (error: unknown) {
      setToast({
        id: Date.now(),
        tone: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to delete portfolio preview card.',
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      <PortfolioCreateForm
        value={form}
        errors={formErrors}
        disabled={isSubmitting}
        resetKey={formResetKey}
        onChange={updateForm}
        onSubmit={handleCreate}
      />

      {state === 'loading' ? (
        <PortfolioStatusCard
          className={DEFAULT_CARD_CLASS_NAME}
          message="Loading portfolio preview cards..."
        />
      ) : null}

      {state === 'error' ? (
        <PortfolioStatusCard
          className={ERROR_CARD_CLASS_NAME}
          message="Unable to load portfolio preview cards."
          tone="error"
        />
      ) : null}

      {state === 'ready' && items.length > 0 ? (
        <PortfolioCardsSection items={items} deletingId={deletingId} onDelete={handleDelete} />
      ) : null}
    </section>
  );
}

function mapPortfolioCreateError(message: string): string {
  if (message.includes('Unsupported image MIME type')) {
    return 'Image field: unsupported file format. Upload JPEG, PNG, WebP, GIF, AVIF, BMP, TIFF, HEIC, or HEIF.';
  }

  if (
    message.includes('Image exceeds allowed size') ||
    message.includes('Attachment exceeds allowed size')
  ) {
    return 'Image field: file is too large. Maximum allowed size is 5 MB.';
  }

  if (message.includes('Image filename is suspicious')) {
    return 'Image field: file name contains an unsupported or suspicious extension.';
  }

  if (message.includes('Uploaded portfolio image MIME type mismatch')) {
    return 'Image field: uploaded file type does not match the selected image. Please re-select the file and try again.';
  }

  if (message.includes('Uploaded portfolio image size mismatch')) {
    return 'Image field: uploaded file size does not match the selected image. Please upload the file again.';
  }

  if (message.includes('Uploaded portfolio image was not found')) {
    return 'Image field: upload was not completed. Please select the image again and retry.';
  }

  if (message.includes('Validation failed at \"title\"')) {
    return 'Project title field: enter a valid title.';
  }

  if (message.includes('Validation failed at \"platforms\"')) {
    return 'Platforms field: select at least one valid platform.';
  }

  if (message.includes('Validation failed at \"categories\"')) {
    return 'Categories field: select at least one valid category.';
  }

  if (message.includes('Validation failed at \"image\"')) {
    return 'Image field: uploaded image metadata is invalid. Please upload the image again.';
  }

  return message;
}
