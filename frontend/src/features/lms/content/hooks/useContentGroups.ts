import { useGetContentGroups, useCreateGroup, useUpdateGroup, useDeleteGroup, useReorderGroups } from "../api/content.api"
import type { ContentGroup } from "../types/content.types"

export function useContentGroups(classId: string) {
  const { data: groups = [], isLoading, error } = useGetContentGroups(classId)
  const createMutation = useCreateGroup(classId)
  const updateMutation = useUpdateGroup(classId)
  const deleteMutation = useDeleteGroup(classId)
  const reorderMutation = useReorderGroups(classId)

  return {
    groups,
    isLoading,
    error,
    createGroup: createMutation.mutateAsync,
    updateGroup: updateMutation.mutateAsync,
    deleteGroup: deleteMutation.mutateAsync,
    reorderGroups: reorderMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
