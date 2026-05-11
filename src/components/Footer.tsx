import { Link } from "@/lib/router-compat";
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";

export const Footer = () => (
  <footer className="mt-16 bg-[hsl(222_25%_14%)] text-white/80">
    <div className="container py-12 grid gap-10 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-saffron via-white to-deep-green text-deep-green grid place-items-center font-black shadow-card">DS</div>
          <span className="leading-tight">
            <span className="block text-xl font-extrabold text-saffron">Digital</span>
            <span className="block -mt-1 text-xl font-extrabold text-white">Service</span>
          </span>
        </div>
        <p className="text-sm leading-relaxed">
          Apply for government forms, certificates and admissions online — fast, simple and reliable.
        </p>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="hover:text-brand">Home</Link></li>
          <li><Link to="/services" className="hover:text-brand">Services</Link></li>
          <li><Link to="/about" className="hover:text-brand">About</Link></li>
          <li><Link to="/contact" className="hover:text-brand">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Services</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/services" className="hover:text-brand">All Forms</Link></li>
          <li><Link to="/services" className="hover:text-brand">General Services</Link></li>
          <li><Link to="/services" className="hover:text-brand">Admissions</Link></li>
          <li><Link to="/services" className="hover:text-brand">Recruitment</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Contact</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> <a href="mailto:anilsahukalia8@gmail.com" className="hover:text-saffron">anilsahukalia8@gmail.com</a></li>
          <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> <a href="tel:+919078014777" className="hover:text-saffron">+91 90780 14777</a></li>
        </ul>
        <div className="flex items-center gap-3 mt-4">
          <a href="#" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand transition-colors"><Facebook className="h-4 w-4" /></a>
          <a href="#" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand transition-colors"><Instagram className="h-4 w-4" /></a>
          <a href="#" className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-brand transition-colors"><Youtube className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="container py-4 text-xs text-center text-white/60 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span>© {new Date().getFullYear()} Digital Service. All rights reserved.</span>
        <Link to="/admin" className="text-white/40 hover:text-saffron underline-offset-2 hover:underline">Admin Login</Link>
      </div>
    </div>
  </footer>
);
