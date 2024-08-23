import React from "react";
import RegisterForm from "../components/module/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col min-h-screen">
      <div className="text-4xl">Register</div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
