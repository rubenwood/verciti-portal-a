"use client"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { ModelPreview} from "./model-preview-component"

export type ModelEntry = {
  path: string
  url: string
}

export function ModelList({ onSelect }: { onSelect: (modelEntry: ModelEntry) => void }) {
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
      <button onClick={() => setIsOpen(!isOpen)} className="menu-toggle-button">
        {isOpen ? <X size={26} /> : <Menu size={28} />}        
      </button>

      {isOpen && (
        <div>
        <p>Select a model</p>
        <div className="model-list">
          {models.map((model) => (
            <button
              className="model-button"
              key={model.url}
              onClick={() => onSelect(model)}
            >
              <ModelPreview model={model} />
              <p className="text-xs mt-2 px-2 text-center break-words whitespace-normal">
                {model.path}
              </p>
            </button>
          ))}
        </div>
        </div>
      )}
    </div>
  )
}
