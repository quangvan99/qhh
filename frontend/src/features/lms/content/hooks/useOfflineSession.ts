import { useGetOfflineSessions, useCreateOffline, useUpdateOffline, useDeleteOffline } from "../api/content.api"

export function useOfflineSession(classId: string, groupId: string) {
  const { data: items = [], isLoading, error } = useGetOfflineSessions(classId, groupId)
  const createMutation = useCreateOffline(classId, groupId)
  const updateMutation = useUpdateOffline(classId, groupId)
  const deleteMutation = useDeleteOffline(classId, groupId)

  return {
    items,
    isLoading,
    error,
    createSession: createMutation.mutateAsync,
    updateSession: updateMutation.mutateAsync,
    deleteSession: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
