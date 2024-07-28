import { useSelector } from "react-redux";
import { selectUser } from "../redux/userDataSlice";

const useAuth = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = !!user.user;
  const hasFullAccess = user.user?.user_type?.has_full_access === 1;

  return { user, isAuthenticated, hasFullAccess };
};

export default useAuth;
