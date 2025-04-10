import { useState, useEffect, useRef } from "react";
import { FaHome, FaMinusCircle, FaPlusCircle, FaSearch } from "react-icons/fa";
import { FaHouseDamage } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUser, userLogOut } from "../../redux/actions/userActions";

// Import the icons
import hamburgerMenu from "../../assets/BasicIcon/HamburgerMenu.svg";
import userProfile from "../../assets/BasicIcon/UserProfile.png";
import { IoIosCloseCircle } from "react-icons/io";

import AuthenticationPopUp from "../PopUp/authentication/AuthenticationPopUp";
import DashboardMenu from "./DashboardMenu";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { DateRange } from "react-date-range";
import { Country, State, City } from "country-state-city";

const Navbar = () => {
  // refs
  const calendarRef = useRef();
  const dropdownRef = useRef();
  const cityPopupRef = useRef();
  const guestPopupRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handling outside click
  const { state: calendarState, setState: setCalendarState } =
    useOutsideClick(calendarRef);
  const { state: showDropdown, setState: setShowDropdown } =
    useOutsideClick(dropdownRef);
  const { state: showCityPopup, setState: setShowCityPopup } =
    useOutsideClick(cityPopupRef);
  const { state: showGuestPopup, setState: setShowGuestPopup } =
    useOutsideClick(guestPopupRef);

  // dates saving and showing to the dateRange calendar calculation here
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Formatted dates to store in DB
  const formattedStartDate = selectedDates[0]?.startDate?.toISOString();
  const formattedEndDate = selectedDates[0]?.endDate?.toISOString();

  // Convert the formatted dated to local dates for the user to see
  const localStartDate = new Date(formattedStartDate).toLocaleDateString();
  const localEndDate = new Date(formattedEndDate).toLocaleDateString();

  // Handle the date selection
  const handleSelect = (date) => {
    setSelectedDates([date.selection]);
  };

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [popup, setPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideSmallSearch, setHideSmallSearch] = useState(true);

  const [city, setCity] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Fetch all cities from the Country 'IN' (India)
    const allCities = City.getCitiesOfCountry("IN");
    setCities(allCities);
  }, []);

  // Filter cities based on the input search text
  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().startsWith(city.toLowerCase())
  );

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setShowCityPopup(false);
  };

  const userMenuRef = useRef(null);
  const location = useLocation();
  const pathName = location.pathname;

  const inUserProfile = pathName.includes("/users/show/");
  const inUserDashboard = pathName?.includes("/users/dashboard/");
  const inHostRoomsLandingPage = pathName.includes("/host/rooms");
  const inListingDetailsPage = pathName?.includes("/listing");
  const inBookingPage = pathName?.includes("/book/stays");
  const isSmallDevice = window.innerWidth < 768;

  // get the user
  const user = useSelector((state) => state.user.userDetails);
  // console.log("The user form navbar : ", user);

  // Get the user id
  const userId = user?._id;
  // console.log("The user Id is ", userId);

  const handleLogOut = () => {
    dispatch(userLogOut());
  };

  // get the user details
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Close the user menu when clicked outside of the menu
  useEffect(() => {
    const handleOutSideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mouseup", handleOutSideClick);
    return () => {
      document.removeEventListener("mouseup", handleOutSideClick);
    };
  }, []);

  const handleSearch = () => {
    console.table([city, guestCount, formattedStartDate, formattedEndDate]);
    if (city === "") {
      setCity("Karad");
    }

    // setCity("Karad");
    // setGuestCount(1);
    navigate(
      `/search?city=${city}&guests=${guestCount}&checkIn=${formattedStartDate}&checkOut=${formattedEndDate}`
    );
  };

  return (
    <nav
      className={`border-b-[1.4px] border-[#003B95] sticky top-0 z-[99]  bg-[#003B95] ${
        inBookingPage && "hidden md:block"
      }`}
    >
      <div
        className={`xl:px-10 py-5 xl:mx-auto items-center px-5 relative ${
          inUserProfile ||
          inUserDashboard ||
          inHostRoomsLandingPage ||
          inListingDetailsPage
            ? " max-w-screen-xl"
            : " max-w-screen-2xl"
        }
        ${
          inUserDashboard || inHostRoomsLandingPage
            ? "flex flex-row justify-between"
            : "grid grid-cols-2 lg:grid-cols-3 gap-2"
        }
        ${inHostRoomsLandingPage ? " xl:px-20" : ""}
        `}
      >
        {/* The Company logo */}
        <div className="md:w-[160px]">
          <span className="flex flex-row gap-2 items-center max-w-[120px]">
            <Link
              className="text-xl text-white font-bold"
              onClick={() => {
                JSON.stringify(localStorage.setItem("category", "House"));
              }}
              to={"/"}
            >
              {/* Apna<span className="text-black">PG</span> */}
              ApnaPG
            </Link>
          </span>
        </div>

        {/* if not in the booking page then show the options 👇 */}
        {inBookingPage ? (
          <div className=" flex items-center justify-start w-1/4 h-full"></div>
        ) : (
          <>
            {/* searchbar */}
            {inUserProfile || inUserDashboard || inHostRoomsLandingPage ? (
              // if user is in dashboard
              <div>{inUserDashboard && <DashboardMenu />} </div>
            ) : (
              <div className="lg:block hidden">
                <div className="flex items-center justify-between transition-all cursor-pointer">
                  <div className="flex flex-col w-full transition duration-200">
                    <div className=" flex justify-between items-center border bg-white w-full rounded-lg m-0">
                      {/* Location */}
                      <div
                        className="px-3 py-3 ml-1"
                        onClick={() => setShowCityPopup(true)}
                      >
                        <p className="text-[10px] text-black font-semibold uppercase">
                          Location
                        </p>
                        <p className="text-sm text-[#222222]">
                          {city === "" ? "Mumbai" : city}
                        </p>
                      </div>

                      <div className="  w-2/4 min-h[60px] relative flex flex-col">
                        <div
                          onClick={() => {
                            setCalendarState((prev) => !prev);
                          }}
                          className="grid grid-cols-2 cursor-pointer"
                        >
                          <div className="px-3 py-3 border-l-2">
                            <p className="text-[10px] text-black font-semibold uppercase">
                              Check-in
                            </p>
                            <p className="text-sm text-[#222222]">
                              {localStartDate}
                            </p>
                          </div>

                          <div className="px-3 py-3 border-l-2">
                            <p className="text-[10px] text-black font-semibold uppercase">
                              Checkout
                            </p>
                            <p className="text-sm text-[#222222]">
                              {localEndDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Guest Count */}
                      <div
                        className="px-3 py-3 border-l-2"
                        onClick={() => setShowGuestPopup(true)}
                      >
                        <p className="text-[10px] text-black font-semibold uppercase">
                          {guestCount === 1 ? "Guest" : "Guests"}
                        </p>
                        <p className="text-sm text-[#222222]">{guestCount}</p>
                      </div>

                      <button
                        onClick={handleSearch}
                        className="flex justify-center items-center bg-[#003B95] px-3 py-3 rounded-tr-lg rounded-br-lg mr-2"
                      >
                        <FaSearch className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* if in the booking page don't show any option 👇  */}
        {inBookingPage ? (
          <div className="flex justify-end ">
            <div
              className="border-[1px] bg-white border-[#dddddd] rounded-full py-1 px-2 flex flex-row gap-3 hover:shadow-md transition-all cursor-pointer relative"
              onClick={() => {
                setShowUserMenu((preValue) => !preValue);
              }}
            >
              <img src={hamburgerMenu} alt="User Menu" className="w-4" />

              {/* show the user name based on the condition */}
              {user ? (
                <p className=" bg-[#222222] text-[#efefef] px-3 py-2 rounded-full text-xs">
                  {user.name?.firstName?.slice(0, 1)}
                </p>
              ) : (
                <img src={userProfile} alt="User Profile" className="w-8" />
              )}
            </div>

            {/* show the below user menu if the user is not login */}
            {showUserMenu ? (
              <div>
                {!user ? (
                  <div
                    ref={userMenuRef}
                    className="shadow-md absolute right-9 top-[74px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user-menu"
                  >
                    <Link
                      className="font-medium"
                      onClick={() => {
                        setShowUserMenu(false);
                        setPopup(true);
                      }}
                    >
                      Sign up
                    </Link>
                    <Link
                      onClick={() => {
                        setShowUserMenu(false);
                        setPopup(true);
                      }}
                    >
                      Login
                    </Link>
                    <hr className="h-[1.5px] bg-[#ddddd] my-1" />
                    <Link to={"/host/rooms"}>Rent your Room</Link>
                    <Link to={"/help"}>Help</Link>
                  </div>
                ) : (
                  // Logged In User Menu
                  <div
                    ref={userMenuRef}
                    className="shadow-md absolute right-9 top-[70px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user-menu z-10000"
                    onClick={() => {
                      setShowUserMenu((prev) => !prev);
                    }}
                  >
                    {user?.role === "host" || user?.role === "admin" ? (
                      <>
                        {!inUserDashboard ? (
                          <Link
                            to={`/users/dashboard/${user._id}/overview=true`}
                            onClick={() => {
                              JSON.stringify(
                                sessionStorage.setItem("activePage", 1)
                              );
                            }}
                            className="font-medium"
                          >
                            Dashboard
                          </Link>
                        ) : (
                          <Link className="font-medium" to={"/"}>
                            Home
                          </Link>
                        )}
                      </>
                    ) : (
                      <Link className="font-medium">Notifications</Link>
                    )}

                    <Link
                      to={`/users/show/booking/${userId}`}
                      className="font-medium"
                    >
                      Bookings
                    </Link>
                    <Link
                      to={`/users/show/wishlist/${userId}`}
                      className="font-medium"
                    >
                      WishLists
                    </Link>

                    <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                    <Link to={"/host/rooms"}>Rent Your Room</Link>
                    <Link to={`/users/show/${userId}/verify-account`}>
                      Verify Account
                    </Link>
                    <Link to={`/users/show/${user._id}`}>Account</Link>
                    <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                    <Link to={"/help"}>Help</Link>
                    <Link
                      onClick={() => {
                        handleLogOut();
                      }}
                    >
                      Log Out
                    </Link>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {/* If the user in the host Room landing page then show the different options  */}
            {inHostRoomsLandingPage ? (
              <div className=" flex flex-row items-center justify-between gap-4">
                <p className=" text-white text-sm font-medium hidden sm:block">
                  Ready to Host it?
                </p>
                <Link
                  to="/become-a-host"
                  className=" flex flex-row justify-between items-center gap-2 bg-white hover:bg-white transition-all duration-300 px-3 py-2 rounded-lg"
                >
                  {/* <img src={house} alt="House setup" className=" w-4 md:w-5" /> */}
                  <FaHouseDamage />
                  <p className=" font-semibold text-sm md:text-bas">
                    ApnaPG setup
                  </p>
                </Link>
              </div>
            ) : (
              <>
                {/* user profile */}
                <div className="flex justify-end items-center">
                  {!inUserDashboard && (
                    <Link
                      to="/host/rooms"
                      className=" bg-[#ffffff] hover:bg-[#f0f0f0] transition-all rounded-full p-2 cursor-pointer mr-3 md:block hidden"
                    >
                      <p className="text-sm font-medium text-[#222222] flex items-center gap-1">
                        <FaHome /> Host your room
                      </p>
                    </Link>
                  )}

                  <div
                    className="border-[1px] bg-white border-[#dddddd] rounded-full py-1 px-2 flex flex-row gap-3 hover:shadow-md transition-all cursor-pointer relative"
                    onClick={() => {
                      setShowUserMenu((preValue) => !preValue);
                    }}
                  >
                    <img src={hamburgerMenu} alt="User Menu" className="w-4" />

                    {/* show the user name based on the condition */}
                    {user ? (
                      <p className=" bg-[#222222] text-[#efefef] px-3 py-2 rounded-full text-xs">
                        {user.name?.firstName?.slice(0, 1)}
                      </p>
                    ) : (
                      <img
                        src={userProfile}
                        alt="User Profile"
                        className="w-8"
                      />
                    )}
                  </div>

                  {/* show the below user menu if the user is not login */}
                  {showUserMenu ? (
                    <div>
                      {!user ? (
                        <div
                          ref={userMenuRef}
                          className="shadow-md absolute right-9 top-[74px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user-menu"
                        >
                          <Link
                            className="font-medium"
                            onClick={() => {
                              setShowUserMenu(false);
                              setPopup(true);
                            }}
                          >
                            Sign up
                          </Link>
                          <Link
                            onClick={() => {
                              setShowUserMenu(false);
                              setPopup(true);
                            }}
                          >
                            Login
                          </Link>
                          <hr className="h-[1.5px] bg-[#ddddd] my-1" />
                          <Link to={"/host/rooms"}>Rent your Room</Link>
                          <Link to={"/help"}>Help</Link>
                        </div>
                      ) : (
                        // Logged In User Menu
                        <div
                          ref={userMenuRef}
                          className="shadow-md absolute right-9 top-[70px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user-menu z-10000"
                          onClick={() => {
                            setShowUserMenu((prev) => !prev);
                          }}
                        >
                          {user?.role === "host" || user?.role === "admin" ? (
                            <>
                              {!inUserDashboard ? (
                                <Link
                                  to={`/users/dashboard/${user._id}/overview=true`}
                                  onClick={() => {
                                    JSON.stringify(
                                      sessionStorage.setItem("activePage", 1)
                                    );
                                  }}
                                  className="font-medium"
                                >
                                  Dashboard
                                </Link>
                              ) : (
                                <Link className="font-medium" to={"/"}>
                                  Home
                                </Link>
                              )}
                            </>
                          ) : (
                            <Link className="font-medium">Notifications</Link>
                          )}

                          <Link
                            to={`/users/show/booking/${userId}`}
                            className="font-medium"
                          >
                            Bookings
                          </Link>
                          <Link
                            to={`/users/show/wishlist/${userId}`}
                            className="font-medium"
                          >
                            WishLists
                          </Link>

                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          <Link to={"/host/rooms"}>Rent Your Room</Link>
                          <Link to={`/users/show/${userId}/verify-account`}>
                            Verify Account
                          </Link>
                          <Link to={`/users/show/${user._id}`}>Account</Link>
                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          <Link to={"/help"}>Help</Link>
                          <Link
                            onClick={() => {
                              handleLogOut();
                            }}
                          >
                            Log Out
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Check in-out calendar */}
      {calendarState && (
        <div
          ref={calendarRef}
          className="absolute top-[82px] left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-md rounded-lg"
        >
          <DateRange
            className="rounded-full"
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={selectedDates}
            months={2}
            minDate={new Date()}
            direction="horizontal"
          />
        </div>
      )}

      {/* City Selection Popup */}
      {showCityPopup && (
        <div
          ref={cityPopupRef}
          className="absolute top-[85px] left-[28%] transform -translate-x-1/2 bg-white rounded-lg shadow-md"
        >
          <div className="bg-white p-6 rounded-lg w-96 border border-t-0 border-gray-300">
            <div className="relative">
              <h3 className="text-lg font-semibold mb-4">Select a City</h3>

              <input
                type="text"
                placeholder="Search city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border rounded"
              />
              {city && (
                <button
                  className="absolute top-2 right-2"
                  onClick={() => setCity("")}
                >
                  <IoIosCloseCircle className="text-gray-500" />
                </button>
              )}
            </div>
            <ul className="mt-4 max-h-60 overflow-y-auto">
              {filteredCities.map((c) => (
                <li
                  key={c.id}
                  onClick={() => handleCitySelect(c.name)}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Guest Count Popup */}
      {showGuestPopup && (
        <div
          ref={guestPopupRef}
          className="absolute top-[85px] left-[66%] transform -translate-x-1/2 bg-white p-4 rounded-lg w-[280px] shadow-md"
        >
          <div className="">
            <div className="flex items-center justify-between h-[30px] ">
              <h3 className="text-lg font-semibold "> Guest</h3>
              <div className="flex items-center justify-center space-x-4 ">
                <button
                  className="px-3 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setGuestCount((prev) => Math.max(prev - 1, 1))}
                >
                  <FaMinusCircle />
                </button>
                <span className="text-lg">{guestCount}</span>
                <button
                  className="px-3 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setGuestCount((prev) => prev + 1)}
                >
                  <FaPlusCircle />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search */}
      {/* {isSmallDevice && (
        <div className="flex justify-center items-center py-2 px-5">
          <div
            className="flex items-center justify-between w-full bg-white rounded-lg py-2 px-3"
            onClick={handleSearchClick}
          >
            <input
              type="text"
              placeholder="Search"
              className="w-full border-none focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="text-gray-500" />
          </div>
        </div>
      )} */}
      <AuthenticationPopUp popup={popup} setPopup={setPopup} />
    </nav>
  );
};

export default Navbar;
