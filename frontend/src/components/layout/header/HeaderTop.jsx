import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const HeaderTop = () => {
  return (
    <div className="hidden md:block bg-white border-b border-gray-200 py-2">
      <div className="container mx-auto flex justify-between items-center px-3 py-2">
        <ul className="flex space-x-4 text-xl">
          <li>
            <a
              href="#"
              className="text-text hover:text-primary cursor-pointer "
            >
              <FaFacebook />
            </a>
          </li>
          <li>
            <a href="#" className="text-text hover:text-primary cursor-pointer">
              <FaTwitter name="logo-twitter" />
            </a>
          </li>
          <li>
            <a href="#" className="text-text hover:text-primary cursor-pointer">
              <FaInstagram name="logo-instagram" />
            </a>
          </li>
          <li>
            <a href="#" className="text-text hover:text-primary cursor-pointer">
              <FaLinkedin name="logo-linkedin" />
            </a>
          </li>
        </ul>

        <div className="text-text text-sm">
          <p>
            <b className="text-secondary">Free Shipping</b> This Week Order Over
            - $55
          </p>
        </div>

        <div className="flex space-x-4">
          <select
            name="currency"
            className="border border-gray-300 rounded-md p-1 text-sm cursor-pointer"
          >
            <option value="usd">USD $</option>
            <option value="eur">EUR €</option>
          </select>

          <select
            name="language"
            className="border border-gray-300 rounded-md p-1 text-sm cursor-pointer"
          >
            <option value="en-US">English</option>
            <option value="es-ES">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
