// components/FeatureCards.js
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Chatbot',
    description: 'Get emotional support and guidance anytime through an AI-powered chat',
    image: '/images/chatbot logo.svg',
    link: '/chatbot',
  },
  {
    title: 'Daily Journal',
    description: 'Reflect on your thoughts and track your mental well-being effortlessly',
    image: '/images/daily journal icon.svg',
    link: '/daily-journal',
  },
  {
    title: 'Breathing Exercise',
    description: 'Practice guided breathing to reduce stress and improve focus',
    image: '/images/breathing exercise icon.svg',
    link: '/breathing-exercise',
  },
];

export default function FeatureCards() {
  return (
    <div className="flex flex-col w-full gap-4 p-2 md:p-4">
      {features.map((feature, index) => (
        <Link href={feature.link} key={index}>
        <div
          key={index}
          className="flex items-center w-full max-w-xl gap-5 p-6 transition-all bg-white border-[3.5px] border-black rounded-xl shadow hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="flex-shrink-0">
            <Image src={feature.image} alt={`${feature.title} Icon`} width={40} height={40} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </div>
        </Link>
      ))}
    </div>
  );
}
