import ChatBot from "@/components/chatbot/chatBot";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Chatbotsidebar";

function Page() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
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
