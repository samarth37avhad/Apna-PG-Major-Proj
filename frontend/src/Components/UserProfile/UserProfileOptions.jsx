import { useSelector } from "react-redux";
import { userProfileOptions } from "./userProfileApi";
const UserProfileOptions = ({ setShowPopup, setSelectedOption }) => {
  const userProfile = useSelector(
    (state) => state.user?.userDetails?.profileDetails.profile
  );

  console.log("User Profile: ", userProfile);
  return (
    <>
      <div className="flex flex-col">
        <div>
          <h1 className="text-[#222222] text-[32px] font-semibold">
            Your Profile
          </h1>
          <div className="text-base text-[#717171] max-w-[85%] mt-5">
            The information you share will be used across ApnaPG to help other
            guests and Hosts get to know you.
          </div>
        </div>

        <section className="grid grid-cols-2 gap-x-16 mt-4">
          {userProfileOptions.map((option, index) => {
            let savedProfileData;
            for (const keys in option) {
              let fieldName = option[keys];
              for (const profileKeys in userProfile) {
                if (fieldName === profileKeys) {
                  savedProfileData = userProfile[profileKeys];
                }
              }
            }
            return (
              <div
                key={index}
                className="border-b border-[#dedede] cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setSelectedOption(option);
                  setShowPopup((prev) => !prev);
                }}
              >
                <div className=" flex flex-row gap-3 items-center py-6 px-2 hover:bg-[#f7f7f7] rounded-xl">
                  <img src={option.img} alt="Options" className="w-7" />
                  {savedProfileData ? (
                    <div className="text-base text-[#717171]">
                      <p>
                        {savedProfileData.name} : {savedProfileData.value}
                      </p>
                    </div>
                  ) : (
                    <p className="text-base text-[#717171]">{option.name}</p>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
};

export default UserProfileOptions;
