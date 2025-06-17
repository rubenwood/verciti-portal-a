"use client"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"

type ModelEntry = {
  path: string
  url: string
}

export function ModelList({ onSelect }: { onSelect: (url: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [models, setModels] = useState<ModelEntry[]>([])

  useEffect(() => {
    const fetchModels = async () => {
      const res = await fetch('/api/aws/list-model-files')
      const data = await res.json()
      setModels(data)
    }
    fetchModels()
  }, [])

  return (
    <div className="model-list-container">
      {/* Menu icon */}
      <button onClick={() => setIsOpen(!isOpen)} className="menu-toggle-button">
        <Menu size={28} />
      </button>

      {/* Model buttons shown when menu is open */}
      {isOpen && (
        <div className="model-list">
          {models.map((model) => (
            <button
              className="button"
              key={model.url}
              onClick={() => onSelect(model.url)}
            >
              {model.path}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
