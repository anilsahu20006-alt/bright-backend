import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const phone = "919078014777";
  const msg = encodeURIComponent("Hi Digital Service, I need help with a form application.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-4 md:bottom-5 md:right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-elegant hover:scale-105 transition-transform font-semibold"
    >
      <MessageCircle className="h-5 w-5 fill-white" />
      <span className="hidden sm:inline text-sm">Chat on WhatsApp</span>
    </a>
  );
};
