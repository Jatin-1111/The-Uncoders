import { motion } from "framer-motion";

const About = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const logoHover = {
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  return (
    <motion.div
      className="bg-[#FAF4ED] font-sans px-4 sm:px-6 md:px-8 lg:px-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="container flex flex-col md:flex-row justify-center items-center m-auto py-12 gap-8 min-h-[70vh]"
        variants={itemVariants}
      >
        {/* Logo Section */}
        <motion.div
          className="logo w-full md:w-[50%] flex justify-center"
          whileHover={logoHover}
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="rounded-3xl w-full h-auto max-w-[300px] md:max-w-[500px]  object-contain shadow-md"
          />
        </motion.div>

        {/* About Content */}
        <motion.div
          className="about-content max-w-full md:w-[60%] text-center md:text-left"
          variants={itemVariants}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#403C5C] py-4">
            About Us
          </h2>
          <motion.p className="text-[#403C5C] font-normal leading-relaxed text-sm sm:text-base md:text-lg">
            {`At The UnCoders, we recognize the difficulties IT students encounter in finding reliable study resources. Our platform is committed to offering free, convenient access to lectures, notes, and previous year question papers (PYQ) tailored specifically for IT students at UIET Chandigarh, Panjab University. We aim to support their academic journey by providing quality content that simplifies learning and exam preparation. With The UnCoders, students can focus on their studies without worrying about access to essential materials.`
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
