import { useGetVideoItems, useCreateVideo, useDeleteVideo } from "../api/content.api"

export function useVideo(classId: string, groupId: string) {
  const { data: items = [], isLoading, error } = useGetVideoItems(classId, groupId)
  const createMutation = useCreateVideo(classId, groupId)
  const deleteMutation = useDeleteVideo(classId, groupId)

  return {
    items,
    isLoading,
    error,
    createVideo: createMutation.mutateAsync,
    deleteVideo: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
