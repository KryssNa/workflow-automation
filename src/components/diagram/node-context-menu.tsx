"use client"

import { Button } from "../ui/button"
import { Copy, Edit, Link, Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

interface NodeContextMenuProps {
  nodeId: string
  position: { x: number; y: number }
  onDelete: (nodeId: string) => void
  onClose: () => void
}

export function NodeContextMenu({ nodeId, position, onDelete, onClose }: NodeContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute z-10 bg-secondary/90 border border-primary/30 rounded-md shadow-lg p-2 min-w-[150px]"
      style={{ top: position.y, left: position.x }}
    >
      <div className="text-xs text-gray-400 mb-2 px-2">Node: {nodeId}</div>
      <div className="flex flex-col gap-1">
        <Button size="sm" variant="ghost" className="justify-start text-white hover:bg-primary/20 px-2 py-1 h-auto">
          <Edit className="h-4 w-4 mr-2" /> Edit Node
        </Button>
        <Button size="sm" variant="ghost" className="justify-start text-white hover:bg-primary/20 px-2 py-1 h-auto">
          <Copy className="h-4 w-4 mr-2" /> Duplicate
        </Button>
        <Button size="sm" variant="ghost" className="justify-start text-white hover:bg-primary/20 px-2 py-1 h-auto">
          <Link className="h-4 w-4 mr-2" /> Add Connection
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="justify-start text-white hover:bg-destructive/20 px-2 py-1 h-auto"
          onClick={() => {
            onDelete(nodeId)
            onClose()
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  )
}
