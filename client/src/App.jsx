import { RouterProvider } from "react-router-dom";
import { useRouter } from "./helpers/use-router";
import { QueryClient, QueryClientProvider } from "react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    AOS.init();
  }, []);

  const router = useRouter();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        fallbackElement={<div>Loading route ...</div>}
      />
    </QueryClientProvider>
  );
}

export default App;
