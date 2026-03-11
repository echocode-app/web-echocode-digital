'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SubmissionListStatus } from '@/server/submissions/submissions.types';
import type { AdminToastState, AdminToastTone } from '@/components/admin/ui/AdminToast';
import {
  addEchocodeAppSubmissionComment,
  fetchEchocodeAppSubmissionDetails,
  updateEchocodeAppSubmissionStatus,
} from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.api';
import { getAllowedStatusOptions } from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.constants';
import { notifyEchocodeAppSubmissionsOverviewRefresh } from '@/components/admin/echocode-app/useEchocodeAppSubmissionsOverview';
import type {
  EchocodeAppSubmissionDetailsItemDto,
  LoadState,
} from '@/components/admin/echocode-app/shared/echocodeAppSubmissions.types';

export function useEchocodeAppSubmissionDetails(submissionId: string) {
  const [state, setState] = useState<LoadState>('loading');
  const [details, setDetails] = useState<EchocodeAppSubmissionDetailsItemDto | null>(null);
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

    fetchEchocodeAppSubmissionDetails(submissionId, controller.signal)
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
    if (!details) return 'Echocode.app submission';
    return details.contact.name.trim() || 'Echocode.app submission';
  }, [details]);

  const onStatusChange = useCallback(
    async (nextStatus: SubmissionListStatus) => {
      if (!details) return;
      setIsStatusSaving(true);

      try {
        await updateEchocodeAppSubmissionStatus({
          submissionId: details.id,
          status: nextStatus,
        });
        setDetails((prev) => (prev ? { ...prev, status: nextStatus } : prev));
        notifyEchocodeAppSubmissionsOverviewRefresh();
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
      const createdComment = await addEchocodeAppSubmissionComment({
        submissionId: details.id,
        comment: normalized,
      });

      setDetails((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments ?? []), createdComment],
            }
          : prev,
      );
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
