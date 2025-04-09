"use client"

import { Button } from "../ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

interface EdgeContextMenuProps {
  edgeId: string
  position: { x: number; y: number }
  onDelete: (edgeId: string) => void
  onClose: () => void
}

export function EdgeContextMenu({ edgeId, position, onDelete, onClose }: EdgeContextMenuProps) {
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
      <div className="text-xs text-gray-400 mb-2 px-2">Edge: {edgeId}</div>
      <div className="flex flex-col gap-1">
        <Button size="sm" variant="ghost" className="justify-start text-white hover:bg-primary/20 px-2 py-1 h-auto">
          <Edit className="h-4 w-4 mr-2" /> Add Label
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="justify-start text-white hover:bg-destructive/20 px-2 py-1 h-auto"
          onClick={() => {
            onDelete(edgeId)
            onClose()
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  )
}
