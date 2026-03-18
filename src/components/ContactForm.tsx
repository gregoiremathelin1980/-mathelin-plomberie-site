"use client";

import { useState } from "react";
import { Phone, Send, MapPin } from "lucide-react";
import { useSettings, usePhoneRaw } from "@/contexts/SettingsContext";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const CONTACT_SUBJECTS = [
  { value: "devis", label: "Demande de devis" },
  { value: "info", label: "Question / information" },
  { value: "urgence", label: "Urgence plomberie" },
] as const;

export default function ContactForm() {
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settings = useSettings();
  const phoneRaw = usePhoneRaw();
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessKey) {
      setError("Formulaire non configuré. Contactez le propriétaire du site.");
      return;
    }
    setError(null);
    setSending(true);
    try {
      const formData = new FormData();
      formData.set("access_key", accessKey);
      formData.set("subject", subject);
      formData.set("name", name);
      formData.set("phone", phone);
      formData.set("message", message);
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        setSent(true);
        setSubject("");
        setName("");
        setPhone("");
        setMessage("");
      } else {
        setError(data.message ?? "L'envoi a échoué. Réessayez ou appelez-nous.");
      }
    } catch {
      setError("Erreur réseau. Réessayez ou appelez-nous.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
            Contact
          </h2>
          <p className="mt-2 text-gray-text">
            Une question ou besoin d&apos;un devis ? Contactez-nous.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex sm:gap-8 sm:p-8">
          <form
            className="flex-1 space-y-4"
            onSubmit={handleSubmit}
            data-form-type="contact"
          >
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700">
                Objet de la demande
              </label>
              <select
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
                name="subject"
              >
                <option value="">Sélectionnez</option>
                {CONTACT_SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Votre nom"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="06 00 00 00 00"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Décrivez votre besoin..."
                required
              />
            </div>
            {sent && (
              <p className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-800">
                Message envoyé. Nous vous recontacterons rapidement.
              </p>
            )}
            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:bg-primary-light disabled:opacity-60 sm:w-auto sm:px-8"
            >
              <Send className="h-4 w-4" />
              {sending ? "Envoi…" : "Envoyer"}
            </button>
          </form>
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl bg-primary/5 p-6 sm:mt-0 sm:w-72">
            <MapPin className="mb-2 h-10 w-10 text-primary" />
            <p className="text-center text-sm font-medium text-gray-700">
              Ou appelez-nous directement
            </p>
            <a
              href={`tel:${phoneRaw}`}
              className="mt-4 flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-white transition hover:bg-orange-600"
            >
              <Phone className="h-5 w-5" />
              {settings.phone}
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-sm font-medium text-primary">
          Artisan plombier-chauffagiste diplômé (BP Génie Climatique) à votre service depuis 2013.
        </p>
      </div>
    </section>
  );
}
