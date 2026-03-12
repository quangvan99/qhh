import { useGetScormItems, useCreateScorm, useUpdateScorm, useDeleteScorm } from "../api/content.api"

export function useScorm(classId: string, groupId: string) {
  const { data: items = [], isLoading, error } = useGetScormItems(classId, groupId)
  const createMutation = useCreateScorm(classId, groupId)
  const updateMutation = useUpdateScorm(classId, groupId)
  const deleteMutation = useDeleteScorm(classId, groupId)

  return {
    items,
    isLoading,
    error,
    createScorm: createMutation.mutateAsync,
    updateScorm: updateMutation.mutateAsync,
    deleteScorm: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
