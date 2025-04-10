import SetupCard from "./SetupCard";

import apartment1 from "../../assets/apartments1.jpg";
import apartment2 from "../../assets/apartments2.jpg";
import apartment3 from "../../assets/apartments3.jpg";

const Apartments = () => {
  return (
    <section className="my-12 sm:my-16 md:my-24">
      <h1 className=" text-2xl md:text-4xl text-[#222222] font-medium text-center">
        Introducing ApnaPG friendly apartments
      </h1>
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
        <SetupCard
          img={apartment1}
          heading={"Indra Apartments"}
          subHeading={"New Delhi, Delhi"}
        />
        <SetupCard
          img={apartment2}
          heading={"Apna Residency"}
          subHeading={"Mumbai, Maharashtra"}
        />
        <SetupCard
          img={apartment3}
          heading={"Greenwood Heights"}
          subHeading={"Bangalore, Karnataka"}
        />
      </div>
      <h6 className="text-base sm:text-lg md:text-xl text-center text-[#222222] sm:w-[80%] mx-auto">
        We’ve partnered with apartment buildings across the US that let you rent
        a place to live and ApnaPG it part-time. Explore available apartments
        and find out what you can earn.
      </h6>
    </section>
  );
};

export default Apartments;
