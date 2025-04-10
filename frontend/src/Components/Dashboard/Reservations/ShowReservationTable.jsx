import { Link } from "react-router-dom";

const ShowReservationTable = ({ data, type }) => {
  return (
    <div className="flex flex-col overflow-x-auto">
      <div>
        <div className="inline-block min-w-full py-2">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-light">
              <thead className=" text-xs text-[#717171] font-medium border-b border-[#dddddd]">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    S.No
                  </th>
                  <th scope="col" className="px-6 py-4">
                    ORDER ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    LISTING
                  </th>
                  <th scope="col" className="px-6 py-4">
                    GUEST
                  </th>
                  <th scope="col" className="px-6 py-4">
                    NIGHT
                  </th>
                  <th scope="col" className="px-6 py-4">
                    BASE PRICE
                  </th>

                  <th scope="col" className="px-6 py-4">
                    EARNED
                  </th>
                  <th scope="col" className="px-6 py-4">
                    CHECK IN
                  </th>
                  <th scope="col" className="px-6 py-4">
                    CHECK OUT
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length !== 0 ? (
                  data?.map((listing, index, allListing) => {
                    const checkIn = new Date(
                      listing.checkIn
                    ).toLocaleDateString();
                    const checkOut = new Date(
                      listing.checkOut
                    ).toLocaleDateString();

                    return (
                      <tr
                        key={index}
                        className={`${
                          index === allListing.length - 1
                            ? ""
                            : "border-b border-[#dddddd]"
                        } ${type === "Upcoming" ? "bg-yellow-100" : ""}
                        ${type === "Ongoing" ? "bg-orange-100" : ""}
                        ${type === "Completed" ? "bg-green-100" : ""}
                        
                        ${type === "Cancelled" ? "bg-red-100" : ""}`}
                      >
                        {/* Sr. No  */}
                        <td className=" px-6 py-4 w-[120px]">
                          <p className="text-sm text-[#222222]">{index + 1}</p>
                        </td>

                        <td className=" px-6 py-4 flex flex-row items-center gap-2">
                          <p className="text-sm text-[#222222]">
                            {listing.orderId}
                          </p>
                        </td>

                        {/* order id*/}
                        <td className=" px-6 py-4 w-[120px]">
                          <Link
                            to={`/rooms/${listing.listingId}`}
                            className=" text-sm text-[#222222] font-medium w-[120px] underline hover:text-blue-500 transition-colors duration-200 ease-in"
                          >
                            See listing
                          </Link>
                        </td>
                        {/* guest number */}
                        <td className=" px-6 py-4 w-[120px]">
                          <p className="text-sm text-[#222222]">
                            {listing.guestNumber}
                          </p>
                        </td>
                        {/* night staying */}
                        <td className=" px-6 py-4 w-[120px]">
                          <p className="text-sm text-[#222222]">
                            {listing.nightStaying}
                          </p>
                        </td>
                        {/* Base price  */}
                        <td className=" px-6 py-4 w-[120px]">
                          <p className="text-sm text-[#222222]">
                            {listing.basePrice}
                          </p>
                        </td>

                        {/* Author Earned Price  */}
                        <td className=" px-6 py-4 w-[120px]">
                          <p className="text-sm text-[#222222]">
                            {listing.totalBase}
                          </p>
                        </td>

                        {/* CheckIn  */}
                        <td className=" px-6 py-4 w-[120px]">
                          <p className="text-sm text-[#222222]">{checkIn}</p>
                        </td>

                        {/* CheckOut  */}
                        <td className=" px-6 py-4 w-[120px]">
                          <p className="text-sm text-[#222222]">{checkOut}</p>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className="text-xl text-center font-semibold">
                    {" "}
                    No {type} reservation
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowReservationTable;
