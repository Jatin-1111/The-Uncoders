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

const Footer = () => {
  // Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: (i) => ({
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.5, type: "spring" },
    }),
    hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
  };

  return (
    <motion.footer
      className="bg-[#403C5C] text-[#D6CFE9] py-5 md:py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-center md:justify-between px-6 gap-10">
        {/* About The UnCoders Section */}
        <motion.div
          className="flex-1 min-w-[250px] text-center md:text-left"
          variants={sectionVariants}
        >
          <h2 className="text-xl md:text-2xl font-bold py-4 text-[#CBAACB]">
            The UnCoders
          </h2>
          <p className="text-sm leading-relaxed">
            Creative learning combines innovative methods with engaging content
            to spark curiosity and cultivate a deeper understanding in
            educational experiences.
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="flex-1 min-w-[250px] text-center md:text-left"
          variants={sectionVariants}
        >
          <h2 className="text-xl md:text-2xl font-bold py-4 text-[#CBAACB]">
            The UnCoders Team
          </h2>
          <p className="text-sm leading-relaxed">
            TEAM The UnCoders creates innovative educational solutions that
            blend technology and design to deliver engaging, impactful learning
            experiences for student success.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="flex-1 min-w-[250px] text-center md:text-left"
          variants={sectionVariants}
        >
          <h2 className="text-xl md:text-2xl font-bold py-4 text-[#CBAACB]">
            Contact Us
          </h2>
          <div>
            <p className="text-sm">
              <FontAwesomeIcon icon="map-marker-alt" className="mr-2" />
              Chandigarh
            </p>
            <p className="text-sm">
              <FontAwesomeIcon icon="phone" className="mr-2" />
              Call +91 7696316713
            </p>
            <p className="text-sm">
              <FontAwesomeIcon icon="phone" className="mr-2" />
              Call +91 7009244033
            </p>
            <p className="text-sm">
              <FontAwesomeIcon icon="envelope" className="mr-2" />
              theuncoders@gmail.com
            </p>
          </div>
        </motion.div>

        {/* Follow Us Section */}
        <motion.div
          className="flex-1 min-w-[250px] text-center"
          variants={sectionVariants}
        >
          <h2 className="text-xl md:text-2xl font-bold py-4 text-[#CBAACB]">
            Follow Us
          </h2>
          <div className="flex justify-center gap-4">
            {[
              {
                icon: ["fab", "youtube"],
                link: "",
              },
              {
                icon: ["fab", "linkedin"],
                link: "",
              },
              {
                icon: ["fab", "instagram"],
                link: "",
              },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.link}
                className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] rounded-full hover:bg-[#CBAACB] hover:text-[#403C5C] transition-all"
                variants={iconVariants}
                custom={i}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
              >
                <FontAwesomeIcon icon={social.icon} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
