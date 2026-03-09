import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { checkUser } from "@/lib/checkUser";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Floww — Smart Finance Tracker",
  description: "AI-powered personal finance management. Track expenses, scan receipts, and get intelligent insights — all in one place.",
};

async function RootLayoutInner({ children }) {
  await checkUser();
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Header />
        <main className="min-h-screen page-enter">
          {children}
        </main>
        <Toaster richColors theme="dark" />
        <footer className="bg-[#0d1117] border-t border-[#1e2d45] py-14">
          <div className="container mx-auto px-4 text-center">
            <img
              src="/logo.png"
              alt="Floww"
              className="h-12 w-auto object-contain mx-auto mb-4"
            />
            <p className="text-sm text-slate-600 mb-6">Smart money management, powered by AI.</p>
            <div className="w-12 h-px bg-[#1e2d45] mx-auto mb-6" />
            <p className="text-xs text-slate-700">
              Built by{" "}
              <span className="text-slate-500">Mahanth Vamsi</span>
              {" "}·{" "}
              <a href="mailto:mahanthvamsis1@gmail.com" className="text-slate-500 hover:text-[#c9a96e] transition-colors">
                mahanthvamsis1@gmail.com
              </a>
            </p>
            <p className="text-xs text-slate-800 mt-3">© {new Date().getFullYear()} Floww. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <RootLayoutInner>{children}</RootLayoutInner>
    </ClerkProvider>
  );
}