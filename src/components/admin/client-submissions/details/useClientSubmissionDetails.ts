'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  ClientSubmissionCommentDto,
  ClientSubmissionStatus,
} from '@/server/forms/client-project/clientProject.types';
import type { AdminToastState, AdminToastTone } from '@/components/admin/ui/AdminToast';
import {
  addClientSubmissionComment,
  fetchClientSubmissionDetails,
  updateClientSubmissionStatus,
} from '@/components/admin/client-submissions/shared/clientSubmissions.api';
import { notifyClientSubmissionsOverviewRefresh } from '@/components/admin/client-submissions/useClientSubmissionsOverview';
import { getAllowedStatusOptions } from '@/components/admin/client-submissions/shared/clientSubmissions.constants';
import type {
  ClientSubmissionDetailsItemDto,
  LoadState,
} from '@/components/admin/client-submissions/shared/clientSubmissions.types';

export function useClientSubmissionDetails(submissionId: string) {
  const [state, setState] = useState<LoadState>('loading');
  const [details, setDetails] = useState<ClientSubmissionDetailsItemDto | null>(null);
  const [isStatusSaving, setIsStatusSaving] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommentSaving, setIsCommentSaving] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [toast, setToast] = useState<AdminToastState>(null);

  const showToast = useCallback((tone: AdminToastTone, message: string) => {
    setToast({ id: Date.now(), tone, message });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');

    fetchClientSubmissionDetails(submissionId, controller.signal)
      .then((payload) => {
        setDetails(payload.item);
        setState('ready');
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setDetails(null);
          setState('error');
          showToast('error', error instanceof Error ? error.message : 'Unable to load details.');
        }
      });

    return () => controller.abort();
  }, [showToast, submissionId]);

  const title = useMemo(() => {
    if (!details) return 'Client submission';
    return `${details.firstName} ${details.lastName}`.trim() || 'Client submission';
  }, [details]);

  const onStatusChange = useCallback(
    async (nextStatus: ClientSubmissionStatus) => {
      if (!details) return;
      setIsStatusSaving(true);

      try {
        await updateClientSubmissionStatus({ submissionId: details.id, status: nextStatus });
        setDetails((prev) => (prev ? { ...prev, status: nextStatus } : prev));
        notifyClientSubmissionsOverviewRefresh();
        showToast('success', `Status updated to "${nextStatus}".`);
      } catch (error) {
        showToast('error', error instanceof Error ? error.message : 'Unable to update status.');
      } finally {
        setIsStatusSaving(false);
      }
    },
    [details, showToast],
  );

  const onAddComment = useCallback(async () => {
    if (!details) return;
    const normalized = commentText.trim();
    if (!normalized) return;

    setIsCommentSaving(true);
    setCommentError(null);

    try {
      const createdComment: ClientSubmissionCommentDto = await addClientSubmissionComment({
        submissionId: details.id,
        comment: normalized,
      });

      setDetails((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: [...(prev.comments ?? []), createdComment],
        };
      });
      setCommentText('');
      showToast('success', 'Comment saved.');
    } catch {
      setCommentError('Unable to save comment.');
      showToast('error', 'Unable to save comment. Please retry.');
    } finally {
      setIsCommentSaving(false);
    }
  }, [commentText, details, showToast]);

  return {
    state,
    details,
    title,
    isStatusSaving,
    commentText,
    setCommentText,
    isCommentSaving,
    commentError,
    toast,
    clearToast: () => setToast(null),
    onStatusChange,
    onAddComment,
    getAllowedStatusOptions,
  };
}
