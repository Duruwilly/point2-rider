import { useDispatch, useSelector } from "react-redux";
import { ApiRequest } from "./ApiNetwork";
import { setUserOrders } from "../store/reducers/app-reducer";
import { setUser } from "../store/reducers/users-reducer";

export const useFetchUser = () => {
  const { request } = ApiRequest();
  // const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    //   setRefreshing(true);
    const { status, data } = await request("GET", {
      url: `/profile/details`,
      ignoreError: true,
    });
    if (status == "success") {
      dispatch(setUser(data.data));
      // setRefreshing(false);
    }
  };
  // }

  return {
    fetchUser,
    //   refreshing,
  };
};
