import type { WorkflowStep } from "@/types"
import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export const StepNode = memo(({ data, isConnectable }: NodeProps<WorkflowStep>) => {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />
      <Card className="w-64 bg-secondary/80 border-primary/30">
        <CardHeader className="p-3">
          <CardTitle className="text-white text-sm">{data.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-gray-300 text-xs">{data.description}</p>
          {data.timeEstimate && (
            <div className="mt-2 text-xs text-gray-400">
              <span className="font-medium">Time:</span> {data.timeEstimate} min
            </div>
          )}
          {data.tools && data.tools.length > 0 && (
            <div className="mt-1 text-xs text-primary">
              <span className="font-medium text-gray-400">Tools:</span> {data.tools.join(", ")}
            </div>
          )}
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />
    </div>
  )
})

StepNode.displayName = "StepNode"
