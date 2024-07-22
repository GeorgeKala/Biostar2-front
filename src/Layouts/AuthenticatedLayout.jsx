
import Navbar from './Navbar/Navbar'
import Sidebar from './Sidebar/Sidebar'

const AuthenticatedLayout = ({children}) => {
  return (
    <div className='h-full'>
        <Navbar/>
        <div className='min-h-screen flex'>
          <Sidebar/>
          <div className='h-full w-full'>
            {children}
          </div>
        </div>
        
    </div>
  )
}

export default AuthenticatedLayout