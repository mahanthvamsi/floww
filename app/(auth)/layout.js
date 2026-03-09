const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;