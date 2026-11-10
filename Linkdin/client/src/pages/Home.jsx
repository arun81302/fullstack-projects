import Nav from "../components/Nav"
import dp from '../assets/profile.png'
import { FaPlus } from "react-icons/fa";

const Home = () => {
  return (
    <>
      <Nav />

      <div className="w-full min-h-screen bg-[#ddddd6] pt-[80px] px-3.5 flex flex-col md:flex-row justify-start items-start gap-3">

        {/* Left Section */}
        <div className="p-[10px] w-full md:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg">

          {/* Cover Image */}
          <div className="w-full h-[100px] bg-gray-300 rounded-md">
            <img
              src=""
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Image */}
          <div className="relative size-16 sm:size-18 overflow-visible rounded-full top-[-45px] left-[20px]">

            <img
              src={dp}
              alt="user image"
              className="w-full h-full object-cover rounded-full"
            />

            {/* Plus Button */}
            <div className="absolute bottom-0 right-0 size-6 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md border-2 border-white">
              <FaPlus className="text-xs" />
            </div>

          </div>

        </div>

        {/* Middle Section */}
        <div className="p-[10px] w-full md:w-[50%] min-h-[200px] bg-white shadow-lg rounded-lg">
        </div>

        {/* Right Section */}
        <div className="p-[10px] w-full md:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg">
        </div>

      </div>
    </>
  )
}

export default Home