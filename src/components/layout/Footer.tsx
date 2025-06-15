
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
  FaArrowRight,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "@/assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaTwitter className="h-5 w-5" />, url: "https://twitter.com/", label: "Twitter" },
    { icon: <FaGithub className="h-5 w-5" />, url: "https://github.com/", label: "GitHub" },
    { icon: <FaLinkedin className="h-5 w-5" />, url: "https://linkedin.com/", label: "LinkedIn" },
    { icon: <FaInstagram className="h-5 w-5" />, url: "https://instagram.com/", label: "Instagram" },
    { icon: <FaWhatsapp className="h-5 w-5" />, url: "https://wa.me/254700000000", label: "WhatsApp" },
    { icon: <FaYoutube className="h-5 w-5" />, url: "https://youtube.com/", label: "YouTube" },
    { icon: <FaDiscord className="h-5 w-5" />, url: "https://discord.gg/", label: "Discord" }
  ];

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Events", path: "/events" },
    { label: "Blog", path: "/blogs" },
    { label: "Careers", path: "/careers" }
  ];

  const memberLinks = [
    { label: "Join Us", path: "/register" },
    { label: "Member Login", path: "/login" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Communities", path: "/communities" },
    { label: "Leaderboard", path: "/leaderboard" }
  ];

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Code of Conduct", path: "/conduct" },
    { label: "Contact Us", path: "/contact" }
  ];

  const contactInfo = [
    { icon: <FaEnvelope className="h-4 w-4" />, text: "info@karatinaclub.ac.ke" },
    { icon: <FaPhone className="h-4 w-4" />, text: "+254 700 000 000" },
    { icon: <FaMapMarkerAlt className="h-4 w-4" />, text: "Karatina University, Kenya" }
  ];

  return (
    <footer className="bg-gradient-to-br from-background via-background to-muted/20 border-t-2 border-primary/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-flex items-center gap-4 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <img
                    src={Logo}
                    alt="Karatina Innovation Club"
                    className="h-16 w-16 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
                <div>
                  <h3 className="font-bold text-2xl bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                    Karatina Innovation Club
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Building Tomorrow's Leaders</p>
                </div>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-muted-foreground leading-relaxed text-base max-w-md"
            >
              Empowering the next generation of innovators through cutting-edge technology, 
              collaborative learning, and transformative projects that shape the future.
            </motion.p>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <span className="text-primary">{contact.icon}</span>
                  <span>{contact.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-foreground mb-4">Connect With Us</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-full bg-muted/50 hover:bg-primary text-muted-foreground hover:text-white transition-all duration-300 overflow-hidden"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold text-foreground relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <FaArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Member Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold text-foreground relative">
              For Members
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              {memberLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <FaArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold text-foreground relative">
              Stay Updated
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get the latest updates on events, projects, and opportunities delivered to your inbox.
            </p>
            <form className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe Now
                <FaArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground text-center md:text-left"
            >
              © {currentYear} Karatina Innovation Club. Crafted with ❤️ for innovation.
            </motion.p>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-6 justify-center md:justify-end"
            >
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-xl"></div>
    </footer>
  );
}
