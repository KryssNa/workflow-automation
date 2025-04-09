import type { DecisionNode as DecisionNodeType } from "../../types"
import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const DecisionNode = memo(({ data, isConnectable }: NodeProps<DecisionNodeType>) => {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-yellow-500" />
      <Card className="w-64 bg-yellow-900/50 border-yellow-500/30 rotate-45">
        <CardHeader className="p-3">
          <CardTitle className="text-white text-sm -rotate-45">{data.question}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="-rotate-45">
            {data.conditions.map((condition, index) => (
              <div key={index} className="text-xs text-gray-300 mt-1">
                <span className="font-medium text-yellow-500">{condition.value}:</span>{" "}
                {condition.targetId || "Not connected"}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {data.conditions.map((condition, index) => (
        <Handle
          key={index}
          id={`condition-${index}`}
          type="source"
          position={index === 0 ? Position.Left : Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-yellow-500"
          style={{ top: "50%" }}
        />
      ))}
    </div>
  )
})

DecisionNode.displayName = "DecisionNode"
