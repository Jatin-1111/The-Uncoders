import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  faInstagram,
  faYoutube,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/alertVariants";

// Add icons to the FontAwesome library
library.add(
  faInstagram,
  faYoutube,
  faLinkedin,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faSpinner,
  faCheckCircle,
  faTimesCircle
);

const NotificationPopup = ({ notification }) => {
  const popupVariants = {
    initial: {
      opacity: 0,
      y: -50,
      scale: 0.5,
      rotateX: 45,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const progressVariants = {
    initial: { scaleX: 1 },
    animate: {
      scaleX: 0,
      transition: {
        duration: 5,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-md"
      variants={popupVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <Alert
        className={`
          border-2 shadow-lg backdrop-blur-sm
          ${
            notification.type === "success"
              ? "bg-green-50/90 border-green-200 text-green-800"
              : "bg-red-50/90 border-red-200 text-red-800"
          }`}
      >
        <div className="relative">
          <div className="flex items-center gap-3">
            <motion.div
              variants={iconVariants}
              initial="initial"
              animate="animate"
            >
              <FontAwesomeIcon
                icon={
                  notification.type === "success"
                    ? faCheckCircle
                    : faTimesCircle
                }
                className={`h-6 w-6 ${
                  notification.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              />
            </motion.div>
            <AlertTitle className="text-lg font-semibold">
              {notification.type === "success" ? "Success!" : "Error"}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2 pl-9">
            {notification.message}
          </AlertDescription>

          {/* Progress bar */}
          <motion.div
            className={`absolute bottom-0 left-0 h-1 w-full origin-left ${
              notification.type === "success" ? "bg-green-300" : "bg-red-300"
            }`}
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </div>
      </Alert>
    </motion.div>
  );
};

// PropTypes validation
NotificationPopup.propTypes = {
  notification: PropTypes.shape({
    type: PropTypes.oneOf(["success", "error"]).isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const Contact = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await emailjs.sendForm(
        "service_fdfj00e",
        "template_t9ffswa",
        form.current,
        {
          publicKey: "ibi3P2K95jYRuihAu",
        }
      );

      console.log("SUCCESS!", result.text);
      showNotification("success", "Message sent successfully!");
      form.current.reset();
    } catch (error) {
      console.error("FAILED...", error.text);
      showNotification("error", "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 150,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 150,
      },
    },
  };
  return (
    <motion.div
      className="bg-[#FAF4ED] min-h-screen relative flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Enhanced Notification */}
      <AnimatePresence mode="wait">
        {notification && (
          <NotificationPopup
            notification={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <motion.section
        className="py-12 px-4 md:px-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto text-center flex flex-col mt-16">
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
            {`We'd love to hear from you! Get in touch with us using the form below or the contact details provided.`
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
          </motion.p>

          <motion.div
            className="mt-16 flex flex-col md:flex-row md:justify-center gap-8"
            variants={itemVariants}
          >
            {/* Contact Form */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md w-full md:w-4/5"
              variants={itemVariants}
            >
              <motion.form
                ref={form}
                onSubmit={sendEmail}
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
                  className="w-full py-3 bg-[#D4C1EC] text-[#403C5C] rounded-md font-bold hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isLoading ? 1 : 1.05 }}
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                  disabled={isLoading}
                >
                  <motion.div className="flex items-center justify-center gap-2">
                    {isLoading && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <FontAwesomeIcon icon={faSpinner} />
                      </motion.div>
                    )}
                    {isLoading ? "Sending..." : "Send Message"}
                  </motion.div>
                </motion.button>
              </motion.form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3 flex flex-col justify-center"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold text-[#403C5C] mb-4">
                Get in Touch
              </h3>
              {[
                { icon: faMapMarkerAlt, text: "Chandigarh, India" },
                { icon: faPhone, text: "+91 7696316713" },
                { icon: faPhone, text: "+91 7009244033" },
                { icon: faEnvelope, text: "theuncoders@gmail.com" },
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
                  {
                    icon: ["fab", "youtube"],
                    href: "https://www.youtube.com/@Edushpher",
                  },
                  {
                    icon: ["fab", "linkedin"],
                    href: "https://www.linkedin.com/company/edushphere/",
                  },
                  {
                    icon: ["fab", "instagram"],
                    href: "https://www.instagram.com/edushpher_1234?igsh=cDdscjMydzB0NW9u",
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] bg-[#403C5C] rounded-full hover:bg-[#D4C1EC] hover:text-[#403C5C] transition-all"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    target="_blank"
                    rel="noopener noreferrer"
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
