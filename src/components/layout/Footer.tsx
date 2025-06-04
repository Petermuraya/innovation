import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaDiscord,
  FaArrowRight
} from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "@/assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaTwitter className="h-5 w-5" />, url: "https://twitter.com/" },
    { icon: <FaGithub className="h-5 w-5" />, url: "https://github.com/" },
    { icon: <FaLinkedin className="h-5 w-5" />, url: "https://linkedin.com/" },
    { icon: <FaInstagram className="h-5 w-5" />, url: "https://instagram.com/" },
    { icon: <FaWhatsapp className="h-5 w-5" />, url: "https://wa.me/254700000000" },
    { icon: <FaYoutube className="h-5 w-5" />, url: "https://youtube.com/" },
    { icon: <FaDiscord className="h-5 w-5" />, url: "https://discord.gg/" }
  ];

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Events", path: "/events" },
    { label: "Communities", path: "/communities" },
    { label: "Blog", path: "/blog" }
  ];

  const resourceLinks = [
    { label: "Member Login", path: "/login" },
    { label: "Join Us", path: "/register" },
    { label: "Code of Conduct", path: "#" },
    { label: "Privacy Policy", path: "#" }
  ];

  const footerBottomLinks = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Contact Us", path: "/contact" }
  ];

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Social */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.img
                src={Logo}
                alt="Karatina Innovation Club Logo"
                className="h-12 w-auto rounded-md shadow-sm group-hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.05 }}
              />
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                Innovation Club
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Building tomorrow's technology leaders through innovation, collaboration, and mentorship.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted/50"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <motion.li 
                  key={index} 
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <motion.span 
                      className="inline-block"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <motion.li 
                  key={index} 
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <motion.span 
                      className="inline-block"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1 space-y-4">
            <h3 className="text-base font-semibold text-foreground">Stay updated</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get the latest updates and news from Karatina Innovation Club.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="w-full bg-muted/50 border-border focus:ring-2 focus:ring-primary/50 hover:border-primary/50 transition-all"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/60 transition-all shadow hover:shadow-md"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-border pt-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Karatina Innovation Club. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-end">
              {footerBottomLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}