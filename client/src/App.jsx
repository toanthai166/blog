import { RouterProvider } from "react-router-dom";
import { useRouter } from "./helpers/use-router";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
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
