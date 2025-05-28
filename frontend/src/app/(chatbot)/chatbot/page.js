'use client';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/chatbot/Chatbotsidebar";
import dynamic from 'next/dynamic';
const ChatBot = dynamic(() => import('@/components/chatbot/chatBot'), {
  ssr: false,
});
function Page() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
      <main className="flex flex-1 h-full overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <ChatBot />
        </div>
      </main>
    </div>
  );
}

export default Page;
