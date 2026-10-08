"use client";

import { useEffect, useRef, useState } from "react";
import { FAQ_ITEMS } from "@/lib/faq";
import { storeName, waLink, waNumber } from "@/lib/format";

type ChatMessage = {
  role: "bot" | "user";
  text: string;
};

const GREETING = `Halo! Saya asisten ${storeName()}. Silakan pilih pertanyaan di bawah, lalu lanjut ke WhatsApp bila perlu.`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: GREETING },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-chat", openHandler);
    return () => window.removeEventListener("open-chat", openHandler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const ask = (question: string, answer: string) => {
    setMessages((prev) => [...prev, { role: "user", text: question }, { role: "bot", text: answer }]);
  };

  return (
    <>
      {/* Tombol mengambang — desktop; mobile lewat bottom nav */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Buka chat bantuan"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-brand-500 text-white shadow-lg transition hover:bg-brand-600 sm:grid"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-7 w-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 9.75h6.75m-6.75 3h4.5M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-20 right-3 z-50 flex w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:bottom-24 sm:right-6">
          <div className="flex items-center gap-3 bg-navy-800 px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 text-sm font-bold">
              RU
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">Asisten Toko</p>
              <p className="text-[11px] text-navy-200">Balasan cepat · online</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              className="grid h-8 w-8 place-items-center rounded-md text-navy-100 transition hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="max-h-80 flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-sm bg-brand-500 text-white"
                      : "rounded-bl-sm border border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            <div className="space-y-1.5 pt-1">
              {FAQ_ITEMS.map((item) => (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => ask(item.q, item.a)}
                  className="block w-full rounded-full border border-navy-200 bg-white px-3.5 py-2 text-left text-sm text-navy-800 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 p-3">
            <a
              href={waLink(`Halo ${storeName()}, saya mau bertanya.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md bg-brand-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Lanjut ke WhatsApp (+{waNumber()})
            </a>
          </div>
        </div>
      )}
    </>
  );
}
