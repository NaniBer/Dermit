import { Mail, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          {/* Logo & Brand */}
          <div className="flex flex-col">
            <div className="w-32 h-13 rounded-lg ">
              <img src="/DermitLong.png" alt="Dermit Logo" />
            </div>
            {/* Contact */}
            <div className="flex rounded-lg mt-4 ">
              <Mail color="#9ca3af" />{" "}
              <p className="ml-3 text-gray-400">suport@wemdafrica.com</p>
            </div>
          </div>
          <div>
            {/* Navigation Links */}
            <div className="flex flex-col text-sm space-y-2">
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors "
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              {/* <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                How it Works
              </Link> */}
              <Link
                // to="https://forms.gle/1QxJq1Hn91JoM2vX7"
                to="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Register as a Doctor
              </Link>
            </div>
          </div>

          {/* Footer Text */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
