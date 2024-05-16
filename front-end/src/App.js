import MainLayout from "./layouts/MainLayout/MainLayout";
import { useState } from "react";
import LoginForm from "./container/LoginForm/LoginForm";

function App() {
  const [login, setIsLogin] = useState(false);
  return <> {login ? <MainLayout setIsLogin={setIsLogin} /> : <LoginForm setIsLogin={setIsLogin}></LoginForm>}</>;
}

export default App;
