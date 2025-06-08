import Carousel from "./Carousel";
import { motion } from "framer-motion";

function Home() {
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

  return (
    <div className="min-h-screen bg-[#FAF4ED]">
      {/* Hero Section with Carousel */}
      <Carousel />

      {/* About Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 md:px-8 lg:px-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            variants={itemVariants}
          >
            {/* Logo Section */}
            <motion.div
              className="w-full lg:w-1/2 flex justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/images/logo.png"
                alt="The UnCoders Logo"
                className="rounded-3xl w-full h-auto max-w-md lg:max-w-lg object-contain shadow-2xl border-4 border-[#D6CFE9]"
              />
            </motion.div>

            {/* Content Section */}
            <motion.div
              className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
              variants={itemVariants}
            >
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#403C5C] leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                About Us
              </motion.h2>

              <motion.div
                className="prose prose-lg max-w-none text-[#403C5C] leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
              >
                <motion.p className="text-base sm:text-lg">
                  {`At The UnCoders, we recognize the difficulties IT students encounter in finding reliable study resources. Our platform is committed to offering free, convenient access to lectures, notes, and previous year question papers (PYQ) tailored specifically for IT students at UIET Chandigarh, Panjab University.`
                    .split(" ")
                    .map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeInOut",
                          delay: 0.6 + 0.02 * index,
                        }}
                        className="inline-block"
                      >
                        {word}&nbsp;
                      </motion.span>
                    ))}
                </motion.p>

                <motion.p
                  className="text-base sm:text-lg mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  We aim to support their academic journey by providing quality
                  content that simplifies learning and exam preparation. With
                  The UnCoders, students can focus on their studies without
                  worrying about access to essential materials.
                </motion.p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              >
                <motion.a
                  href="/content"
                  className="inline-flex items-center px-8 py-4 bg-[#D4C1EC] text-[#403C5C] font-bold rounded-lg hover:bg-[#B3C7E6] hover:text-[#FAF4ED] transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explore Resources</span>
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 bg-gradient-to-br from-[#F0F0F5] to-[#E8E3F5]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h3 className="text-3xl sm:text-4xl font-bold text-[#403C5C] mb-4">
              Why Choose The UnCoders?
            </h3>
            <p className="text-lg text-[#403C5C] opacity-80 max-w-2xl mx-auto">
              Comprehensive resources designed specifically for IT students at
              UIET Chandigarh
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Free Resources",
                description:
                  "All study materials are completely free to access",
                icon: "🎓",
              },
              {
                title: "Quality Content",
                description:
                  "Curated lectures, notes, and PYQs from reliable sources",
                icon: "📚",
              },
              {
                title: "Easy Access",
                description:
                  "Simple, organized platform for quick resource discovery",
                icon: "⚡",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#D6CFE9]"
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-[#403C5C] mb-3">
                  {feature.title}
                </h4>
                <p className="text-[#403C5C] opacity-80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
