"use client";
import React, { useState, useEffect, useRef } from "react";

const exercises = {
    quick: {
      title: "Quick Relaxation",
      duration: 60,
      description: "A short pause to help you reset and breathe easy.",
      img: "/images/quick.png",
    },
    deep: {
      title: "Deep Calm",
      duration: 180,
      description: "Sink into stillness and let your worries fade away.",
      img: "/images/deep.png",
    },
    focus: {
      title: "Focus Boost",
      duration: 300,
      description: "Ground yourself and sharpen your focus with mindful breathing.",
      img: "/images/focus.png",
    },
  };
  

export default function BreathingExercise() {
  const [selected, setSelected] = useState("quick");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);

  const startExercise = () => {
    setStarted(true);
    setIsPaused(false);
    setCompleted(false);
    setTimeLeft(exercises[selected].duration);
  };

  const pauseResumeExercise = () => {
    setIsPaused((prev) => !prev);
  };

  const resetExercise = () => {
    clearInterval(intervalRef.current);
    setStarted(false);
    setIsPaused(false);
    setCompleted(false);
    setTimeLeft(null);
  };

  useEffect(() => {
    if (started && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setStarted(false);
            setCompleted(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [started, isPaused]);

  return (
    <div className="p-6 bg-[#fffaf4] text-[#2f2f2f] font-spaceGrotesk " style={{ height: "calc(100vh - 80px" }}>
      <div className="flex flex-col md:flex-row gap-8">
      <div className="bg-white p-4 py-6 rounded-2xl min-h-[650px] w-full md:w-[350px] border border-black">
          <h2 className="font-bold text-xl mb-1">Breathing Exercise</h2>
          <p className="mb-4 text-base">Sometimes, peace starts with a breath. Let’s take it together.</p>
          {Object.entries(exercises).map(([key, value]) => (
            <div
                key={key}
                onClick={() => setSelected(key)}
                className={`p-3 border rounded-xl mb-2 cursor-pointer min-h-[165px] flex gap-4 items-center ${
                selected === key ? "bg-[#fffaf4] border-black" : "bg-white border-black"
                }`}
            >
                <img
                src={value.img}
                alt={`${value.title} icon`}
                className="w-16 h-16 object-contain"
                />

                <div>
                <h3 className="font-bold">
                    {value.title} ({value.duration / 60} min)
                </h3>
                <p className="text-base text-gray-600">{value.description}</p>
                </div>
            </div>
            ))}
        </div>

        <div className="bg-white flex-1 p-4 rounded-2xl shadow text-center border border-black flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold mb-1">{exercises[selected].title}</h2>
          <p className="mb-4 text-base">{exercises[selected].description}</p>

          {!started && !completed && (
            <button
              onClick={startExercise}
              className="bg-black text-white px-4 py-2 rounded-full"
            >
              Start
            </button>
          )}

          {started && (
            <>
              <div className="relative w-64 h-64 mx-auto my-6 animate-breathe">
                <div className="absolute inset-0 rounded-full bg-[#FCEEB5] opacity-30"></div>
                <div className="absolute inset-5 rounded-full bg-[#FCEEB5] opacity-50"></div>
                <div className="absolute inset-10 rounded-full bg-[#FCEEB5] opacity-80 flex items-center justify-center">
                    <div className="text-4xl font-bold text-black">
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                    </div>
                </div>
                </div>

              <button
                onClick={pauseResumeExercise}
                className="bg-[#C5E1A5] text-black border border-black px-4 py-2 rounded-full mt-2"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
            </>
          )}

          {completed && (
            <div className="mt-6 text-black font-bold text-lg">
              🎉 Well done! You've completed your breathing session.
            </div>
          )}

          {(started || completed) && (
            <button
              onClick={resetExercise}
              className="bg-black border border-black text-white px-4 py-2 rounded-full mt-4"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
