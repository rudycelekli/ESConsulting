import React, { useState, useEffect, useRef } from 'react';
import { useTambo, useTamboThreadInput } from '@tambo-ai/react';
import '../styles/tambo.css';

const SUGGESTIONS = [
  'What AI services do you offer?',
  'Show me case studies',
  'How long does a project take?',
  "What's the ROI of AI?",
  'Recommend a tech stack',
  "I'd like to discuss a project",
];

export function AIPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isStreaming } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const threadRef = useRef<HTMLDivElement>(null);

  // Listen for external open events (from hero input bridge)
  useEffect(() => {
    const handler = ((e: CustomEvent<{ query: string }>) => {
      setIsOpen(true);
      if (e.detail?.query) {
        setTimeout(() => {
          setValue(e.detail.query);
          submit();
        }, 400);
      }
    }) as EventListener;

    window.addEventListener('tambo:submit-query', handler);
    return () => window.removeEventListener('tambo:submit-query', handler);
  }, [setValue, submit]);

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
          {messages.length === 0 && (
            <div className="tambo-welcome">
              <div className="tambo-welcome__icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="18" strokeDasharray="4 4" opacity="0.3"/>
                  <circle cx="24" cy="24" r="8"/>
                  <circle cx="24" cy="24" r="2" fill="currentColor"/>
                </svg>
              </div>
              <h3>Ask us anything about AI</h3>
              <p>I can show you our services, case studies, project timelines, tech recommendations, and help you get in touch.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`tambo-message tambo-message--${msg.role}`}>
              {msg.role === 'assistant' && msg.renderedComponent ? (
                <div className="tambo-component-wrapper">
                  {msg.renderedComponent}
                </div>
              ) : (
                <div className="tambo-message__text">
                  {typeof msg.content === 'string' ? msg.content : null}
                </div>
              )}
            </div>
          ))}

          {isStreaming && (
            <div className="tambo-message tambo-message--assistant">
              <div className="tambo-streaming-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions (show only when empty) */}
        {messages.length === 0 && (
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
