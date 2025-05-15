import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastProvider";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const space_grotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["700", "400", "600"],
});

export const metadata = {
  title: "Empati",
  description: "Senpro TETI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${space_grotesk.variable} ${poppins.variable} antialiased font-spaceGrotesk`}
      >
        <Navbar className="sticky top-0 z-50" />
        <main>{children}</main>
        <ToastProvider />
      </body>
    </html>
  );
}
