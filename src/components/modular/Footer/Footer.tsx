import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f4f4f4] pt-24 md:pt-32 pb-8 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end relative min-h-[350px]">
        
        {/* Left Column - Links */}
        <div className="flex flex-col space-y-4 mb-16 md:mb-0 z-10">
          <Link href="#" className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition">
            Info
          </Link>
          <Link href="#" className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition">
            Management
          </Link>
          <Link href="#" className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition">
            Contacts
          </Link>
          <Link href="#" className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition pt-6">
            Language (Eng/Esp)
          </Link>
        </div>

        {/* Center - Huge Logo */}
        <div className="md:absolute md:left-1/2 md:bottom-0 md:-translate-x-1/2 flex justify-center w-full md:w-auto z-0 mb-16 md:mb-0">
          <div className="flex items-start">
            {/* Triangle pointing right */}
            <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-black border-b-[15px] border-b-transparent md:border-t-[25px] md:border-l-[40px] md:border-b-[25px] mt-6 md:mt-10 mr-4 md:mr-8 shrink-0"></div>
            
            {/* XIV QR text */}
            <div className="flex flex-col text-8xl md:text-[10rem] lg:text-[14rem] font-black leading-[0.75] tracking-tighter text-black">
              <span>XIV</span>
              <span>QR</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom row - Copyright & Privacy */}
      <div className="max-w-[1400px] mx-auto mt-24 md:mt-32 flex justify-between items-center text-[9px] md:text-[10px] text-gray-400 font-light tracking-wider uppercase border-t border-gray-200 pt-8">
        <p>© 2024 — copyright</p>
        <p>privacy</p>
      </div>
    </footer>
  );
}
