import { useState } from "react"
import { useRouter } from "next/navigation"

export function RoomShareDialog(
  {
    isOpen,
    roomLink,
    onClose,
  }: {
    isOpen: boolean
    roomLink: string | null
    onClose: () => void
  }
) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const copyLink = () => {
    if (roomLink) {
      navigator.clipboard.writeText(roomLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const enterRoom = () => {
    if (roomLink) {
      router.push(roomLink)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-2)] rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Collaborative Room Ready</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--fg-2)' }}>
          Share this link with others to edit this blog together:
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            readOnly
            value={roomLink || ''}
            className="flex-1 px-3 py-2 rounded border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-3)',
              borderColor: 'var(--border-1)',
              color: 'var(--fg-1)'
            }}
          />
          <button
            onClick={copyLink}
            className="px-3 py-2 rounded bg-[var(--accent)] text-white hover:opacity-90 text-sm font-medium"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded bg-[var(--bg-3)] hover:bg-[var(--bg-4)] text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={enterRoom}
            className="flex-1 px-4 py-2 rounded bg-[var(--accent)] text-white hover:opacity-90 text-sm font-medium"
          >
            Enter Room
          </button>
        </div>
      </div>
    </div>
  )
}
