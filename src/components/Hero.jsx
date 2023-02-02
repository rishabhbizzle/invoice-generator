import React from "react";
import Typed from "react-typed";

function Hero() {
  return (
    <div className="text-white mb-10 md:mb-2 bg-[#121212]">
      <div className="max-w-[1050px] w-full h-[50vh] mx-auto text-center flex flex-col justify-center">
        <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-2">
          Welcome to Depo24
        </h1>
        <div className="flex justify-center items-center">
          <p className="md:text-3xl sm:text-2xl text-l font-bold py-4">
            Enjoy hassle free shoping with
          </p>
          <Typed
            className="md:text-3xl sm:text-2xl text-l font-bold md:pl-2 pl-2"
            strings={["multi brand option"]}
            typeSpeed={130}
            backSpeed={140}
            loop
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
