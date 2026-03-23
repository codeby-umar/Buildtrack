import React, { useState } from "react";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: "success", text: "Message saved locally. (No backend attached.)" });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-3 text-2xl font-black">Contact</h1>

      {status && (
        <div className="mb-3 rounded-lg border border-black/10 bg-black/5 p-3 text-sm text-black/70">
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <label className="flex flex-col gap-1">
          Name
          <input
            className="h-10 rounded-lg border border-black/10 bg-white px-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            className="h-10 rounded-lg border border-black/10 bg-white px-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          Message
          <textarea
            className="min-h-[120px] rounded-lg border border-black/10 bg-white px-2 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="h-11 rounded-lg bg-black px-4 text-sm font-bold text-white hover:bg-black/90"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Contact;