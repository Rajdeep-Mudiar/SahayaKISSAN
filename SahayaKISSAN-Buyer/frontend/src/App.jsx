import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Tea = lazy(()=>import("./pages/Tea"))
const Seeds = lazy(()=>import("./pages/Seeds"))
const Cart = lazy(()=>import("./pages/Cart"))
import ProductDetail from './pages/ProductDetail';
import Reviews from './pages/Reviews';
import PageLoader from "./components/PageLoader";

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tea" element={<Tea/>}/>
          <Route path="/seeds" element={<Seeds/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
