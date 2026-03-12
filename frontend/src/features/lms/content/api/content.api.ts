import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api"
import type {
  ContentGroup, ScormItem, VideoItem, TextItem, FileItem, SurveyItem,
  OfflineSessionItem, ScormLibraryItem, SurveyReport,
} from "../types/content.types"
import type { PaginatedResponse } from "@/features/lms/classes/types/class.types"

const CONTENT_KEY = (classId: string) => ["lms", "classes", classId, "content"]

// Content Groups
export function useGetContentGroups(classId: string) {
  return useQuery({
    queryKey: CONTENT_KEY(classId),
    queryFn: () => apiFetch<ContentGroup[]>(`/api/lms/classes/${classId}/content-groups`),
    enabled: !!classId,
  })
}

export function useCreateGroup(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description?: string; visible: boolean }) =>
      apiFetch<ContentGroup>(`/api/lms/classes/${classId}/content-groups`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useUpdateGroup(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ groupId, ...data }: { groupId: string; name: string; description?: string; visible: boolean }) =>
      apiFetch<ContentGroup>(`/api/lms/classes/${classId}/content-groups/${groupId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useDeleteGroup(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (groupId: string) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useReorderGroups(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (groupIds: string[]) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/reorder`, { method: "PUT", body: JSON.stringify({ groupIds }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

export function useCopyContentFromClass(classId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sourceClassId, groupIds }: { sourceClassId: string; groupIds: string[] }) =>
      apiFetch<void>(`/api/lms/classes/${classId}/content-groups/copy-from/${sourceClassId}`, { method: "POST", body: JSON.stringify({ groupIds }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) }) },
  })
}

// SCORM
const SCORM_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "scorm"]

export function useGetScormItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: SCORM_KEY(classId, groupId),
    queryFn: () => apiFetch<ScormItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm`),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateScorm(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      apiFetch<ScormItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm`, { method: "POST", body: data, headers: {} }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCORM_KEY(classId, groupId) })
      qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) })
    },
  })
}

export function useUpdateScorm(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; description?: string; completionType: string; minScore?: number; maxAttempts?: number }) =>
      apiFetch<ScormItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm/${itemId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SCORM_KEY(classId, groupId) }) },
  })
}

export function useDeleteScorm(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/scorm/${itemId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SCORM_KEY(classId, groupId) })
      qc.invalidateQueries({ queryKey: CONTENT_KEY(classId) })
    },
  })
}

export function useGetScormLibrary(search?: string) {
  return useQuery({
    queryKey: ["scorm-library", search],
    queryFn: () => apiFetch<PaginatedResponse<ScormLibraryItem>>(`/api/scorm-library${search ? `?q=${encodeURIComponent(search)}` : ""}`),
  })
}

// Video
const VIDEO_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "video"]

export function useGetVideoItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: VIDEO_KEY(classId, groupId),
    queryFn: () => apiFetch<VideoItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/video`),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateVideo(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      apiFetch<VideoItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/video`, { method: "POST", body: data, headers: {} }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: VIDEO_KEY(classId, groupId) }) },
  })
}

export function useUpdateVideo(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; url?: string; description?: string }) =>
      apiFetch<VideoItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/video/${itemId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: VIDEO_KEY(classId, groupId) }) },
  })
}

export function useDeleteVideo(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/video/${itemId}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: VIDEO_KEY(classId, groupId) }) },
  })
}

// Text
const TEXT_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "text"]

export function useGetTextItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: TEXT_KEY(classId, groupId),
    queryFn: () => apiFetch<TextItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/text`),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateText(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      apiFetch<TextItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/text`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: TEXT_KEY(classId, groupId) }) },
  })
}

export function useUpdateText(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; content: string }) =>
      apiFetch<TextItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/text/${itemId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: TEXT_KEY(classId, groupId) }) },
  })
}

export function useDeleteText(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/text/${itemId}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: TEXT_KEY(classId, groupId) }) },
  })
}

// File
const FILE_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "file"]

export function useGetFileItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: FILE_KEY(classId, groupId),
    queryFn: () => apiFetch<FileItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/file`),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateFile(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      apiFetch<FileItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/file`, { method: "POST", body: data, headers: {} }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FILE_KEY(classId, groupId) }) },
  })
}

export function useUpdateFile(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; description?: string }) =>
      apiFetch<FileItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/file/${itemId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FILE_KEY(classId, groupId) }) },
  })
}

export function useDeleteFile(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/file/${itemId}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FILE_KEY(classId, groupId) }) },
  })
}

// Survey
const SURVEY_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "survey"]

export function useGetSurveyItems(classId: string, groupId: string) {
  return useQuery({
    queryKey: SURVEY_KEY(classId, groupId),
    queryFn: () => apiFetch<SurveyItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey`),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateSurvey(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SurveyItem>) =>
      apiFetch<SurveyItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SURVEY_KEY(classId, groupId) }) },
  })
}

export function useUpdateSurvey(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string } & Partial<SurveyItem>) =>
      apiFetch<SurveyItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey/${itemId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SURVEY_KEY(classId, groupId) }) },
  })
}

export function useDeleteSurvey(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/survey/${itemId}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: SURVEY_KEY(classId, groupId) }) },
  })
}

export function useGetSurveyReport(surveyId: string) {
  return useQuery({
    queryKey: ["survey", surveyId, "report"],
    queryFn: () => apiFetch<SurveyReport>(`/api/lms/surveys/${surveyId}/report`),
    enabled: !!surveyId,
  })
}

// Offline Sessions
const OFFLINE_KEY = (classId: string, groupId: string) => [...CONTENT_KEY(classId), groupId, "offline"]

export function useGetOfflineSessions(classId: string, groupId: string) {
  return useQuery({
    queryKey: OFFLINE_KEY(classId, groupId),
    queryFn: () => apiFetch<OfflineSessionItem[]>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline`),
    enabled: !!classId && !!groupId,
  })
}

export function useCreateOffline(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) =>
      apiFetch<OfflineSessionItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline`, { method: "POST", body: data, headers: {} }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: OFFLINE_KEY(classId, groupId) }) },
  })
}

export function useUpdateOffline(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, ...data }: { itemId: string; title: string; date: string; startTime: string; endTime?: string; location?: string; description?: string }) =>
      apiFetch<OfflineSessionItem>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline/${itemId}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: OFFLINE_KEY(classId, groupId) }) },
  })
}

export function useDeleteOffline(classId: string, groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => apiFetch<void>(`/api/lms/classes/${classId}/content-groups/${groupId}/offline/${itemId}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: OFFLINE_KEY(classId, groupId) }) },
  })
}
