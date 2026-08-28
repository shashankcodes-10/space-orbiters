import React from "react";
import Logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
// import Spaces from "../Spaces";

const Navbar = () => {
  return (
    <>
      <nav
        data-aos="fade-down"
        className="fixed top-0 right-0 w-full z-40 "
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-0 text-white font-bold text-2xl">
              <img src={Logo} alt="" className="w-20" />
              <span>Space Orbiters</span>
            </div>
            <div className="text-white hidden sm:block ">
              <ul className="flex items-center gap-5 text-xl py-2  ">
                <li>
                <Link to="/images">Planetary</Link>
                </li>
                <li>
                  <a href="http://localhost:5174/">Heliocentric system</a>
                </li>
                <li>
                  <a href="http://localhost:5175/">Chat</a>
                </li>
                <li>
                  <Link to="/Spaces">Space Exploration History</Link>
                </li>
                <li>
                  <Link to="/Satellite">Satellite</Link>
                </li>
                <li>
                  <Link to="/MainBodies">Celestial Bodies</Link>
                </li>
              </ul>
            </div>
            <div>
              <a href="https://chat.openai.com/g/g-U6pmqv8AC-cosmoquest" target="_blank" rel="noreferrer">
              <button className=" text-white border-2 border-white px-3 httpspy-1 rounded-md">
                MyBuddy
              </button>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
