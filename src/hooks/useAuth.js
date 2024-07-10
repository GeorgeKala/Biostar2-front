import { useSelector } from 'react-redux'
import { selectUser } from '../redux/userDataSlice'

const useAuth = () => {
  const user = useSelector(selectUser)
  console.log(user)
  const isAuthenticated = !!user.user

  return { user, isAuthenticated }
}

export default useAuth
