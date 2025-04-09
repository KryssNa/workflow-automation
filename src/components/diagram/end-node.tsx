import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"

export const EndNode = memo(({ isConnectable }: NodeProps) => {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-red-500" />
      <div className="w-16 h-16 rounded-full bg-red-600/80 border-2 border-red-500 flex items-center justify-center text-white font-medium">
        End
      </div>
    </div>
  )
})

EndNode.displayName = "EndNode"
