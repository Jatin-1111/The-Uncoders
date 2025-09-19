import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { motion } from "framer-motion";
import {
  faInstagram,
  faYoutube,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the FontAwesome library
library.add(
  faInstagram,
  faYoutube,
  faLinkedin,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faHeart
);

const Footer = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
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

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    }),
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: { duration: 0.2 },
    },
  };

  const footerSections = [
    {
      title: "The UnCoders",
      content:
        "Empowering IT students at UIET Chandigarh with free, high-quality study resources. Our mission is to make learning accessible and engaging through innovative educational solutions.",
      type: "text",
    },
    {
      title: "Quick Links",
      content: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Content", href: "/content" },
        { label: "Contact", href: "/contact" },
      ],
      type: "links",
    },
    {
      title: "Contact Info",
      content: [
        { icon: "map-marker-alt", text: "Chandigarh, India" },
        { icon: "phone", text: "+91 7696316713" },
        { icon: "phone", text: "+91 7009244033" },
        { icon: "envelope", text: "theuncoders@gmail.com" },
      ],
      type: "contact",
    },
    {
      title: "Follow Us",
      content: [
        { icon: ["fab", "youtube"], href: "", label: "YouTube" },
        { icon: ["fab", "linkedin"], href: "", label: "LinkedIn" },
        { icon: ["fab", "instagram"], href: "", label: "Instagram" },
      ],
      type: "social",
    },
  ];

  return (
    <motion.footer
      className="bg-gradient-to-br from-[#403C5C] via-[#4A4470] to-[#5C6BC0] text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <motion.div
              key={section.title}
              className="space-y-4"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-[#CBAACB] border-b-2 border-[#CBAACB] pb-2 inline-block">
                {section.title}
              </h3>

              {section.type === "text" && (
                <p className="text-sm leading-relaxed text-gray-200">
                  {section.content}
                </p>
              )}

              {section.type === "links" && (
                <div className="space-y-2">
                  {section.content.map((link, idx) => (
                    <motion.a
                      key={idx}
                      href={link.href}
                      className="block text-sm text-gray-200 hover:text-[#CBAACB] transition-colors duration-200"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      → {link.label}
                    </motion.a>
                  ))}
                </div>
              )}

              {section.type === "contact" && (
                <div className="space-y-3">
                  {section.content.map((contact, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center text-sm text-gray-200"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                    >
                      <FontAwesomeIcon
                        icon={contact.icon}
                        className="mr-3 text-[#CBAACB] w-4"
                      />
                      <span>{contact.text}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {section.type === "social" && (
                <div className="flex space-x-4">
                  {section.content.map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={social.href}
                      className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-[#CBAACB]/30 text-white rounded-full hover:bg-[#CBAACB] hover:text-[#403C5C] transition-all duration-300 group"
                      variants={iconVariants}
                      custom={idx}
                      initial="hidden"
                      whileInView="visible"
                      whileHover="hover"
                      viewport={{ once: true }}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.label}
                    >
                      <FontAwesomeIcon
                        icon={social.icon}
                        className="text-lg group-hover:scale-110 transition-transform"
                      />
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="border-t border-white/20 bg-black/20 backdrop-blur-sm"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              className="text-sm text-gray-300 flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span>© 2025 The UnCoders. Made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="mx-2"
              >
                <FontAwesomeIcon icon="heart" className="text-red-400" />
              </motion.div>
              <span>for UIET students.</span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-6 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <a
                href="/privacy"
                className="hover:text-[#CBAACB] transition-colors"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="/terms"
                className="hover:text-[#CBAACB] transition-colors"
              >
                Terms of Service
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#CBAACB] via-[#D4C1EC] to-[#CBAACB]"></div>
    </motion.footer>
  );
};

export default Footer;
