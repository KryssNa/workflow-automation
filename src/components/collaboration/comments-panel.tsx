"use client"

import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useWorkflowStore } from "../../store/workflow-store"
import type { WorkflowSubmission } from "../../types"
import { AnimatePresence, motion } from "framer-motion"
import { MessageSquare, Reply, Send, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface CommentsPanelProps {
  submission: WorkflowSubmission
}

export function CommentsPanel({ submission }: CommentsPanelProps) {
  const { addComment, currentUser } = useWorkflowStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const comments = submission.comments || []

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (isExpanded && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [comments.length, isExpanded])

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    addComment({
      text: newComment,
      replyTo: replyTo ?? undefined,
      stepId: undefined, // Could be set to a specific step ID if needed
    })

    setNewComment("")
    setReplyTo(null)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-10">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-secondary/90 border-primary/30 w-80 max-h-[500px] flex flex-col">
              <CardHeader className="p-3 flex flex-row items-center justify-between">
                <CardTitle className="text-white text-sm flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comments
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  onClick={() => setIsExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No comments yet</p>
                      <p className="text-xs">Be the first to comment on this workflow</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            style={{ backgroundColor: comment.user.color }}
                            className="text-xs text-white"
                          >
                            {comment.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-black/30 rounded-md p-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-sm font-medium text-white">{comment.user.name}</span>
                                {comment.replyTo && (
                                  <span className="text-xs text-gray-400 ml-2">
                                    replying to{" "}
                                    {comments.find((c) => c.id === comment.replyTo)?.user.name || "deleted comment"}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{formatDate(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-white mt-1">{comment.text}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-gray-400 hover:text-white mt-1 h-auto p-0"
                            onClick={() => setReplyTo(comment.id)}
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </CardContent>
              <div className="p-3 border-t border-primary/20">
                {replyTo && (
                  <div className="bg-black/30 rounded-md p-2 mb-2 flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      Replying to{" "}
                      <span className="text-white">
                        {comments.find((c) => c.id === replyTo)?.user.name || "comment"}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                      onClick={() => setReplyTo(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[60px] bg-black/30 border-primary/30 text-white resize-none"
                  />
                  <Button
                    className="bg-primary text-white hover:bg-primary/90 self-end"
                    size="icon"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="ml-16" // Add some margin to separate from collaborators button
          >
            <Button
              className="rounded-full bg-primary text-white hover:bg-primary/90 h-12 w-12 p-0 relative"
              onClick={() => setIsExpanded(true)}
            >
              <MessageSquare className="h-5 w-5" />
              {comments.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {comments.length}
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
