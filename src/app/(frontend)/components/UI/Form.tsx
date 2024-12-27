"use client"
import { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState('Invia');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!privacyPolicy) {
      alert('Devi accettare l\'informativa sulla privacy');
      return;
    }

    const formData = {
      firstname,
      email,
      message,
    };

    setSubmitButtonDisabled(true);
    setSubmitButtonText('Caricamento...');

    try {

      const response = await axios.post('/api/form-submissions', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201 ) {
        window.location.href = '/grazie';
      } else {
        alert('Errore nell\'invio del form.');
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('Si è verificato un errore durante l\'invio.');
    } finally {
      setSubmitButtonDisabled(false);
      setSubmitButtonText('Invia');
    }
  };

  return (
    <form
      id="formSubmission"
      method="POST"
      encType="application/x-www-form-urlencoded"
      className="w-full px-6 lg:px-8 xl:px-14 py-8 mx-auto"
    >
      <div>
        <label htmlFor="firstname" className="tracking-wide">
          Nome
        </label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          placeholder="il tuo nome"
          className="mt-3 w-full border border-black/20 placeholder-black/50 dark:placeholder-white/30 dark:border-white/20 bg-transparent px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="tracking-wide">
          Indirizzo email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Il tuo indirizzo email"
          className="mt-3 w-full border border-black/20 placeholder-black/50 dark:placeholder-white/30 dark:border-white/20 bg-transparent px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="tracking-wide">
          Il tuo feedback
        </label>
        <textarea
          name="message"
          id="message"
          placeholder="Il tuo messaggio"
          className="mt-3 w-full border border-black/20 placeholder-black/50 dark:placeholder-white/30 dark:border-white/20 bg-transparent px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="privacyPolicy"
          name="privacyPolicy"
          checked={privacyPolicy}
          onChange={(event) => setPrivacyPolicy(event.target.checked)}
          required
          className="mr-2"
        />
        <label htmlFor="privacyPolicy" className="tracking-wide">
          Ho preso visione del
          <a href="/legale/privacy" target="_blank" className="text-blue-500">
            informativa sulla privacy
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="rounded-full mt-4 px-8 py-4 text-sm transition-all flex items-center justify-center bg-black text-white"
        disabled={submitButtonDisabled}
        onClick={handleSubmit}
      >
        <span className="relative text-lg uppercase tracking-wide">
          {submitButtonText}
        </span>
      </button>
    </form>
  );
};

export default Form;