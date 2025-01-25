import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

import { v4 as uuidV4 } from 'uuid';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);


const LoadingScreen = () => {
    const logoRef = useRef(null);
    const textRef = useRef(null);
  
    useEffect(() => {
      // GSAP animation for the logo
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", repeat: -1, yoyo: true }
      );
  
      // GSAP animation for the text
      gsap.to(textRef.current, {
        text: "Loading IDE Fusion...",
        duration: 3,
        repeat: -1,
        ease: "none",
        repeatDelay: 0.5,
      });
    }, []);
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#10121b]">
        <div className="flex flex-col items-center">
          <h1
            ref={logoRef}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4fb0ff] to-[#3998e6]"
          >
            IDE Fusion
          </h1>
          <p ref={textRef} className="text-gray-300 mt-4 text-sm font-mono"></p>
        </div>
      </div>
    );
  };

const IDEFusion = () => {
  const [isLoading, setIsLoading] = useState(true);
  const taglineRef = useRef(null);
  const logoRef = useRef(null);
  const funFactRef = useRef(null);

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const funFacts = [
    "Developers spend 70% of their time debugging!",
    "The first computer bug was an actual moth.",
    "GitHub has over 100 million repositories.",
    "The first programmer was Ada Lovelace.",
    "JavaScript was created in just 10 days."
  ];

  const generateFunFact = () => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    funFactRef.current.textContent = randomFact;
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
  } 

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(taglineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
      gsap.fromTo(logoRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 });
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#1c1f26]">
      <div className="bg-[#1a1c2c] text-gray-200 p-6 rounded-lg shadow-2xl w-80 sm:w-96">
        <div className="text-center mb-6">
          <h1 ref={logoRef} className="text-4xl font-extrabold text-[#4fb0ff]">IDE Fusion</h1>
          <p ref={taglineRef} className="text-sm text-gray-400 italic">&quot;Code. Collaborate. Conquer.&quot;</p>
        </div>
        <form className="space-y-5">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-300">
              ROOM ID
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="Room Id"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              className="w-full mt-2 p-3 bg-[#252742] border border-[#3c3f5b] rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fb0ff]"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your Name"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="w-full mt-2 p-3 bg-[#252742] border border-[#3c3f5b] rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fb0ff]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#4fb0ff] hover:bg-[#3998e6] text-[#10121b] py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#4fb0ff]/50">
            Join Room
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an invite? Create a{' '}
          <a href="#" onClick={createNewRoom} className="text-[#4fb0ff] hover:underline">
            new room
          </a>
        </p>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">Feeling bored? Try our fun fact generator!</p>
          <button
            onClick={generateFunFact}
            className="mt-2 px-4 py-2 bg-[#4fb0ff] text-[#10121b] rounded-lg font-medium hover:bg-[#3998e6] transition-all duration-200">
            Generate Fun Fact
          </button>
          <p ref={funFactRef} className="text-gray-300 mt-4 text-sm italic"></p>
        </div>
      </div>
    </div>
  );
};

export default IDEFusion;
