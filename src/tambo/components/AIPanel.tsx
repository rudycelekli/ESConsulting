import React, { useState, useEffect, useRef } from 'react';
import { useTambo, useTamboThreadInput } from '@tambo-ai/react';
import '../styles/tambo.css';

/**
 * Lightweight markdown-to-React renderer.
 * Handles: **bold**, *italic*, `code`, [links](url), unordered lists, paragraphs.
 */
function renderMarkdown(text: string): React.ReactNode {
  // Split into paragraphs by double newline
  const paragraphs = text.split(/\n{2,}/);

  return paragraphs.map((para, pi) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Check if this paragraph is a list (lines starting with - or *)
    const lines = trimmed.split('\n');
    const isList = lines.every((l) => /^\s*[-*]\s/.test(l) || !l.trim());

    if (isList) {
      return (
        <ul key={pi} style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
          {lines
            .filter((l) => l.trim())
            .map((l, li) => (
              <li key={li}>{renderInlineMarkdown(l.replace(/^\s*[-*]\s+/, ''))}</li>
            ))}
        </ul>
      );
    }

    // Regular paragraph - render inline markdown
    return (
      <p key={pi} style={{ margin: '0.4em 0' }}>
        {renderInlineMarkdown(trimmed.replace(/\n/g, ' '))}
      </p>
    );
  });
}

