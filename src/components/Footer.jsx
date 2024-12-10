import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const Footer = () => {
  return (
    <footer className="bg-[#403C5C] text-[#D6CFE9] py-10">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between px-6 gap-10">
        {/* About Edusphere Section */}
        <div className="flex-1 min-w-[250px] m-auto">
          <h2 className="text-2xl font-bold m-auto py-4 text-[#CBAACB]">
            EDUSPHERE
          </h2>
          <p className="text-sm leading-relaxed h-[10vh]">
            Creative learning blends innovative techniques with engaging
            content, fostering curiosity and deep understanding in educational
            experiences.
          </p>
        </div>

        {/* Team Section */}
        <div className="flex-1 min-w-[250px] m-auto">
          <h2 className="text-2xl font-bold m-auto py-4 text-[#CBAACB]">
            EDUSPHERE Team
          </h2>
          <p className="text-sm leading-relaxed h-[10vh]">
            TEAM Edusphere excels in developing innovative educational
            solutions, combining expertise in technology and design to create
            impactful, engaging learning experiences.
          </p>
        </div>

        {/* Contact Section */}
        <div className="flex min-w-[250px] m-auto flex-col mt-4">
          <h2 className="text-2xl font-bold mb-3 text-[#CBAACB]">
            Contact Us
          </h2>
          <div className="h-[10vh]">
            <p className="text-sm flex items-center mb-2">
              <FontAwesomeIcon icon="map-marker-alt" className="mr-2" />{" "}
              Chandigarh
            </p>
            <p className="text-sm flex items-center mb-2">
              <FontAwesomeIcon icon="phone" className="mr-2" /> Call +91
              7909086342
            </p>
            <p className="text-sm flex items-center mb-2">
              <FontAwesomeIcon icon="phone" className="mr-2" /> Call +91
              8173970847
            </p>
            <p className="text-sm flex items-center">
              <FontAwesomeIcon icon="envelope" className="mr-2" />{" "}
              edusphere@gmail.com
            </p>
          </div>
        </div>

        {/* Follow Us Section */}
        <div className="flex-1 min-w-[250px] mx-auto">
          <h2 className="text-2xl font-bold m-auto py-4 text-[#CBAACB]">
            Follow Us
          </h2>
          <div className="flex gap-4">
            <a
              href="https://www.youtube.com/@Edushpher"
              className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] rounded-full hover:bg-[#CBAACB] hover:text-[#403C5C] transition-all"
            >
              <FontAwesomeIcon icon={["fab", "youtube"]} />
            </a>
            <a
              href="https://www.linkedin.com/company/edushphere/"
              className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] rounded-full hover:bg-[#CBAACB] hover:text-[#403C5C] transition-all"
            >
              <FontAwesomeIcon icon={["fab", "linkedin"]} />
            </a>
            <a
              href="https://www.instagram.com/edushpher_1234?igsh=cDdscjMydzB0NW9u"
              className="w-10 h-10 flex items-center justify-center border-2 border-[#CBAACB] text-[#D6CFE9] rounded-full hover:bg-[#CBAACB] hover:text-[#403C5C] transition-all"
            >
              <FontAwesomeIcon icon={["fab", "instagram"]} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
