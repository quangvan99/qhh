import { useGetFileItems, useCreateFile, useDeleteFile } from "../api/content.api"

export function useFile(classId: string, groupId: string) {
  const { data: items = [], isLoading, error } = useGetFileItems(classId, groupId)
  const createMutation = useCreateFile(classId, groupId)
  const deleteMutation = useDeleteFile(classId, groupId)

  return {
    items,
    isLoading,
    error,
    createFile: createMutation.mutateAsync,
    deleteFile: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
