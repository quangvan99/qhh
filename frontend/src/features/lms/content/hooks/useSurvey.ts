import { useCreateSurvey } from "../api/content.api"

export function useSurvey(classId: string, groupId: string) {
  const createMutation = useCreateSurvey(classId, groupId)

  return {
    createSurvey: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  }
}
