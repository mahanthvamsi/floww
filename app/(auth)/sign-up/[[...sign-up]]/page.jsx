import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4 py-27">
      {/* Ambient orbs */}
      <div className="fixed w-[500px] h-[500px] rounded-full top-[-100px] left-[-100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)" }} />
      <div className="fixed w-[400px] h-[400px] rounded-full bottom-[-80px] right-[-80px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo above card */}
        <div className="text-center mb-6">
          {/* <img src="/logo.png" alt="Floww" className="h-22 w-auto object-contain mx-auto mb-2" /> */}
          <p className="text-slate-600 text-sm">Smart money management, powered by AI</p>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorBackground: "#111827",
              colorInputBackground: "#1a2235",
              colorInputText: "#f1f5f9",
              colorText: "#f1f5f9",
              colorTextSecondary: "#64748b",
              colorPrimary: "#c9a96e",
              colorNeutral: "#f1f5f9",
              colorDanger: "#ef4444",
              borderRadius: "0.75rem",
              fontFamily: "inherit",
              fontSize: "14px",
            },
            elements: {
              card: "bg-[#111827] border border-[#1e2d45] shadow-[0_0_60px_rgba(0,0,0,0.6)]",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-500",
              socialButtonsBlockButton: "border-[#1e2d45] bg-[#1a2235] text-slate-300 hover:bg-[#1e2d45]",
              dividerLine: "bg-[#1e2d45]",
              dividerText: "text-slate-600",
              formFieldLabel: "text-slate-400",
              formFieldInput: "bg-[#1a2235] border-[#1e2d45] text-white focus:border-[#c9a96e]",
              formButtonPrimary: "bg-[#c9a96e] hover:bg-[#a07840] text-[#0a0d14] font-bold",
              footerActionLink: "text-[#c9a96e] hover:text-[#a07840]",
              identityPreviewText: "text-slate-300",
              identityPreviewEditButton: "text-[#c9a96e]",
            },
          }}
        />
      </div>
    </div>
  );
}