/** Parse inline markdown: **bold**, *italic*, `code`, [link](url) */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Regex matches: **bold**, *italic*, `code`, [text](url)
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Push text before this match
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      tokens.push(<strong key={`b-${match.index}`}>{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      tokens.push(<em key={`i-${match.index}`}>{match[3]}</em>);
    } else if (match[4]) {
      // `code`
      tokens.push(
        <code key={`c-${match.index}`} style={{ background: 'rgba(0,0,0,0.06)', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.9em' }}>
          {match[4]}
        </code>
      );
    } else if (match[5] && match[6]) {
      // [text](url)
      tokens.push(
        <a key={`a-${match.index}`} href={match[6]} target="_blank" rel="noopener noreferrer" style={{ color: '#5856D6', textDecoration: 'underline' }}>
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens.length > 0 ? tokens : [text];
}

const SUGGESTIONS = [
  'What AI services do you offer?',
  'Show me a chart of AI market growth',
  'Compare GPT-4 vs Claude vs Gemini',
  "What's the ROI of AI?",
  'Show me AI adoption stats',
  "I'd like to discuss a project",
];

/**
 * Render a single message's content blocks.
 * Tambo messages have `content` as an array of typed blocks:
 * - { type: 'text', text: string }
 * - { type: 'component', renderedComponent: ReactElement }
 * - { type: 'tool_use', ... }
 * - { type: 'tool_result', ... }
 * We render text blocks as text and component blocks as rendered React elements.
 */
function renderContentBlocks(content: unknown): React.ReactNode[] {
  if (!content) return [];

  // Handle array of content blocks (the standard Tambo format)
  if (Array.isArray(content)) {
    const nodes: React.ReactNode[] = [];

    content.forEach((block: any, i: number) => {
      // Text content block — render markdown
      if (block?.type === 'text' && typeof block.text === 'string' && block.text.trim()) {
        nodes.push(
          <div key={`text-${i}`} className="tambo-message__text">
            {renderMarkdown(block.text)}
          </div>
        );
      }
      // Component content block - rendered by Tambo SDK
      else if (block?.type === 'component' && block.renderedComponent) {
        nodes.push(
          <div key={`comp-${i}`} className="tambo-component-wrapper">
            {block.renderedComponent}
          </div>
        );
      }
      // Fallback: plain string in array
      else if (typeof block === 'string' && block.trim()) {
        nodes.push(
          <div key={`str-${i}`} className="tambo-message__text">
            {renderMarkdown(block)}
          </div>
        );
      }
      // Fallback: object with content field
      else if (typeof block?.content === 'string' && block.content.trim()) {
        nodes.push(
          <div key={`cnt-${i}`} className="tambo-message__text">
            {renderMarkdown(block.content)}
          </div>
        );
      }
    });

    return nodes;
  }

  // Handle plain string content
  if (typeof content === 'string' && content.trim()) {
    return [<div key="text" className="tambo-message__text">{renderMarkdown(content)}</div>];
  }

  // Handle single object with text
  if (content && typeof content === 'object') {
    const c = content as any;
    if (typeof c.text === 'string' && c.text.trim()) {
      return [<div key="text" className="tambo-message__text">{renderMarkdown(c.text)}</div>];
    }
    if (typeof c.content === 'string' && c.content.trim()) {
      return [<div key="text" className="tambo-message__text">{renderMarkdown(c.content)}</div>];
    }
  }

  return [];
}

export function AIPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isStreaming } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const threadRef = useRef<HTMLDivElement>(null);
  const pendingQueryRef = useRef<string | null>(null);

  // Listen for external open events (from hero input bridge)
  useEffect(() => {
    const handler = ((e: CustomEvent<{ query: string }>) => {
      setIsOpen(true);
      if (e.detail?.query) {
        pendingQueryRef.current = e.detail.query;
        setValue(e.detail.query);
      }
    }) as EventListener;

    window.addEventListener('tambo:submit-query', handler);
    return () => window.removeEventListener('tambo:submit-query', handler);
  }, [setValue]);

  // Submit once value is set from bridge
  useEffect(() => {
    if (pendingQueryRef.current && value === pendingQueryRef.current && !isPending) {
      pendingQueryRef.current = null;
      submit();
    }
  }, [value, submit, isPending]);

  // Keyboard shortcut (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Auto-scroll thread
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isPending) {
      submit();
    }
  };

  const handleSuggestion = (text: string) => {
    setValue(text);
    setTimeout(() => submit(), 50);
  };

  // Filter out system messages from display
  const visibleMessages = messages.filter((msg) => msg.role !== 'system');

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`tambo-trigger ${isOpen ? 'tambo-trigger--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <svg className="tambo-trigger__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 0 1 7 7c0 3-1.5 5-3 6.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.5C6.5 14 5 12 5 9a7 7 0 0 1 7-7z"/>
          <line x1="9" y1="22" x2="15" y2="22"/>
          <circle cx="12" cy="9" r="2" fill="currentColor" opacity="0.5"/>
        </svg>
        <span className="tambo-trigger__pulse" />
      </button>

      {/* Backdrop */}
      <div
        className={`tambo-panel__backdrop ${isOpen ? 'is-visible' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className={`tambo-panel ${isOpen ? 'is-open' : ''}`} role="dialog" aria-label="AI Assistant">
        {/* Header */}
        <div className="tambo-panel__header">
          <div className="tambo-panel__title-row">
            <span className="tambo-panel__dot" />
            <span className="tambo-panel__title">ES AI Assistant</span>
          </div>
          <button className="tambo-panel__close" onClick={() => setIsOpen(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Thread */}
        <div className="tambo-thread" ref={threadRef}>
          {visibleMessages.length === 0 && (
            <div className="tambo-welcome">
              <div className="tambo-welcome__icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="18" strokeDasharray="4 4" opacity="0.3"/>
                  <circle cx="24" cy="24" r="8"/>
                  <circle cx="24" cy="24" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>Ask us anything about AI</h3>
              <p>I can show you charts, comparisons, dashboards, services, case studies, timelines, and more — all rendered as interactive components.</p>
            </div>
          )}

          {visibleMessages.map((msg) => {
            const blocks = renderContentBlocks(msg.content);

            // Also check message-level renderedComponent (some Tambo versions)
            const msgRendered = (msg as any).renderedComponent;

            if (blocks.length === 0 && !msgRendered) return null;

            return (
              <div key={msg.id} className={`tambo-message tambo-message--${msg.role}`}>
                {msgRendered && (
                  <div className="tambo-component-wrapper">
                    {msgRendered}
                  </div>
                )}
                {blocks}
              </div>
            );
          })}

          {isStreaming && (
            <div className="tambo-message tambo-message--assistant">
              <div className="tambo-streaming-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions (show only when empty) */}
        {visibleMessages.length === 0 && (
          <div className="tambo-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="tambo-suggestion-chip" onClick={() => handleSuggestion(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form className="tambo-input-area" onSubmit={handleSubmit}>
          <div className="tambo-input-wrapper">
            <input
              className="tambo-input-field"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask about our AI services..."
              disabled={isPending}
            />
            <button className="tambo-input-send" type="submit" disabled={isPending || !value.trim()} aria-label="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div className="tambo-input-hint">
            <kbd>Ctrl</kbd>+<kbd>K</kbd> to toggle
          </div>
        </form>
      </div>
    </>
  );
}
