import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faInstagram,
  faYoutube,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

// Add icons to the FontAwesome library
library.add(
  faInstagram,
  faYoutube,
  faLinkedin,
  faMapMarkerAlt,
  faPhone,
  faEnvelope
);

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="bg-[#FAF4ED] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contact Section */}
      <motion.section
        className="py-12 px-4 md:px-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto text-center">
          {/* Title Animation */}
          <motion.h1
            className="text-4xl font-bold text-[#403C5C] mb-4"
            variants={itemVariants}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg text-[#403C5C] py-4"
            variants={itemVariants}
          >
            We&apos;d love to hear from you! Get in touch with us using the form
            below or the contact details provided.
          </motion.p>

          <motion.div
            className="mt-16 flex flex-col md:flex-row md:justify-center gap-8"
            variants={itemVariants}
          >
            {/* Contact Form */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/5"
              variants={itemVariants}
            >
              <motion.form
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="name"
                    className="block text-[#403C5C] text-sm font-bold mb-2 text-left"
                  >
                    Name
                  </label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-[#CBAACB] rounded focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
                    required
                    whileFocus={{ borderColor: "#D4C1EC" }}
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="email"
                    className="block text-[#403C5C] text-sm font-bold mb-2 text-left"
                  >
                    Email
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-[#CBAACB] rounded focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
                    required
                    whileFocus={{ borderColor: "#D4C1EC" }}
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="message"
                    className="block text-[#403C5C] text-sm font-bold mb-2 text-left"
                  >
                    Message
                  </label>
                  <motion.textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Your Message"
                    className="w-full px-4 py-2 border border-[#CBAACB] rounded focus:outline-none focus:ring-2 focus:ring-[#D4C1EC]"
                    required
                    whileFocus={{ borderColor: "#D4C1EC" }}
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  className="w-full py-3 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Send Message
                </motion.button>
              </motion.form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 flex flex-col justify-center"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-[#403C5C] mb-4">
                Get in Touch
              </h3>
              {[
                {
                  icon: faMapMarkerAlt,
                  text: "Chandigarh, India",
                },
                {
                  icon: faPhone,
                  text: "+91 7909086342",
                },
                {
                  icon: faPhone,
                  text: "+91 8173970847",
                },
                {
                  icon: faEnvelope,
                  text: "edusphere@gmail.com",
                },
              ].map((item, index) => (
                <motion.p
                  key={index}
                  className="text-[#403C5C] flex items-center mb-3 justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="mr-2 text-[#403C5C]"
                    />
                  </motion.div>
                  {item.text}
                </motion.p>
              ))}
              <h3 className="text-2xl font-bold text-[#403C5C] mt-6 mb-4">
                Follow Us
              </h3>
              <div className="flex justify-center gap-4">
                {[
                  { icon: ["fab", "youtube"], href: "https://www.youtube.com/@Edushpher" },
                  { icon: ["fab", "linkedin"], href: "https://www.linkedin.com/company/edushphere/" },
                  { icon: ["fab", "instagram"], href: "https://www.instagram.com/edushpher_1234?igsh=cDdscjMydzB0NW9u" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] bg-[#403C5C] rounded-full hover:bg-[#D4C1EC] hover:text-[#403C5C] transition-all"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Contact;
