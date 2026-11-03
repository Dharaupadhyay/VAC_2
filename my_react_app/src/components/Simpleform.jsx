import { useRef, useState } from 'react';

function SimpleForm() {
  const cardRef = useRef(null);

  // 1. Form state
  const [formData, setFormData] = useState({ name: '', email: '' });

  // 2. Error state
  const [errors, setErrors] = useState({});

  // 3. Submitted data state (screen par dikhane ke liye)
  const [submittedData, setSubmittedData] = useState(null);

  // 4. Loading state (fake request ke liye)
  const [loading, setLoading] = useState(false);

  // Total saved entries count
  const [savedCount, setSavedCount] = useState(
    () => (JSON.parse(localStorage.getItem('formDataList')) || []).length
  );

  // Cursor spotlight
  const handleMouseMove = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    cardRef.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  // Universal onChange handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    return newErrors;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.warn('⚠️ Validation failed:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const payload = { name: formData.name.trim(), email: formData.email.trim() };

    // Console par request dikhegi
    console.group('🚀 Form Submit');
    console.log('➡️ REQUEST  POST /api/early-access');
    console.log('   headers:', { 'Content-Type': 'application/json' });
    console.log('   body:', payload);

    // Fake network delay (yahan baad me real fetch/axios laga lena)
    setTimeout(() => {
      // LocalStorage me save
      const existingEntries = JSON.parse(localStorage.getItem('formDataList')) || [];
      const newEntry = { id: Date.now(), ...payload };
      const updatedEntries = [...existingEntries, newEntry];

      localStorage.setItem('formDataList', JSON.stringify(updatedEntries));
      localStorage.setItem('formData', JSON.stringify(payload));

      console.log('⬅️ RESPONSE 200 OK', { success: true, id: newEntry.id });
      console.log('✅ Form Submitted Data:', payload);
      console.log('📦 LocalStorage (formData):', JSON.parse(localStorage.getItem('formData')));
      console.log('📚 All LocalStorage Entries (formDataList):', updatedEntries);
      console.table(updatedEntries);
      console.groupEnd();

      setSubmittedData(payload);
      setSavedCount(updatedEntries.length);
      setFormData({ name: '', email: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="page">
      <div className="blob blob-a" />
      <div className="blob blob-b" />

      <section className="card" ref={cardRef} onMouseMove={handleMouseMove}>
        <h1>Get early access</h1>
        <p className="sub">
          Drop your details and we'll email you when the doors open.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="field">
            <input
              id="name"
              type="text"
              name="name"
              placeholder=" "
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            <label htmlFor="name">Full name</label>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="field">
            <input
              id="email"
              type="email"
              name="email"
              placeholder=" "
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            <label htmlFor="email">Email address</label>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <button
            type="submit"
            className={`cta ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            <span>{loading ? 'Joining…' : 'Join the list'}</span>
          </button>
        </form>

        {/* Submitted data */}
        {submittedData && (
          <div className="submitted-card">
            <svg className="check" viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="24" />
              <path d="M15 27l8 8 14-16" />
            </svg>
            <div>
              <h3>You're on the list, {submittedData.name.split(' ')[0]}.</h3>
              <p>{submittedData.email}</p>
              <small>{savedCount} saved in LocalStorage. Open DevTools → Console.</small>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default SimpleForm;