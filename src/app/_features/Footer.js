import CompanyName from "../_icons/CompanyName";
import FaceBook from "../_icons/FaceBook";
import HutIcon from "../_icons/HutIcon";
import Instagram from "../_icons/Instagram";

const Footer = () => {
  return (
    <div className="w-full bg-[#18181B] pt-[60px] flex justify-center">
      <div className="w-full flex flex-col items-center">
        <div className="w-auto h-[92px] bg-[#EF4444] flex text-white pl-[98px] font-semibold text-[30px] gap-[34px] overflow-hidden items-center">
          <div className="flex gap-[34px] whitespace-nowrap ">
            <h2>Fresh fast delivered </h2>
            <h2>Fresh fast delivered </h2>
            <h2>Fresh fast delivered </h2>
            <h2>Fresh fast delivered </h2>
            <h2>Fresh fast delivered </h2>
            <h2>Fresh fast delivered </h2>
            <h2>Fresh fast delivered </h2>
          </div>
        </div>

        <div className="w-360 pl-[88px] pr-[88px] mt-[76px] flex justify-between">
          <div>
            <div className="flex justify-center">
              <HutIcon />
            </div>
            <div className="mt-3">
              <CompanyName />
              <p className="text-white text-[12px]">Swift delivery</p>
            </div>
          </div>

          <div className="flex justify-between h-[228px] w-[788px] mb-[104px]">
            <div>
              <p className="text-[#71717A] font-normal text-base mb-4">
                NOMNOM
              </p>
              <p className="text-white font-normal text-base mb-4">Home</p>
              <p className="text-white font-normal text-base mb-4">
                Contact us
              </p>
              <p className="text-white font-normal text-base">Delivery zone</p>
            </div>

            <div>
              <p className="text-[#71717A] font-normal text-base mb-4">MENU</p>
              <p className="text-white font-normal text-base mb-4">
                Appetizers
              </p>
              <p className="text-white font-normal text-base mb-4">Salads</p>
              <p className="text-white font-normal text-base mb-4">Pizzas</p>
              <p className="text-white font-normal text-base mb-4">
                Main dishes
              </p>
              <p className="text-white font-normal text-base">Desserts</p>
            </div>

            <div>
              <p className="text-white mt-11 font-normal text-base mb-4">
                Side dish
              </p>
              <p className="text-white font-normal text-base mb-4">Brunch</p>
              <p className="text-white font-normal text-base mb-4">Desserts</p>
              <p className="text-white font-normal text-base mb-4">Beverages</p>
              <p className="text-white font-normal text-base">
                Fish & Sea foods
              </p>
            </div>

            <div>
              <p className="mb-5 text-[#71717A] font-normal text-base">
                FOLLOW US
              </p>
              <div className="flex gap-4">
                <FaceBook />
                <Instagram />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[84px] flex items-center pl-[88px] gap-12 border-t border-solid border-[#71717A] mb-[101px]">
          <p className="text-[#71717A]">Copy right 2024 © Nomnom LLC</p>
          <p className="text-[#71717A]">Privacy policy</p>
          <p className="text-[#71717A]">Terms and condition</p>
          <p className="text-[#71717A]">Cookie policy</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
