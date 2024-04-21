import { BrowserRouter, Routes, Route as AppRoute } from "react-router-dom";
import { ROUTES } from "./routes";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import Loader from "./components/loader";

const client = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <ToastContainer />
          <Suspense fallback={<Loader />}>
            <Routes>
              <AppRoute element="" path="">
                {ROUTES.map(
                  ({
                    route: Route,
                    component: Component,
                    path,
                    exact,
                    ...props
                  }) => (
                    <AppRoute
                      key={path}
                      path={path}
                      exact={exact}
                      element={
                        <Route>
                          <Component {...props} />
                        </Route>
                      }
                    />
                  )
                )}
              </AppRoute>
            </Routes>
          </Suspense>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
