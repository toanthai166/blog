import { RouterProvider } from "react-router-dom";
import { useRouter } from "./helpers/use-router";
import { QueryClient, QueryClientProvider } from "react-query";
import AOS from "aos";
// import "aos/dist/aos.css";
import { useEffect } from "react";
import { ConfigProvider } from "antd";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  const router = useRouter();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: "#9c3a17",
            borderRadius: 4,

            // Alias Token
            // colorBgContainer: "#f6ffed",
          },
        }}
      >
        <RouterProvider
          router={router}
          fallbackElement={<div>Loading route ...</div>}
        />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
