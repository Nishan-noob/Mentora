// to define a general layout

import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col pt-4 md:px-8 px-4 lg:px-16 xl:px-32 bg-[#080d13]">
        {children}
      </div>
      <Footer />
    </div>
  );
};
export default Layout;
