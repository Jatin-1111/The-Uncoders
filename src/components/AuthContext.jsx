import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { auth } from "../firebase"; // Replace with your Firebase configuration

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { currentUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Validate prop types
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
