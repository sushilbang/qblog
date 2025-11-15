'use client'

import { useState } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Bold, Italic, Heading2, List, Code, Quote, Save, X } from 'lucide-react'

interface BlogEditorProps {
  title: string
  content: string
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  saveMessage?: { type: 'success' | 'error'; text: string } | null
}

export function BlogEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
  isSaving,
  saveMessage,
}: BlogEditorProps) {
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end)

    onContentChange(newContent)

    // Restore cursor position after state update
    setTimeout(() => {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
      textarea.focus()
    }, 0)
  }

  const markdownButtons = [
    {
      icon: Bold,
      tooltip: 'Bold',
      onClick: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      tooltip: 'Italic',
      onClick: () => insertMarkdown('*', '*'),
    },
    {
      icon: Heading2,
      tooltip: 'Heading',
      onClick: () => insertMarkdown('## '),
    },
    {
      icon: List,
      tooltip: 'List',
      onClick: () => insertMarkdown('- '),
    },
    {
      icon: Code,
      tooltip: 'Code Block',
      onClick: () => insertMarkdown('```\n', '\n```'),
    },
    {
      icon: Quote,
      tooltip: 'Quote',
      onClick: () => insertMarkdown('> '),
    },
  ]

  const wordCount = content.trim().split(/\s+/).length
  const charCount = content.length

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-1)' }}>
      {/* Title Bar */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-4 border-b"
        style={{ borderBottomColor: 'var(--border-1)' }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Blog title..."
          className="w-full text-2xl font-bold px-3 py-2 rounded-lg border-2 border-[var(--border-1)] bg-[var(--bg-1)] text-[var(--fg-1)] placeholder-[var(--fg-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
        />
      </div>

      {/* Editor & Preview Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-r" style={{ borderRightColor: 'var(--border-1)' }}>
          {/* Toolbar */}
          <div
            className="px-4 py-2 border-b flex items-center gap-1 flex-wrap"
            style={{ borderBottomColor: 'var(--border-1)' }}
          >
            {markdownButtons.map((btn) => {
              const Icon = btn.icon
              return (
                <button
                  key={btn.tooltip}
                  onClick={btn.onClick}
                  className="p-1.5 rounded hover:opacity-70 transition-opacity"
                  style={{
                    backgroundColor: 'var(--bg-2)',
                    color: 'var(--fg-1)',
                  }}
                  title={btn.tooltip}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>

          {/* Textarea */}
          <textarea
            id="content-textarea"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your blog content in Markdown..."
            className="flex-1 px-4 py-3 bg-[var(--bg-1)] text-[var(--fg-1)] font-mono text-sm focus:outline-none resize-none"
          />

          {/* Stats */}
          <div
            className="px-4 py-2 border-t text-xs flex gap-4"
            style={{ borderTopColor: 'var(--border-1)', color: 'var(--fg-2)' }}
          >
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview Header */}
          <div
            className="px-4 py-2 border-b"
            style={{ borderBottomColor: 'var(--border-1)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--fg-2)' }}>
              PREVIEW
            </span>
          </div>

          {/* Preview Content */}
          <div
            className="flex-1 overflow-y-auto px-6 py-4"
            style={{ backgroundColor: 'var(--bg-2)' }}
          >
            {content.trim() ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p style={{ color: 'var(--fg-2)' }}>
                Start typing to see preview...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className="px-4 py-3 border-t flex items-center justify-between"
        style={{ borderTopColor: 'var(--border-1)' }}
      >
        {/* Save Message */}
        {saveMessage && (
          <div
            className={`text-xs font-medium ${
              saveMessage.type === 'success'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {saveMessage.text}
          </div>
        )}
        {!saveMessage && <div />}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-medium border transition-colors disabled:opacity-50"
            style={{
              borderColor: 'var(--border-1)',
              color: 'var(--fg-1)',
              backgroundColor: 'var(--bg-2)',
            }}
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-white transition-opacity"
            style={{
              backgroundColor: 'var(--accent)',
              opacity: isSaving ? 0.6 : 1,
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
