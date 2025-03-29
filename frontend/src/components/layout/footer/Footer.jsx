//React Icons
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
} from "react-icons/io5";

//Local imports
import { footerCategories } from "../../../utils/data";
import { navLinks } from "../../../utils/data";

const Footer = () => {
  return (
    <footer className="bg-[#212121] text-gray-400 py-10">
      {/* Category Section */}
      <div className="container mx-auto  pb-6">
        <h2 className="text-primary text-lg font-semibold uppercase mb-4">
          Brand Directory
        </h2>
        <div className=" gap-6">
          {footerCategories &&
            footerCategories.map((category, index) => (
              <div key={index} className="gap-4 mb-4 ">
                <span className="text-[#999999] uppercase text-[17px] font-semibold mb-2 mr-3">
                  {category.title}:
                </span>
                <span className=" gap-3">
                  {category.links.map((link, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-[#787878] hover:text-gray-500 text-[17px]"
                    >
                      {link}{" "}
                      {i !== category.links.length - 1 && (
                        <span className="p-2"> | </span>
                      )}
                    </a>
                  ))}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="border-b border-[#454545] my-14"></div>

      {/* Footer Navigation */}
      <div className="container mx-auto  py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {navLinks.map((nav, index) => (
            <ul key={index}>
              <li className="text-white text-lg uppercase font-semibold ">
                {nav.title}
              </li>
              <div className="border-b border-primary pb-1 w-[30%]"></div>
              {nav.links.map((link, i) => (
                <li key={i} className="my-3">
                  <a
                    href="#"
                    className="text-[#787878] hover:text-primary text-[17px]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          ))}

          {/* Contact Section */}
          <ul className="space-y-3">
            <li className="text-white text-lg uppercase font-semibold mb-2 border-b border-primary w-[30%] pb-1">
              Contact
            </li>
            <li className="flex items-start gap-2 mt-4">
              <IoLocationOutline className="text-lg text-[#787878]" />
              <span className="text-sm text-[#787878]">
                419 State 414 Rte, Beaver Dams, NY, USA
              </span>
            </li>
            <li className="flex items-center gap-2">
              <IoCallOutline className="text-lg text-[#787878]" />
              <a
                href="tel:+6079368058"
                className="text-[#787878] hover:text-primary text-sm"
              >
                (607) 936-8058
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IoMailOutline className="text-lg text-[#787878]" />
              <a
                href="mailto:example@gmail.com"
                className="text-[#787878] hover:text-primary text-sm"
              >
                example@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-b border-[#454545] mt-10 mb-12"></div>

      {/* Footer Bottom */}
      <div className="container mx-auto text-center py-4 mb-9">
        <ul className="flex items-center w-full justify-center my-8">
          <li className="text-white text-sm uppercase font-semibold pr-6">
            Follow Us
          </li>
          <div className="flex gap-3">
            <a href="#" className="text-[#787878] hover:text-primary text-lg">
              <FaFacebookF />
            </a>
            <a href="#" className="text-[#787878] hover:text-primary text-lg">
              <FaTwitter />
            </a>
            <a href="#" className="text-[#787878] hover:text-primary text-lg">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-[#787878] hover:text-primary text-lg">
              <FaInstagram />
            </a>
          </div>
        </ul>
        <div className="flex items-center w-full justify-center my-8">
          <img src="images/payment.png" alt="" />
        </div>
        <p className="text-sm text-[#787878]">
          Copyright &copy;{" "}
          <a href="#" className="hover:text-primary ">
            Eset
          </a>{" "}
          all rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
