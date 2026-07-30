import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import TodoList from "./projects/Todo/TodoList";
import TodoForm from "./projects/Todo/TodoForm";
import TodoEdit from "./projects/Todo/TodoEdit";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./features/dashboard/Dashboard";
import Profile from "./features/auth/pages/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  return (
    <>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: "#16a34a",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Protected */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/add" element={<TodoForm />} />
          <Route path="/todo/:id" element={<TodoEdit />} />
        </Route>

        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
