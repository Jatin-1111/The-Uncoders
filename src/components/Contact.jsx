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
  return (
    <div className="bg-[#FAF4ED] min-h-screen">
      {/* Contact Section */}
      <section className="py-12 px-4 md:px-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#403C5C] mb-4">Contact Us</h1>
          <p className="text-lg text-[#403C5C] py-4">
            We&apos;d love to hear from you! Get in touch with us using the form
            below or the contact details provided.
          </p>

          <div className="mt-16 flex flex-col md:flex-row md:justify-center gap-8">
            {/* Contact Form */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/5">
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
            </div>
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-[#403C5C] mb-4">
                Get in Touch
              </h3>
              <motion.p
                className="text-[#403C5C] flex items-center mb-3 justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="mr-2 text-[#403C5C]"
                  />
                </motion.div>
                Chandigarh, India
              </motion.p>
              <motion.p
                className="text-[#403C5C] flex items-center mb-3 justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="mr-2 text-[#403C5C]"
                  />
                </motion.div>
                +91 7909086342
              </motion.p>
              <motion.p
                className="text-[#403C5C] flex items-center mb-3 justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="mr-2 text-[#403C5C]"
                  />
                </motion.div>
                +91 8173970847
              </motion.p>
              <motion.p
                className="text-[#403C5C] flex items-center mb-3 justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="mr-2 text-[#403C5C]"
                  />
                </motion.div>
                edusphere@gmail.com
              </motion.p>
              <h3 className="text-2xl font-bold text-[#403C5C] mt-6 mb-4">
                Follow Us
              </h3>
              <div className="flex justify-center gap-4">
                <motion.a
                  href="https://www.youtube.com/@Edushpher"
                  className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] bg-[#403C5C] rounded-full hover:bg-[#D4C1EC] hover:text-[#403C5C] transition-all"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={["fab", "youtube"]} />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/company/edushphere/"
                  className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] bg-[#403C5C] rounded-full hover:bg-[#D4C1EC] hover:text-[#403C5C] transition-all"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={["fab", "linkedin"]} />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/edushpher_1234?igsh=cDdscjMydzB0NW9u"
                  className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] bg-[#403C5C] rounded-full hover:bg-[#D4C1EC] hover:text-[#403C5C] transition-all"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FontAwesomeIcon icon={["fab", "instagram"]} />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
