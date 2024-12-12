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
        {/* About Edusphere Section */}
        <motion.div
          className="flex-1 min-w-[250px] text-center md:text-left"
          variants={sectionVariants}
        >
          <h2 className="text-xl md:text-2xl font-bold py-4 text-[#CBAACB]">
            EDUSPHERE
          </h2>
          <p className="text-sm leading-relaxed">
            Creative learning blends innovative techniques with engaging
            content, fostering curiosity and deep understanding in educational
            experiences.
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="flex-1 min-w-[250px] text-center md:text-left"
          variants={sectionVariants}
        >
          <h2 className="text-xl md:text-2xl font-bold py-4 text-[#CBAACB]">
            EDUSPHERE Team
          </h2>
          <p className="text-sm leading-relaxed">
            TEAM Edusphere excels in developing innovative educational
            solutions, combining expertise in technology and design to create
            impactful, engaging learning experiences.
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
              Call +91 7909086342
            </p>
            <p className="text-sm">
              <FontAwesomeIcon icon="phone" className="mr-2" />
              Call +91 8173970847
            </p>
            <p className="text-sm">
              <FontAwesomeIcon icon="envelope" className="mr-2" />
              edusphere@gmail.com
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
              { icon: ["fab", "youtube"], link: "https://www.youtube.com/@Edushpher" },
              { icon: ["fab", "linkedin"], link: "https://www.linkedin.com/company/edushphere/" },
              { icon: ["fab", "instagram"], link: "https://www.instagram.com/edushpher_1234?igsh=cDdscjMydzB0NW9u" },
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
