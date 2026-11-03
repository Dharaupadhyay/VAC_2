import { useRef, useState } from 'react'
import './App.css'

export default function App() {
  const cardRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '' })
  const [status, setStatus] = useState('idle') // idle | loading | done
  const [error, setError] = useState('')

  // Spotlight follows the cursor inside the card
  const onMove = (e) => {
    const r = cardRef.current.getBoundingClientRect()
    cardRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    cardRef.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return setError('Enter a valid email, like you@example.com.')

    setStatus('loading')
    // TODO: replace this timeout with your real API call
    setTimeout(() => setStatus('done'), 1200)
  }

  const reset = () => {
    setForm({ name: '', email: '' })
    setStatus('idle')
  }

  return (
    <main className="page">
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <section className="card" ref={cardRef} onMouseMove={onMove}>
        {status === 'done' ? (
          <div className="done">
            <svg className="check" viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="24" />
              <path d="M15 27l8 8 14-16" />
            </svg>
            <h2>You're on the list, {form.name.split(' ')[0]}.</h2>
            <p>We'll email {form.email} the moment the doors open.</p>
            <button type="button" className="link" onClick={reset}>
              Add another person
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h1>Get early access</h1>
            <p className="sub">
              Drop your details and we'll email you when the doors open.
            </p>

            <div className="field">
              <input
                id="name"
                name="name"
                type="text"
                placeholder=" "
                autoComplete="name"
                value={form.name}
                onChange={onChange}
              />
              <label htmlFor="name">Your name</label>
            </div>

            <div className="field">
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                autoComplete="email"
                value={form.email}
                onChange={onChange}
              />
              <label htmlFor="email">Email address</label>
            </div>

            <p className="error" role="alert">
              {error}
            </p>

            <button
              type="submit"
              className={`cta ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
            >
              <span>{status === 'loading' ? 'Joining…' : 'Join the list'}</span>
            </button>
          </form>
        )}
      </section>
    </main>
  )
}