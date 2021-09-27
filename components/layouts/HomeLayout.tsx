import Navbar from '@components/core/Navbar/Navbar';

const HomeLayout = ({ children }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;
