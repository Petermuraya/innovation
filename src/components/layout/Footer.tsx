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
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "@/assets/Innovation Club New Logo- Primary Logo.png";

interface SocialLink {
  icon: React.ReactNode;
  url: string;
  label: string;
}

interface NavLink {
  label: string;
  path: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  text: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLinkClick = (path: string) => {
    scrollToTop();
  };

  const socialLinks: SocialLink[] = [
    { icon: <FaTwitter className="h-5 w-5" />, url: "https://twitter.com/", label: "Twitter" },
    { icon: <FaGithub className="h-5 w-5" />, url: "https://github.com/", label: "GitHub" },
    { icon: <FaLinkedin className="h-5 w-5" />, url: "https://linkedin.com/", label: "LinkedIn" },
    { icon: <FaInstagram className="h-5 w-5" />, url: "https://instagram.com/", label: "Instagram" },
    { icon: <FaWhatsapp className="h-5 w-5" />, url: "https://wa.me/254700000000", label: "WhatsApp" },
    { icon: <FaYoutube className="h-5 w-5" />, url: "https://youtube.com/", label: "YouTube" },
    { icon: <FaDiscord className="h-5 w-5" />, url: "https://discord.gg/", label: "Discord" },
  ];

  const quickLinks: NavLink[] = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Events", path: "/events" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  const memberLinks: NavLink[] = [
    { label: "Join Us", path: "/register" },
    { label: "Member Login", path: "/login" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Constitution", path: "/constitution" },
  ];

  const legalLinks: NavLink[] = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Code of Conduct", path: "/conduct" },
    { label: "Contact Us", path: "/contact" },
  ];

  const contactInfo: ContactInfo[] = [
    { icon: <FaEnvelope className="h-4 w-4" />, text: "info@karatinaclub.ac.ke" },
    { icon: <FaPhone className="h-4 w-4" />, text: "+254 700 000 000" },
    { icon: <FaMapMarkerAlt className="h-4 w-4" />, text: "Karatina University, Kenya" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const linkHoverVariants = {
    hover: { x: 8 },
    tap: { scale: 0.95 },
  };

  const socialHoverVariants = {
    hover: { scale: 1.1, y: -3 },
    tap: { scale: 0.95 },
  };

  const renderLinkList = (links: NavLink[], title: string) => (
    <motion.div 
      variants={itemVariants} 
      className="space-y-6 text-center md:text-left"
    >
      <h4 className="text-lg font-semibold text-white relative pb-3 inline-block">
        {title}
        <div className="absolute bottom-0 left-1/2 md:left-0 w-12 h-1 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transform -translate-x-1/2 md:translate-x-0" />
      </h4>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <motion.li
            key={index}
            whileHover="hover"
            whileTap="tap"
            variants={linkHoverVariants}
            transition={{ type: "spring", stiffness: 400 }}
            className="flex justify-center md:justify-start"
          >
            <Link
              to={link.path}
              onClick={() => handleLinkClick(link.path)}
              className="text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-3 group py-1"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full"
              />
              <span className="group-hover:bg-gradient-to-r group-hover:from-amber-300 group-hover:to-emerald-400 group-hover:bg-clip-text group-hover:text-transparent">
                {link.label}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Golden Glow Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-amber-900/20 to-emerald-900/30" />
        
        {/* Animated floating elements */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-emerald-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-emerald-500/15 to-amber-400/10 rounded-full blur-xl"
        />
      </div>
      
      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-2 space-y-8 text-center md:text-left"
          >
            <Link to="/" onClick={() => handleLinkClick('/')} className="inline-flex items-center gap-4 group mx-auto md:mx-0">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={Logo} 
                  alt="Karatina Innovation Club" 
                  className="h-16 w-auto mx-auto md:mx-0"
                />
              </motion.div>
            </Link>

            <p className="text-gray-300 leading-relaxed text-base max-w-md mx-auto md:mx-0">
              Empowering the next generation of innovators through cutting-edge technology, 
              collaborative learning, and transformative projects that shape the future.
            </p>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg mb-4 text-center md:text-left">
                Get In Touch
              </h4>
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-all duration-300 cursor-pointer justify-center md:justify-start"
                  >
                    <span className="bg-gradient-to-r from-amber-500/20 to-emerald-500/20 p-2 rounded-lg group-hover:from-amber-400/30 group-hover:to-emerald-400/30 transition-all duration-300">
                      {contact.icon}
                    </span>
                    <span>{contact.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-lg text-center md:text-left">
                Connect With Us
              </h4>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-amber-400/50"
                    whileHover="hover"
                    whileTap="tap"
                    variants={socialHoverVariants}
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <span className="relative z-10">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          {renderLinkList(quickLinks, "Quick Links")}

          {/* Member Links */}
          {renderLinkList(memberLinks, "For Members")}

          {/* Newsletter Section */}
          <motion.div 
            variants={itemVariants} 
            className="space-y-6 text-center md:text-left"
          >
            <h4 className="text-lg font-semibold text-white relative pb-3 inline-block">
              Stay Updated
              <div className="absolute bottom-0 left-1/2 md:left-0 w-12 h-1 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transform -translate-x-1/2 md:translate-x-0" />
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
              Get the latest updates on events, projects, and opportunities delivered to your inbox.
            </p>
            <form className="space-y-4 max-w-md mx-auto md:mx-0">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all duration-300 w-full"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-400/30 hover:border-amber-300/50 group"
              >
                <span className="group-hover:bg-gradient-to-r group-hover:from-amber-200 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent">
                  Subscribe Now
                </span>
                <FaArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            <p className="text-xs text-gray-400 max-w-md mx-auto md:mx-0">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div variants={itemVariants} className="mt-16 pt-8">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} Karatina Innovation Club. Crafted with ♡ by peter muraya.
            </p>

            <div className="flex flex-wrap gap-6 justify-center">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-xs text-gray-400 hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500" />
    </footer>
  );
};

export default Footer;