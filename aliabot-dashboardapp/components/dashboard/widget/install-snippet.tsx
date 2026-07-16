"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function InstallSnippet({ agentId }: { agentId: string }) {
  const [copied, setCopied] = useState(false)
  const snippet = `<script src="https://app.aliabot.co/widget/loader.js" data-agent-id="${agentId}" async></script>`

  function handleCopy() {
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card-surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#11143A]">Instalar en tu sitio</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-[#E2E5F0] bg-white px-2.5 py-1 text-xs text-[#4A5080] transition-colors hover:bg-[#F1F3FC]"
        >
          {copied ? <Check className="size-3.5 text-[#22C55E]" /> : <Copy className="size-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="mt-1 text-xs text-[#4A5080]">
        Pega este código antes de {"</body>"} en tu sitio web.
      </p>
      <pre className="scroll-slim mt-3 overflow-x-auto rounded-lg bg-[#11143A] px-4 py-3 text-xs text-[#E0EAFF]">
        <code>{snippet}</code>
      </pre>
    </div>
  )
}
