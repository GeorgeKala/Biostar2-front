
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'

const AuthenticatedLayout = ({children}) => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="h-full w-full">{children}</div>
      </div>
    </div>
  );
}

export default AuthenticatedLayout