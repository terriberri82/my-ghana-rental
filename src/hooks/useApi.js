import { useState, useCallback } from "react";

function useApi() {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [data, setData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const reset = useCallback(() => {
    setLoading(false);
    setIsError(false);
    setErrMessage("");
    setData(null);
    setIsSuccess(false);
    setSuccessMessage("");
  }, []);

  const request = useCallback(async (apiFunction, payload) => {
    setLoading(true);
    setIsError(false);
    setErrMessage("");
    setIsSuccess(false);
    setSuccessMessage("");

    try {
      const response = await apiFunction(payload);

      setData(response.data);
      setIsSuccess(true);
      setSuccessMessage(response.message);

      return response;
    } catch (error) {
      setIsError(true);
      setErrMessage(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    isError,
    errMessage,
    data,
    isSuccess,
    successMessage,
    request,
    reset,
  };
}

export default useApi;
