import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Tea = lazy(()=>import("./pages/Tea"))
const Seeds = lazy(()=>import("./pages/Seeds"))
const Cart = lazy(()=>import("./pages/Cart"))
const Schemes = lazy(()=>import("./pages/Schemes"))
const ChatPage = lazy(()=>import("./pages/ChatPage"))
import GlobalVoicePlayer from "./components/GlobalVoicePlayer";



import ProductDetail from './pages/ProductDetail';
import Reviews from './pages/Reviews';
import PageLoader from "./components/PageLoader";
import Auth from "./components/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import IoTForm from "./pages/IoTForm";
import IoTDashBoard from "./pages/IotDashBoard";

function App() {
  return (
    <>
    <GlobalVoicePlayer />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />  
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/tea" element={
            <ProtectedRoute>
              <Tea/>
            </ProtectedRoute>
          }/>
          <Route path="/seeds" element={
            <ProtectedRoute>
              <Seeds/>
            </ProtectedRoute>
          }/>
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart/>
            </ProtectedRoute>
          }/>
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/chat/:listingId" element={<ChatPage />} />
          <Route path="/sensors-iot" element={<IoTForm />} /> 
          <Route path="/dashboard" element={<IoTDashBoard />} />


        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
    </>
    
  );
}

export default App;
