import About from "./About"
import Carousel from "./Carousel"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function page() {

  return (
    <>
      <Navbar/>
      <Carousel/>
      <About/>
      <Footer/>
    </>
  )
}

export default page