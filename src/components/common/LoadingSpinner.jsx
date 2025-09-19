import { motion } from "framer-motion";
import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizes = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-4 border-[#D6CFE9] border-t-[#403C5C] rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "default", "large"]),
  className: PropTypes.string,
};

export default LoadingSpinner;
