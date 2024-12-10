import { useState, useEffect, useRef } from "react";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const trackRef = useRef(null);
  const autoSlideRef = useRef(null); // Reference for autoSlide interval
  const slides = [
    { id: "last", src: "/images/img3.jpg", alt: "Image 3", clone: true },
    { id: "1", src: "/images/img1.jpg", alt: "Image 1" },
    { id: "2", src: "/images/img2.jpg", alt: "Image 2" },
    { id: "3", src: "/images/img3.jpg", alt: "Image 3" },
    { id: "first", src: "/images/img1.jpg", alt: "Image 1", clone: true },
  ];

  const updateTrackPosition = () => {
    const slideWidth = trackRef.current.children[0].getBoundingClientRect().width;
    trackRef.current.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  };

  const moveToSlide = (index) => {
    setCurrentIndex(index);
    const slideWidth = trackRef.current.children[0].getBoundingClientRect().width;
    trackRef.current.style.transition = "transform 0.5s ease-in-out";
    trackRef.current.style.transform = `translateX(-${slideWidth * index}px)`;
  };

  const handleTransitionEnd = () => {
    if (slides[currentIndex].clone) {
      trackRef.current.style.transition = "none";
      const newIndex = slides[currentIndex].id === "last" ? slides.length - 2 : 1;
      setCurrentIndex(newIndex);
      updateTrackPosition();
    }
  };

  useEffect(() => {
    updateTrackPosition();

    autoSlideRef.current = setInterval(() => {
      const nextIndex = currentIndex === slides.length - 1 ? 1 : currentIndex + 1;
      moveToSlide(nextIndex);
    }, 10000);

    return () => clearInterval(autoSlideRef.current); // Clean up on unmount
  }, [currentIndex]);

  useEffect(() => {
    window.addEventListener("resize", updateTrackPosition);
    return () => window.removeEventListener("resize", updateTrackPosition);
  }, []);

  return (
    <div
      className="relative overflow-hidden w-full h-[900px] mx-auto"
      onMouseEnter={() => clearInterval(autoSlideRef.current)} // Stop auto-slide on hover
      onMouseLeave={() => {
        autoSlideRef.current = setInterval(() => {
          const nextIndex = currentIndex === slides.length - 1 ? 1 : currentIndex + 1;
          moveToSlide(nextIndex);
        }, 10000); // Restart auto-slide on mouse leave
      }}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        ref={trackRef}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="flex-none w-full h-[900px]">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
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
          moveToSlide(currentIndex === slides.length - 1 ? 1 : currentIndex + 1)
        }
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;