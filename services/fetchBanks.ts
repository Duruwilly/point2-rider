import { Dispatch, SetStateAction } from "react";
import { ApiRequest } from "./ApiNetwork";

export const getBanks = () => {
  const { request } = ApiRequest();

  const fetchBanks = async (search: string) => {
    const { status, data } = await request("GET", {
      url: `/banking/get-banks?search=${search}`,
    });
    if (status == "success") {
      return data?.data.data;
    }
  };

  const getBankAccountDetails = async (
    bank_code: string,
    account_no: string,
    setVerifying: Dispatch<SetStateAction<boolean>>
  ) => {
    setVerifying(true)
    const { status, data } = await request("GET", {
      url: `/banking/name-enquiry?bank_code=${bank_code}&account_no=${account_no}`,
    });
    if (status === "success") {
      setVerifying(false)
      return data?.data;
    } else {
      setVerifying(false)
    }
  };

  return {
    fetchBanks,
    getBankAccountDetails
  };
};
