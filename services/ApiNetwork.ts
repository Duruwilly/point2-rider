import axios from "axios";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "../utils/helpers";
import { RootState } from "../store/store";
import { clearUser } from "../store/reducers/users-reducer";
import { BASE_URL } from "../constants/Base_urls";
import { setErrors } from "../store/reducers/app-reducer";
import { useEffect } from "react";
// import { useEffect } from "react";

export interface NetworkRequestReturnType {
  status: "success" | "failed" | "pending";
  data?: any;
  headers?: Record<string, string>;
}

type GetRequestType = {
  url: string;
  payload?: any | never;
  headers?: Record<string, string>;
  ignoreError?: boolean;
  useBaseUrl?: boolean;
};

type PostRequestType = {
  url: string;
  payload: any;
  headers?: Record<string, string>;
  ignoreError?: boolean;
  useBaseUrl?: boolean;
};

export interface NetworkReturnType {
  request: {
    (
      method: "GET" | "DELETE",
      props: GetRequestType
    ): Promise<NetworkRequestReturnType>;
    (
      method: "POST" | "PUT",
      props: PostRequestType
    ): Promise<NetworkRequestReturnType>;
    // (cancelRequest: () => void)
  };
  cancelRequest: () => void;
}

const source = axios.CancelToken.source();

export const ApiRequest = (
  retryRequest?: () => Promise<void>
): NetworkReturnType => {
  const dispatch = useDispatch();
  // const { refetchAccessToken } = RefreshToken()
  const { access_token } = useSelector((state: RootState) => state.user);

  const apiClient = axios.create({
    withCredentials: true,
  });

  useEffect(() => {
  apiClient.interceptors?.request?.use((config) => {
    config.headers = {
      ...config.headers,
      Authorization: "Bearer " + access_token ?? "",
    } as any;

    return config;
  });
  }, [access_token])

  const handleErrors = async (
    error: any,
    props: GetRequestType | PostRequestType
  ) => {
    const statusCode = error?.response?.status;

    let errorMessage: any = [];
    // if (error.response && error.response.data) {
    //   errorMessage = Array.isArray(error.response.data?.error)
    //     ? error.response.data?.error
    //     : [error.response.data.message];
    // }
    if (error.response && error.response.data) {
      const message = error.response.data.message;

      if (typeof message === "object" && message !== null) {
        errorMessage = Object.values(message).flat();
      } else if (typeof message === "string") {
        errorMessage = [message];
      } else {
        errorMessage = [error.response.data.error];
      }
    }

    if (error.code === "ERR_NETWORK") {
      Alert.alert("Network error", "Please check your internet connection.", [
        // { text: "Close", style: "cancel" },
        {
          text: "Retry",
          onPress: async () => {
            if (retryRequest) {
              try {
                // retry request
                await retryRequest();
              } catch (error) {}
            }
          },
        },
      ]);
    }
    if (statusCode === 401) {
      // Handle unauthorized errors
      dispatch(clearUser());
      if (!props.ignoreError) {
        navigate("welcome", null);
      }
    } else {
      if (!props.ignoreError) {
        // Alert.alert("Error!", "Request could not be process", [
        //   { text: "Close", style: "cancel" },
        // ]);
        dispatch(setErrors(errorMessage));
      }
    }
    // } else if (statusCode === 404 || statusCode === 500 || statusCode === 400 || statusCode === 403) {
    //     Alert.alert("Error!", error?.response?.data?.message, [{ text: "Close", style: "cancel" }])
    // }
  };

  const request = async (
    method: "GET" | "POST" | "PUT" | "DELETE",
    props: GetRequestType | PostRequestType
  ): Promise<NetworkRequestReturnType> => {
    const { url, payload, headers } = props;

    let baseURL = BASE_URL;
    
    const fullUrl = baseURL + url;

    const config = {
      method,
      url: fullUrl,
      data: payload,
      headers: {
        Authorization: "Bearer " + access_token ?? "",
        ...headers,
      },
      baseURL,
      cancelToken: source.token,
    };

    try {
      const response = await apiClient.request<NetworkRequestReturnType>(
        config
      );

      return {
        status: "success",
        data: response.data,
      };
    } catch (error: any) {
      console.log("here",error);

      handleErrors(error, props);
      return {
        status: "failed",
        data: error?.response?.data?.message,
      };
    }
  };

  const cancelRequest = () => {
    source.cancel("Request was canceled by the user.");
  };

  return {
    request,
    cancelRequest,
  };
};
