import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="relative overflow-hidden w-full h-[900px] mx-auto">
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
        <h1 className="text-3xl font-bold text-[#CBAACB]">EDUSPHERE</h1>
        <p className="mt-4 text-lg text-[#D6CFE9]">
          Welcome to Edusphere – Where Education Meets Innovation and Your
          Learning Journey Begins!
        </p>
        <button className="mt-4 bg-[#D4C1EC] text-[#403C5C] px-4 py-2 rounded font-semibold hover:bg-[#CBAACB] hover:text-white">
          <a href="https://chat.whatsapp.com/GjMlu4QI4d83P4Tc9dwNMA">Join Us</a>
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-[#403C5C] bg-opacity-50 text-[#D6CFE9] rounded p-2 hover:bg-[#CBAACB] hover:text-white"
        onClick={() =>
          moveToSlide(currentIndex === 0 ? slides.length - 2 : currentIndex - 1)
        }
      >
        &lt;
      </button>
      <button
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-[#403C5C] bg-opacity-50 text-[#D6CFE9] rounded p-2 hover:bg-[#CBAACB] hover:text-white"
        onClick={() =>
          moveToSlide(currentIndex === slides.length - 2 ? 1 : currentIndex + 1)
        }
      >
        &gt;
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.slice(1, slides.length - 1).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex - 1 ? "bg-[#403C5C]" : "bg-[#CBAACB]"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
