import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

// Validação das props
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
