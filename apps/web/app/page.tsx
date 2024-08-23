/* eslint-disable no-extra-boolean-cast */
import { redirect } from "next/navigation";
import LoginForm from "./components/module/LoginForm";
import Token from "./utils/Token";

export default function Home() {
  if (!!Token.get().accessToken) {
    redirect("/tasks");
  }
  return (
    <div className="w-full h-full flex justify-center items-center flex-col min-h-screen">
      <div className="text-4xl">Login</div>
      <LoginForm />
    </div>
  );
}
