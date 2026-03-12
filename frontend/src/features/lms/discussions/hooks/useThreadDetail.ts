import { useState } from 'react'
import { useGetDiscussionThread, useCreatePost, useUpdatePost, useDeletePost, useMarkAsAnswer, useLikePost } from './index'

export function useThreadDetail(threadId: string) {
  const [replyContent, setReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined)
  const [editingPostId, setEditingPostId] = useState<string | undefined>(undefined)

  const { data, isLoading, error, refetch } = useGetDiscussionThread(threadId)

  const createPostMutation = useCreatePost(threadId)
  const updatePostMutation = useUpdatePost(threadId)
  const deletePostMutation = useDeletePost(threadId)
  const markAnswerMutation = useMarkAsAnswer(threadId)
  const likeMutation = useLikePost(threadId)

  const thread = data?.data?.thread ?? null
  const posts = data?.data?.posts ?? []

  // Separate root posts from nested replies
  const rootPosts = posts.filter((p) => !p.parentId)

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return
    await createPostMutation.mutateAsync({
      content: replyContent.trim(),
      parentId: replyingTo,
    })
    setReplyContent('')
    setReplyingTo(undefined)
  }

  const handleCancelReply = () => {
    setReplyContent('')
    setReplyingTo(undefined)
    setEditingPostId(undefined)
  }

  return {
    thread,
    posts: rootPosts,
    allPosts: posts,
    isLoading,
    error,
    refetch,
    // reply state
    replyContent, setReplyContent,
    replyingTo, setReplyingTo,
    editingPostId, setEditingPostId,
    // actions
    submitReply: handleSubmitReply,
    cancelReply: handleCancelReply,
    updatePost: updatePostMutation.mutateAsync,
    deletePost: deletePostMutation.mutateAsync,
    markAsAnswer: markAnswerMutation.mutateAsync,
    likePost: likeMutation.mutateAsync,
    // pending states
    isSubmitting: createPostMutation.isPending,
    isUpdatingPost: updatePostMutation.isPending,
    isDeletingPost: deletePostMutation.isPending,
  }
}
