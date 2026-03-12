import { useCreateText, useUpdateText } from "../api/content.api"

export function useText(classId: string, groupId: string) {
  const createMutation = useCreateText(classId, groupId)
  const updateMutation = useUpdateText(classId, groupId)

  return {
    createText: createMutation.mutateAsync,
    updateText: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  }
}
