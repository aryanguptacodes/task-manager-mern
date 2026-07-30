import toast from "react-hot-toast";

const showError = (error) => {
  toast.error(error.response?.data?.message || "Something went wrong.");
};

export default showError;
