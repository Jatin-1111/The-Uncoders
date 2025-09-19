import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { auth } from "../lib/firebase";
import { BookOpen, Users, GraduationCap, ArrowRight } from "lucide-react";

const Content = () => {
  const navigate = useNavigate();

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleNavigateToITContent = () => {
    navigate("/content/it");
  };

  const handleNavigateToGateContent = () => {
    navigate("/content/gate");
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const contentOptions = [
    {
      id: 1,
      title: "IT Content",
      description:
        "Access detailed IT lectures, handwritten notes, and previous year question papers (PYQs) – all available for free to enhance your academic journey.",
      image: "/images/img6.jpeg",
      icon: BookOpen,
      action: handleNavigateToITContent,
      gradient: "from-blue-500 to-purple-600",
      features: ["Video Lectures", "Handwritten Notes", "PYQs", "Free Access"],
    },
    {
      id: 2,
      title: "GATE Preparation",
      description:
        "Ace your GATE exams with curated IT resources, including video lectures, expertly crafted notes, and solved PYQs – tailored to help you succeed.",
      image: "/images/img4.jpg",
      icon: GraduationCap,
      action: handleNavigateToGateContent,
      gradient: "from-green-500 to-teal-600",
      features: [
        "GATE Syllabus",
        "Expert Notes",
        "Practice Tests",
        "Success Tips",
      ],
    },
    {
      id: 3,
      title: "Engage with Seniors",
      description:
        "Learn from experienced seniors through active engagement, mentoring opportunities, and insights that bridge the gap between academics and practical knowledge.",
      image: "/images/img5.jpeg",
      icon: Users,
      action: () => {
        /* TODO: Implement seniors engagement */
      },
      gradient: "from-orange-500 to-red-600",
      features: [
        "Mentorship",
        "Career Guidance",
        "Real Experience",
        "Network Building",
      ],
      comingSoon: true,
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#FAF4ED] via-[#F5F0E8] to-[#E8E3F5] pt-24 pb-16"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div className="text-center mb-16" variants={cardVariants}>
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-[#403C5C] mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Learning Resources
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-[#403C5C] opacity-80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose from our comprehensive collection of study materials designed
            specifically for IT students at UIET Chandigarh
          </motion.p>
        </motion.div>

        {/* Content Cards Grid */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 mb-16"
          variants={pageVariants}
        >
          {contentOptions.map((option) => (
            <motion.div
              key={option.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#D6CFE9] flex flex-col h-full"
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Coming Soon Badge */}
              {option.comingSoon && (
                <div className="absolute top-4 right-4 z-10 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Coming Soon
                </div>
              )}

              {/* Card Header with Gradient */}
              <div
                className={`h-48 bg-gradient-to-br ${option.gradient} p-6 flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center">
                  <option.icon className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">
                    {option.title}
                  </h3>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
              </div>

              {/* Card Content - Flex grow to push button to bottom */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Description */}
                <p className="text-[#403C5C] leading-relaxed text-sm mb-4 flex-grow">
                  {option.description}
                </p>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {option.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-xs text-[#403C5C] opacity-70"
                    >
                      <div className="w-1.5 h-1.5 bg-[#D4C1EC] rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Button - Always at bottom */}
                <motion.button
                  onClick={option.action}
                  disabled={option.comingSoon}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group mt-auto ${
                    option.comingSoon
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#D6CFE9] text-[#403C5C] hover:bg-[#D4C1EC] hover:text-[#FAF4ED] hover:shadow-lg"
                  }`}
                  whileHover={!option.comingSoon ? { scale: 1.02 } : {}}
                  whileTap={!option.comingSoon ? { scale: 0.98 } : {}}
                >
                  <span>
                    {option.comingSoon
                      ? "Coming Soon"
                      : `Access ${option.title}`}
                  </span>
                  {!option.comingSoon && (
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  )}
                </motion.button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#D4C1EC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          className="bg-white/50 backdrop-blur-sm rounded-2xl border border-[#D6CFE9] p-8"
          variants={cardVariants}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "500+", label: "Study Materials", icon: "📚" },
              { number: "50+", label: "Video Lectures", icon: "🎥" },
              { number: "100%", label: "Free Access", icon: "🎓" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="text-2xl">{stat.icon}</div>
                <div className="text-3xl font-bold text-[#403C5C]">
                  {stat.number}
                </div>
                <div className="text-[#403C5C] opacity-70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Content;
