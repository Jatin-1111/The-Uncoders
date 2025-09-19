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

  // const buttonHover = {
  //   scale: 1.1,
  //   transition: { duration: 0.3, ease: "easeInOut" },
  // };

  return (
    <motion.div
      className="bg-[#FAF4ED] font-sans px-4 sm:px-6 md:px-8 lg:px-12 min-h-svh flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="container flex flex-col md:flex-row justify-center items-center m-auto py-12 gap-8 min-h-[70vh] mt-14"
        variants={itemVariants}
      >
        {/* Logo Section */}
        <motion.div
          className="logo w-full md:w-[50%] flex justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="rounded-3xl w-full h-auto max-w-[300px] md:max-w-[500px] cursor-pointer object-contain shadow-lg"
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

      {/* Independent Made By Section */}
      {/* <motion.div
        className="made-by-section bg-[#F5EFEA] py-12 px-6 mt-10 rounded-lg shadow-md mx-auto max-w-[800px] mb-10"
        variants={itemVariants}
      >
        <div className="text-center">
          <img
            src="/images/img.jpg"
            alt="Your Profile"
            className="w-32 h-32 rounded-full mx-auto border-4 border-[#403C5C] mb-6 shadow-lg object-cover"
          />
          <h3 className="text-2xl font-bold text-[#403C5C] mb-2">
            Hi, I&apos;m Jatin!
          </h3>
          <motion.p className="text-[#403C5C] font-normal leading-relaxed text-sm sm:text-base md:text-lg mb-4">
            {`I'm a passionate web developer and the sole creator of this website. I love building intuitive and impactful digital experiences. Check out my work and connect with me below!`.split(
              " "
            ).map((word, index) => (
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
          <motion.a
            href="https://jatin0111.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#403C5C] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#625C82] transition-colors duration-300"
            whileHover={buttonHover}
          >
            Visit My Portfolio
          </motion.a>
        </div>
      </motion.div> */}
    </motion.div>
  );
};

export default About;
