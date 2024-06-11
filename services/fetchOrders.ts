import { useDispatch, useSelector } from "react-redux";
import { ApiRequest } from "./ApiNetwork";
import { RootState } from "../store/store";
import { setUserOrders } from "../store/reducers/app-reducer";
import { useState } from "react";

export const useFetchOrders = () => {
  const { request } = ApiRequest();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    setRefreshing(true);
    const { status, data } = await request("GET", {
      url: `/rider/getorders`,
      ignoreError: true,
    });

    if (status == "success") {
      dispatch(setUserOrders(data?.data?.data));
      setRefreshing(false);
    } else {
      setRefreshing(false);
    }
  };
  // }

  return {
    fetchOrders,
    refreshing,
  };
};
