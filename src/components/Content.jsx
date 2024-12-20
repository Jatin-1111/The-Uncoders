import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Content = () => {
  const navigate = useNavigate();

  const handleNavigateToITContent = () => {
    navigate("/Content/ITContent");
  };
  const handleNavigateTogateContent = () => {
    navigate("/Content/GateContent");
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 }, // Initial state
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }, // Final state
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }, // Exit state
  };

  return (
    <motion.div
      className="bg-[#FAF4ED] min-h-screen px-6 md:px-32 md:py-32"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className="container mx-auto py-16 md:scale-110 mt-5">
        {/* Heading */}
        <div className="text-center text-3xl md:text-5xl font-bold text-[#403C5C]">
          <h2>Content</h2>
        </div>

        {/* Card Container */}
        <div className="flex flex-col md:flex-row justify-center flex-wrap gap-6 md:gap-10 mt-10 md:mt-16">
          {/* Card 1 */}
          <motion.div
            className="flex flex-col justify-between h-auto md:h-[30vh] w-full md:w-[20vw] p-5 border border-[#CBAACB] rounded-lg bg-white text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#403C5C]"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="text-[#403C5C] text-lg md:text-xl font-semibold p-3">
              Comprehensive IT Content
            </h4>
            <p className="text-[#403C5C] text-sm md:text-base flex-1 p-1">
              Access detailed IT lectures, handwritten notes, and previous year
              question papers (PYQs) – all available for free to enhance your
              academic journey.
            </p>
            <button
              onClick={handleNavigateToITContent}
              className="bg-[#D6CFE9] text-[#403C5C] font-bold py-2 px-4 rounded-md hover:bg-[#D4C1EC] hover:text-[#FAF4ED] transition-colors"
            >
              Access IT Resources
            </button>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="flex flex-col justify-between h-auto md:h-[30vh] w-full md:w-[20vw] p-5 border border-[#CBAACB] rounded-lg bg-white text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#403C5C]"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="text-[#403C5C] text-lg md:text-xl font-semibold p-3">
              GATE Preparation
            </h4>
            <p className="text-[#403C5C] text-sm md:text-base flex-1 p-3">
              Ace your GATE exams with curated IT resources, including video
              lectures, expertly crafted notes, and solved PYQs – tailored to
              help you succeed.
            </p>
            <button 
            onClick={handleNavigateTogateContent}
            className="bg-[#D6CFE9] text-[#403C5C] font-bold py-2 px-4 rounded-md hover:bg-[#D4C1EC] hover:text-[#FAF4ED] transition-colors">
              Start Your GATE Journey
            </button>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="flex flex-col justify-between h-auto md:h-[30vh] w-full md:w-[20vw] p-5 border border-[#CBAACB] rounded-lg bg-white text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#403C5C]"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="text-[#403C5C] text-lg md:text-xl font-semibold p-3">
              Engage with Seniors
            </h4>
            <p className="text-[#403C5C] text-sm md:text-base flex-1 p-3">
              Learn from experienced seniors through active engagement,
              mentoring opportunities, and insights that bridge the gap between
              academics and practical knowledge.
            </p>
            <button className="bg-[#D6CFE9] text-[#403C5C] font-bold py-2 px-4 rounded-md hover:bg-[#D4C1EC] hover:text-[#FAF4ED] transition-colors">
              Engage with Seniors Now
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Content;
