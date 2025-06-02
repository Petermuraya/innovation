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
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Social */}
          <div className="lg:col-span-2">
            <Link 
              to="/" 
              className="flex items-center space-x-3"
            >
              <div className="bg-primary text-white font-bold text-xl rounded-md h-10 w-10 flex items-center justify-center">
                K
              </div>
              <span className="font-semibold text-2xl bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                Innovation Club
              </span>
            </Link>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Building tomorrow's technology leaders through innovation, collaboration, and mentorship.
            </p>
            
            {/* Social Icons */}
            <div className="mt-8 flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="mt-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 4 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <FaArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-6 space-y-4">
              {resourceLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 4 }}
                >
                  <Link 
                    to={link.path} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <FaArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Stay updated</h3>
            <p className="mt-6 text-muted-foreground text-sm leading-relaxed">
              Get the latest updates and news from Karatina Innovation Club.
            </p>
            <form className="mt-6 space-y-3">
              <div>
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-muted/50 border-border focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/60 transition-all"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 border-t border-border pt-8 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Karatina Innovation Club. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {footerBottomLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.path}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
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