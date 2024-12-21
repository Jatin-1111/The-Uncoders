import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Add icons to the FontAwesome library
library.add(faArrowLeft, faArrowRight);

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const slides = [
    { id: "last", src: "/images/img3.jpg", alt: "Image 3", clone: true },
    { id: "1", src: "/images/img1.jpg", alt: "Image 1" },
    { id: "2", src: "/images/img2.jpg", alt: "Image 2" },
    { id: "3", src: "/images/img3.jpg", alt: "Image 3" },
    { id: "first", src: "/images/img1.jpg", alt: "Image 1", clone: true },
  ];

  useEffect(() => {
    const autoSlide = setInterval(() => {
      moveToSlide(currentIndex === slides.length - 2 ? 1 : currentIndex + 1);
    }, 10000);

    return () => clearInterval(autoSlide);
  }, [currentIndex]);

  const moveToSlide = (index) => {
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="relative overflow-hidden w-full h-[100vh] mx-auto">
      {/* Carousel Track */}
      <AnimatePresence initial={false} custom={1}>
        <motion.div
          key={currentIndex}
          className="absolute w-full h-full"
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ backgroundColor: "#FAF4ED" }}
        >
          <img
            src={slides[currentIndex].src}
            alt={slides[currentIndex].alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Carousel Overlay */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-opacity-60 bg-[#403C5C] text-[#D6CFE9] px-6 py-4 rounded">
        <h1 className="text-3xl font-bold text-[#CBAACB]">The UnCoders</h1>
        <p className="mt-4 text-lg text-[#D6CFE9]">
          Welcome to The UnCoders – Uncode Your Coding Potential!
        </p>
        <button className="mt-4 bg-[#D4C1EC] text-[#403C5C] px-4 py-2 rounded font-semibold hover:bg-[#CBAACB] hover:text-white">
          <a href="/login">Join Us</a>
        </button>
      </div>

      {/* Navigation Buttons */}
      <motion.button
        className="absolute left-5 top-1/2 transform bg-[#403C5C] bg-opacity-60 text-[#D6CFE9] rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#CBAACB] hover:text-white transition-colors"
        onClick={() =>
          moveToSlide(currentIndex === 0 ? slides.length - 2 : currentIndex - 1)
        }
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon="arrow-left" className="text-2xl" />
      </motion.button>

      <motion.button
        className="absolute right-5 top-1/2 transform bg-[#403C5C] bg-opacity-60 text-[#D6CFE9] rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#CBAACB] hover:text-white transition-colors"
        onClick={() =>
          moveToSlide(currentIndex === slides.length - 2 ? 1 : currentIndex + 1)
        }
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon="arrow-right" className="text-2xl" />
      </motion.button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.slice(1, slides.length - 1).map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex - 1 ? "bg-[#403C5C]" : "bg-[#CBAACB]"
            }`}
            whileHover={{ scale: 1.3 }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
