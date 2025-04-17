"use client"

import { useState, useRef, useEffect } from "react"
import PlantUMLViewer from "./uml-viewer"
import CodeMirror from "@uiw/react-codemirror"

interface CodePreviewProps {
  code: string
  setCode: (code: string) => void
}

export default function CodePreviewComponent({ code, setCode }: CodePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"preview" | "code">("code")
  const [theme, setTheme] = useState("No theme")
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themes = [
    "No theme",
    "nul",
    "amiga",
    "aws-orange",
    "black-knight",
    "bluegray",
    "blueprint",
    "cerulean-outline",
    "cerulean",
    "crt-amber",
    "crt-green",
    "cyborg-outline",
    "cyborg",
    "hacker",
    "lightgray",
    "mars",
    "materia-outline",
    "materia",
    "metal",
    "mimeograph",
    "minty",
    "plain",
    "reddress-darkblue",
    "reddress-darkgreen",
    "reddress-darkorange",
    "reddress-darkred",
    "reddress-lightblue",
    "reddress-lightgreen",
    "reddress-lightorange",
    "reddress-lightred",
    "sandstone",
    "silver",
    "sketchy-outline",
    "sketchy",
    "spacelab",
    "spacelab-white",
    "superhero-outline",
    "superhero",
    "toy",
    "united",
    "vibrant",
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme)
    setIsOpen(false)
  
    const themeRegex = /^!theme .+$/m
    const skinparamRegex = /^skinparam style .+$/m
  
    let newCode = code
  
    if (selectedTheme === "No theme") {
      newCode = newCode
        .replace(themeRegex, "")
        .replace(skinparamRegex, "")
        .replace(/\n{2,}/g, "\n")
        .trim()
      setCode(newCode)
      return
    }
  
    const themeLine = `!theme ${selectedTheme}`
  
    if (themeRegex.test(code)) {
      newCode = code.replace(themeRegex, themeLine)
    } else if (skinparamRegex.test(code)) {
      newCode = code.replace(skinparamRegex, themeLine)
    } else if (code.includes("@startuml")) {
      newCode = code.replace(/@startuml/, `@startuml\n${themeLine}`)
    } else {
      newCode = `${themeLine}\n${code}`
    }
  
    setCode(newCode)
  }
  
  

  return (
    <div className="flex max-h-[calc(100vh-60px)] flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("code")}
            className={`rounded-md px-3 py-1 text-sm flex items-center ${
              viewMode === "code" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Code
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`rounded-md px-3 py-1 text-sm ${
              viewMode === "preview" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Theme:</span>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition-colors w-[120px]"
            >
              <span className="truncate">{theme}</span>
              <svg
                className={`h-4 w-4 fill-current ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {themes.map((t, index) => (
                  <button
                    key={index}
                    className={`px-3 w-full py-1 text-sm cursor-pointer hover:bg-gray-200 ${theme === t ? "bg-gray-100" : ""}`}
                    onClick={() => handleThemeSelect(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className={`${viewMode === "code" ? "block" : "hidden"} relative`}>
          <pre className="h-full bg-gray-900 p-4 text-sm text-gray-100">
            <CodeMirror value={code} onChange={(value) => setCode(value)} theme="dark" />
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded-md bg-gray-700 p-2 text-white hover:bg-gray-600"
            title="Copy code"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
        <div className={`${viewMode !== "code" ? "block" : "hidden"} p-4`}>
          <div className="rounded-md border border-gray-200 p-3">
            <PlantUMLViewer uml={code} key={code} />
          </div>
        </div>
      </div>
    </div>
  )
}
