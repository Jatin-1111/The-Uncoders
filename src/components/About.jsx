const About = () => {
  return (
    <div className="bg-[#FAF4ED] font-sans">
      <div className="container flex justify-center items-center m-auto py-24 gap-8 h-[70vh] flex-wrap md:flex-nowrap">
        <div className="logo w-[80vw] md:w-[30vw]">
          <img src="/images/logo.jpg" alt="Logo" className="rounded-3xl" />
        </div>
        <div className="about-content h-auto max-w-[70vw]">
          <h2 className="text-center font-extrabold text-3xl py-4 md:text-left text-[#403C5C]">
            About Us
          </h2>
          <p className="text-left text-[#403C5C] w-full md:w-[30vw] font-normal leading-relaxed">
            At EDUSPHERE, we recognize the difficulties IT students encounter in finding
            reliable study resources. Our platform is committed to offering free,
            convenient access to lectures, notes, and previous year question papers (PYQ)
            tailored specifically for IT students at UIET Chandigarh, Panjab University. We
            aim to support their academic journey by providing quality content that
            simplifies learning and exam preparation. With EDUSPHERE, students can focus on
            their studies without worrying about access to essential materials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
