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

  // const textHover = {
  //   scale: 1.02,
  //   transition: { duration: 0.3, ease: "easeInOut" },
  // };

  return (
    <motion.div
      className="bg-[#FAF4ED] font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="container flex justify-center items-center m-auto py-24 gap-8 h-[70vh] flex-wrap md:flex-nowrap"
        variants={itemVariants}
      >
        {/* Logo Section */}
        <motion.div
          className="logo w-[80vw] md:w-[30vw]"
          whileHover={logoHover}
        >
          <img src="/images/logo.jpg" alt="Logo" className="rounded-3xl" />
        </motion.div>

        {/* About Content */}
        <motion.div
          className="about-content h-auto max-w-[70vw]"
          variants={itemVariants}
        >
          <h2
            className="text-center font-extrabold text-3xl py-4 md:text-left text-[#403C5C]"
            // whileHover={textHover}
          >
            About Us
          </h2>
          <motion.p
            className="text-left text-[#403C5C] w-full md:w-[30vw] font-normal leading-relaxed"
            // whileHover={textHover}
          >
            At EDUSPHERE, we recognize the difficulties IT students encounter in
            finding reliable study resources. Our platform is committed to
            offering free, convenient access to lectures, notes, and previous
            year question papers (PYQ) tailored specifically for IT students at
            UIET Chandigarh, Panjab University. We aim to support their academic
            journey by providing quality content that simplifies learning and
            exam preparation. With EDUSPHERE, students can focus on their
            studies without worrying about access to essential materials.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
