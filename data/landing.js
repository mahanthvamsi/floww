import {
    BarChart3,
    Receipt,
    PieChart,
    CreditCard,
    ShieldCheck,
    Zap,
  } from "lucide-react";
  
  // Stats Data — honest launch messaging instead of inflated fake numbers
  export const statsData = [
    {
      value: "€0",
      label: "Always Free to Start",
    },
    {
      value: "AI",
      label: "Powered Insights",
    },
    {
      value: "< 2min",
      label: "Setup Time",
    },
    {
      value: "100%",
      label: "Private & Secure",
    },
  ];
  
  // Features Data
  export const featuresData = [
    {
      icon: <BarChart3 className="h-8 w-8 text-[#c9a96e]" />,
      title: "Smart Analytics",
      description:
        "Visualise exactly where your money goes with AI-driven breakdowns by category, time period, and account.",
    },
    {
      icon: <Receipt className="h-8 w-8 text-[#c9a96e]" />,
      title: "Receipt Scanner",
      description:
        "Snap a photo of any receipt and let Floww extract the amount, merchant, and category automatically.",
    },
    {
      icon: <PieChart className="h-8 w-8 text-[#c9a96e]" />,
      title: "Budget Goals",
      description:
        "Set monthly budgets per category. Floww tracks your progress in real time and alerts you before you overspend.",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-[#c9a96e]" />,
      title: "Multi-Account Support",
      description:
        "Add your current account, savings, and credit cards. Get a unified view of your complete financial picture.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-[#c9a96e]" />,
      title: "Recurring Transactions",
      description:
        "Never miss a subscription or recurring expense. Floww logs them automatically so your history is always complete.",
    },
    {
      icon: <Zap className="h-8 w-8 text-[#c9a96e]" />,
      title: "Monthly AI Reports",
      description:
        "At the end of every month, receive a personalised report with AI-generated observations and actionable advice.",
    },
  ];
  
  // How It Works Data
  export const howItWorksData = [
    {
      icon: <CreditCard className="h-8 w-8 text-[#c9a96e]" />,
      title: "1. Create Your Account",
      description:
        "Sign up in seconds. Add your first account — savings, current, or credit card — and you're ready to go.",
    },
    {
      icon: <Receipt className="h-8 w-8 text-[#c9a96e]" />,
      title: "2. Log Your Transactions",
      description:
        "Manually enter transactions or scan receipts with your camera. Floww categorises everything automatically.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-[#c9a96e]" />,
      title: "3. Get Clear Insights",
      description:
        "Your dashboard surfaces spending trends, budget progress, and AI-generated insights tailored to your habits.",
    },
  ];
  
  // Testimonials Data — realistic, relatable personas (no randomuser.me dependency)
  export const testimonialsData = [
    {
      name: "Priya Nair",
      role: "Freelance Designer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=b6e3f4",
      quote:
        "I used to dread opening my bank app. Floww made it actually enjoyable — the monthly AI report showed me I was spending €180/month on subscriptions I'd forgotten about.",
    },
    {
      name: "Jonas Weber",
      role: "Software Engineer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jonas&backgroundColor=d1f4e0",
      quote:
        "The receipt scanner is genuinely impressive. I scan grocery receipts in under 10 seconds and everything is categorised correctly. It's the feature I didn't know I needed.",
    },
    {
      name: "Amara Osei",
      role: "Postgraduate Student",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=amara&backgroundColor=ffd5dc",
      quote:
        "Managing money on a student budget is hard. The budget alert emails keep me on track without me having to constantly check the app. Super helpful for tight months.",
    },
  ];