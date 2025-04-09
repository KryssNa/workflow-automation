import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const StartNode = memo(({ isConnectable }: NodeProps) => {
  return (
    <div className="relative">
      <div className="w-16 h-16 rounded-full bg-green-600/80 border-2 border-green-500 flex items-center justify-center text-white font-medium">
        Start
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
    </div>
  )
})

StartNode.displayName = "StartNode"
