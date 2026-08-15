"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  deleteAttachmentRequest,
  getAttachmentFileRequest,
  listJobAttachmentsRequest,
  readCoverLetterRequest,
  saveCoverLetterRequest,
  uploadJobAttachmentRequest,
} from "@/lib/jobs-api";
import { formatTemplate } from "@/lib/i18n";
import { formatFileSize } from "@/lib/format";
import { MAX_ATTACHMENT_BYTES } from "@/lib/site-config";
import { toUserFacingError } from "@/lib/user-facing-errors";
import { ValidationError } from "@/lib/validate";
import type { AttachmentKind, JobAttachmentMeta } from "@/types/attachment";

export function useJobAttachments(jobId: string | null) {
  const { t } = useLocale();
  const [items, setItems] = useState<JobAttachmentMeta[]>([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!jobId) {
      setItems([]);
      setCoverLetter("");
      return;
    }
    setLoading(true);
    try {
      const [attachments, draft] = await Promise.all([
        listJobAttachmentsRequest(jobId),
        readCoverLetterRequest(jobId),
      ]);
      setItems(attachments.filter((item) => item.kind !== "cover_letter"));
      setCoverLetter(draft);
      setError(null);
    } catch (loadError) {
      setError(toUserFacingError(loadError, t, t.errors.attachmentFailed));
    } finally {
      setLoading(false);
    }
  }, [jobId, t]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate attachments after mount */
    void refresh();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [refresh]);

  const upload = useCallback(
    async (file: File, kind: AttachmentKind) => {
      if (!jobId) return;
      setSaving(true);
      setError(null);
      try {
        await uploadJobAttachmentRequest(jobId, file, kind);
        await refresh();
      } catch (uploadError) {
        if (
          uploadError instanceof ValidationError &&
          uploadError.code === "too_large"
        ) {
          setError(
            formatTemplate(t.attachments.tooLarge, {
              size: formatFileSize(MAX_ATTACHMENT_BYTES),
            }),
          );
          return;
        }
        if (
          uploadError instanceof ValidationError &&
          uploadError.code === "invalid_schema"
        ) {
          setError(t.attachments.unsupportedType);
          return;
        }
        setError(toUserFacingError(uploadError, t, t.errors.attachmentFailed));
      } finally {
        setSaving(false);
      }
    },
    [jobId, refresh, t],
  );

  const saveCoverLetter = useCallback(
    async (text: string) => {
      if (!jobId) return;
      setSaving(true);
      setError(null);
      try {
        await saveCoverLetterRequest(jobId, text);
        setCoverLetter(text);
      } catch (saveError) {
        setError(toUserFacingError(saveError, t, t.errors.attachmentFailed));
      } finally {
        setSaving(false);
      }
    },
    [jobId, t],
  );

  const remove = useCallback(
    async (id: string) => {
      setSaving(true);
      setError(null);
      try {
        await deleteAttachmentRequest(id);
        await refresh();
      } catch (deleteError) {
        setError(toUserFacingError(deleteError, t, t.errors.attachmentFailed));
      } finally {
        setSaving(false);
      }
    },
    [refresh, t],
  );

  const download = useCallback(async (id: string) => {
    const record = await getAttachmentFileRequest(id);
    if (!record) return;
    const url = URL.createObjectURL(record.payload);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = record.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    items,
    coverLetter,
    loading,
    saving,
    error,
    upload,
    saveCoverLetter,
    remove,
    download,
    clearError: () => setError(null),
  };
}
