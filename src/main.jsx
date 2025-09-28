import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import queryClient from "@/services/queryClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./index.css";
import App from "./route";
import { QueryClientProvider } from "@tanstack/react-query";
import bootstrap from "@/bootstrap";

(async () => {
  await bootstrap();

  createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
})();
