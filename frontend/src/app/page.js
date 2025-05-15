import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import FeatureCards from "@/components/FeatureCards";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Use the Navbar component  */}
      <Navbar />
      {/* Hero Section */}
      <section id="home" className="relative py-16 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Left Illustration */}
            <div className="relative">
              <Image
                src="/images/man-hugging-heart.svg"
                alt="Person holding heart"
                width={250}
                height={250}
                className="mx-auto"
              />
              {/* Decorative Left Icons */}
              <span className="absolute top-10 left-16 text-xl">✦</span>
              <span className="absolute top-20 left-8 text-lg">✧</span>
              <span className="absolute bottom-10 left-10 text-xl">♡</span>
            </div>

            {/* Center Text */}
            <div className="text-center">
              <h2 className="text-4xl font-bold leading-tight md:text-5xl">
                A Gentle Companion
                <br />
                for Your Mental
                <br />
                Wellness Journey
              </h2>
              <p className="max-w-md mx-auto mt-6 text-lg">
                <span className="font-medium">Empati</span> helps you understand emotions, log feelings, and receive
                mental health recommendations.
              </p>
              <div className="mt-8">
                <Link href="#features" className="inline-flex flex-col items-center">
                  <span className="px-6 py-2 mb-2 font-medium">Explore Empati!</span>
                  <ArrowDown className="animate-bounce" />
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <Image
                src="/images/woman-hugging-heart.svg"
                alt="Person holding heart"
                width={250}
                height={250}
                className="mx-auto"
              />
              {/* Decorative Right Icons */}
              <span className="absolute top-10 right-16 text-xl">★</span>
              <span className="absolute bottom-20 right-10 text-xl">◡</span>
              <span className="absolute bottom-10 right-20 text-xl">⌇</span>
            </div>
          </div>
        </div>

        {/* Global Decorative SVGs */}
        <div className="absolute top-20 right-0 pointer-events-none z-0">
          <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 40C30 10 70 30 90 5" stroke="black" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 pointer-events-none z-0">
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10C50 50 100 20 140 80" stroke="black" strokeWidth="1" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center">Our Features</h2>
          <p className="mt-2 text-center">Start your journey with Empati!</p>

          <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2 items-center">
            <div className="relative">
              <Image
                src="/images/laptop-woman.svg"
                alt="Person on laptop"
                width={400}
                height={400}
                className="mx-auto"
              />
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-10">
                  <Image
                    src="/images/elmen deket laptop atas.svg"
                    alt="Elemen Near laptop"
                    width={100}
                    height={10}
                    className="mx-auto"
                  />
                    </div>
                    <div className="absolute bottom-10 left-10">
                  <Image
                    src="/images/burung.svg"
                    alt="Birds"
                    width={100}
                    height={10}
                    className="mx-auto"
                  />
                </div>
              </div>
            </div>
            <FeatureCards />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
