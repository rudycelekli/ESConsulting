import React, { useState } from 'react';
import type { ContactFormProps } from '../schemas/contact-form.schema';

export function ContactForm({ prefilledName, prefilledEmail, prefilledCompany, prefilledMessage, suggestedSubject, urgency }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(prefilledName || '');
  const [email, setEmail] = useState(prefilledEmail || '');
  const [company, setCompany] = useState(prefilledCompany || '');
  const [message, setMessage] = useState(prefilledMessage || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, POST to your form endpoint
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="tambo-contact tambo-contact--success">
        <div className="tambo-contact__check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h4>Message sent!</h4>
        <p>Our team will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form className="tambo-contact" onSubmit={handleSubmit}>
      <div className="tambo-contact__header">
        <h4>{suggestedSubject || 'Get in Touch'}</h4>
        {urgency && <span className="tambo-tag">{urgency.replace('-', ' ')}</span>}
      </div>
      <input className="tambo-form-input" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
      <input className="tambo-form-input" type="email" placeholder="Work Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input className="tambo-form-input" type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
      <textarea className="tambo-form-input tambo-form-textarea" placeholder="Tell us about your project" value={message} onChange={e => setMessage(e.target.value)} rows={4} required />
      <button className="tambo-form-submit" type="submit">Send Message</button>
    </form>
  );
}
