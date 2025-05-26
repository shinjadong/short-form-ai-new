"use client"

import { Button } from "@/components/ui/button"

interface TextStyleSelectorProps {
  value: "default" | "highlight" | "shadow" | "outline"
  onChange: (value: "default" | "highlight" | "shadow" | "outline") => void
}

export function TextStyleSelector({ value, onChange }: TextStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant={value === "default" ? "default" : "outline"}
        className="justify-start font-normal"
        onClick={() => onChange("default")}
      >
        <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">기본</span>
      </Button>
      <Button
        variant={value === "highlight" ? "default" : "outline"}
        className="justify-start font-normal"
        onClick={() => onChange("highlight")}
      >
        <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold">강조</span>
      </Button>
      <Button
        variant={value === "shadow" ? "default" : "outline"}
        className="justify-start font-normal"
        onClick={() => onChange("shadow")}
      >
        <span className="px-2 py-1 text-white text-xs rounded drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">그림자</span>
      </Button>
      <Button
        variant={value === "outline" ? "default" : "outline"}
        className="justify-start font-normal"
        onClick={() => onChange("outline")}
      >
        <span className="px-2 py-1 text-white text-xs rounded border border-white">외곽선</span>
      </Button>
    </div>
  )
}
