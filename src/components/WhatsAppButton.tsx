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
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-elegant hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-7 w-7 fill-white" />
    </a>
  );
};
