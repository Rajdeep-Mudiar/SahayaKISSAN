import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
const PageNotFound = lazy(()=>import('./pages/PageNotFound'));
const SellForm = lazy(()=>import("./pages/SellForm"));
const MyListing = lazy(()=>import("./pages/MyListing"));
const EditListing = lazy(()=>import("./pages/EditListing"));
const SellerChats = lazy(()=>import("./pages/SellerChats"));
const ChatPage = lazy(()=>import("./pages/ChatPage"));
const Charity = lazy(()=>import("./pages/Charity"));
const CharityList = lazy(()=>import("./pages/CharityList"));

import Auth from "./components/Auth";
import PageLoader from "./components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/charity" element={<Charity />} />

          {/* ✅ ADD THIS LINE */}
          <Route path="/charity/list" element={<CharityList />} />

          <Route
            path="/seller/add-new"
            element={
              <ProtectedRoute>
                <SellForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/my-sells"
            element={
              <ProtectedRoute>
                <MyListing />
              </ProtectedRoute>
            }
          />

          <Route path="/seller/listings/edit/:id" element={<EditListing />} />
          <Route path="/seller/chats" element={<SellerChats />} />
          <Route path="/seller/chat/:roomId" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
