import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import errorIcon from "../../../assets/BasicIcon/errorIcon.png";
import { API } from "../../../backend";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userSignUp } from "../../../redux/actions/userActions";

const CreateUserPopup = ({
  loginEmail,
  setProfilePopup,
  showCreatePopUp,
  setPopup,
}) => {
  const [inputDateFocused, setInputDateFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const handleDateFocus = () => {
    setInputDateFocused(true);
  };

  const handleDateBlur = () => {
    setInputDateFocused(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // calculate the age of the user
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCreateUser = async (data) => {
    // check the age of the user
    const age = calculateAge(data.birthDate);

    console.log("The age is : ", age);

    if (age < 0) {
      toast.error("Please enter a valid birthdate | Not in future.");
      return;
    }

    if (age < 18) {
      toast.error("You must be at least 18 years old to sign up.");
      return;
    }

    // check the mobile number
    const mobileNumber = data.mobileno.toString();

    if (mobileNumber.length !== 10) {
      toast.error("Please enter a 10 digit valid mobile number.");
      return;
    }

    console.log(data);
    let user = {
      name: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
      emailId: data.email,
      birthDate: data.birthDate,
      mobileNo: data.mobileno,
      password: data.password,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}auth/sign-up`, user, {
        headers: { "Content-Type": "application/json" },
      });

      const responseData = response?.data;
      dispatch(userSignUp(responseData));
      let accessToken = localStorage.getItem("accessToken");
      let refreshToken = localStorage.getItem("refreshToken");

      if (responseData?.success) {
        toast.success(responseData?.message);
        if (!accessToken) {
          localStorage.setItem(
            "accessToken",
            JSON.stringify(responseData?.accessToken)
          );
        } else if (accessToken) {
          accessToken = responseData?.accessToken;
          localStorage.setItem("accessToken", JSON.stringify(accessToken));
        }
        if (!refreshToken) {
          localStorage.setItem(
            "refreshToken",
            JSON.stringify(responseData?.refreshToken)
          );
        } else if (refreshToken) {
          refreshToken = responseData?.refreshToken;
          console.log(refreshToken);
          localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
        }
      }

      showCreatePopUp(false);
      setPopup(false);

      setTimeout(() => {
        setProfilePopup(true);
        setPopup(true);
      }, 3000);

      setTimeout(() => {
        reset();
      }, 100);
    } catch (error) {
      console.log(error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.error("Network error please try again later!");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-6">
      <form
        onSubmit={handleSubmit(handleCreateUser)}
        className="px-8 flex flex-col gap-6"
      >
        {/* Get the First Name and Last Name of the User  */}
        <div className=" flex flex-col gap-3">
          <input
            type="text"
            className="w-full border-[1.4px] border-[#dddddd] p-3 rounded-lg"
            placeholder="First name"
            {...register("firstName", { required: true, maxLength: 40 })}
            aria-invalid={errors.firstName ? "true" : "false"}
          />
          <input
            type="text"
            className="w-full border-[1.4px] border-[#dddddd] p-3 rounded-lg"
            placeholder="Last name"
            {...register("lastName", { required: true, maxLength: 40 })}
            aria-invalid={errors.lastName ? "true" : "false"}
          />
          {errors.firstName?.type === "required" &&
            errors.lastName?.type === "required" && (
              <div
                role="alert"
                className=" flex flex-row items-center gap-2 -mt-2"
              >
                <img
                  src={errorIcon}
                  alt="First name is requires"
                  className="w-5"
                />
                <p className="text-xs text-[#c13515]">Name is required</p>
              </div>
            )}
          <p
            className={` text-xs text-[#717171] -mt-2 ${
              errors.firstName || errors.lastName ? " hidden" : "block"
            }`}
          >
            Make sure it matches the name on your government ID.
          </p>
        </div>
        {/* Get the Birthdate of the User */}
        <div>
          <input
            className="w-full border-[1.4px] border-[#dddddd] p-3 rounded-lg"
            type={`${inputDateFocused ? "date" : "text"}`}
            aria-invalid={errors.birthDate ? "true" : "false"}
            placeholder="Birthdate"
            onFocus={handleDateFocus}
            onBlur={handleDateBlur}
            {...register("birthDate", {
              required: true,
              onBlur: handleDateBlur,
            })}
          />
          {errors.birthDate?.type === "required" && (
            <div
              role="alert"
              className=" flex flex-row items-center gap-2 mt-1"
            >
              <img
                src={errorIcon}
                alt="Last name is requires"
                className="w-5"
              />
              <p className="text-xs text-[#c13515]">Birth date is required</p>
            </div>
          )}
          <p
            className={`text-xs text-[#717171] mt-[6px] ${
              errors.birthDate ? "hidden" : "block"
            }`}
          >
            To sign up, you need to be at least 18. Your birthday won’t be
            shared with other people who use ApnaPG.
          </p>
        </div>

        {/* Get the user Email Id  */}
        <div>
          <input
            className="w-full border-[1.4px] border-[#dddddd] p-3 rounded-lg"
            type="email"
            defaultValue={loginEmail}
            placeholder="Email"
            {...register("email", { required: true })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email?.type === "required" && (
            <div
              role="alert"
              className=" flex flex-row items-center gap-2 mt-1"
            >
              <img
                src={errorIcon}
                alt="Last name is requires"
                className="w-5"
              />
              <p className="text-xs text-[#c13515]">Email is required</p>
            </div>
          )}
          <p
            className={`text-xs text-[#717171] mt-1 ${
              errors.email ? "hidden" : "block"
            }`}
          >
            We&apos;ll email you trip confirmations and receipts.
          </p>
        </div>

        {/* Get the Mobile Number of the User for the Notification purpose*/}
        <div>
          <input
            className="w-full border-[1.4px] border-[#dddddd] p-3 rounded-lg"
            type="number"
            placeholder="Mobile Number"
            {...register("mobileno", { required: true })}
            aria-invalid={errors.mobileno ? "true" : "false"}
          />
          {errors.mobileno?.type === "required" && (
            <div
              role="alert"
              className=" flex flex-row items-center gap-2 mt-1"
            >
              <img
                src={errorIcon}
                alt="Mobile Number is requires"
                className="w-5"
              />
              <p className="text-xs text-[#c13515]">
                Mobile number is required
              </p>
            </div>
          )}
          <p
            className={`text-xs text-[#717171] mt-1 ${
              errors.mobileno ? "hidden" : "block"
            }`}
          >
            We&apos;ll send you trip confirmations and receipts messages.
          </p>
        </div>

        {/* Get the password for the user account  */}
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            className="w-full border-[1.5px] border-[#dddddd] p-3 rounded-lg transition-all duration-300"
            {...register("password", {
              required: true,
              pattern: /^(?=.*[a-z]).{8,}$/,
            })}
          />
          <span
            className="absolute top-[36%] right-3 transform -translate-y-1/2 text-[#222222] text-xs font-semibold underline cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? "Hide" : "Show"}
          </span>
          {errors.password && (
            <div
              role="alert"
              className=" flex flex-row items-center gap-2 mt-1"
            >
              <img
                src={errorIcon}
                alt="Last name is requires"
                className="w-5"
              />
              <p className="text-xs text-[#c13515]">
                At least 8 characters & Contains a number or symbol
              </p>
            </div>
          )}
          <p
            className={`text-xs text-[#717171] mt-1 ${
              errors.password ? "hidden" : "block opacity-60"
            }`}
          >
            At least 8 characters & Contains a number or symbol
          </p>
        </div>
        <div>
          <span className=" text-[#717171] text-xs font-medium">
            By selecting
            <span className="font-semibold text-[#222222]">
              Agree and continue
            </span>
            , I agree to
            <Link className=" text-blue-600 underline font-medium">
              ApnaPG Terms of Service, Payments Terms of Service,
            </Link>
            and Nondiscrimination Policy and acknowledge the Privacy Policy.
          </span>
        </div>
        <div className=" flex flex-row items-center gap-5">
          <input type="checkbox" className="h-5 w-5" />
          <p className=" text-xs">
            I don’t want to receive marketing messages from ApnaPG.
          </p>
        </div>
        <div>
          <button
            className={`bg-[#ff385c] hover:bg-[#d90b63] transition-all duration-300 text-white font-medium rounded-lg p-3 w-full disabled:bg-[#dddddd] ${
              isLoading ? " cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <PulseLoader
                color="#f7f7f7"
                size={7}
                margin={4}
                speedMultiplier={0.6}
              />
            ) : (
              "Agree and continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserPopup;
