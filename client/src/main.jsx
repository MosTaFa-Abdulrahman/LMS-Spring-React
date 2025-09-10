import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./i18n";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AuthContextProvider>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </AuthContextProvider>
  </ThemeProvider>
);
