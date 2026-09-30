import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="icons-container">
      <button type="button" className="footer-icon-btn">
        <FaGoogle className="footer-icon" />
      </button>
      <button type="button" className="footer-icon-btn">
        <FaTwitter className="footer-icon" />
      </button>
      <button type="button" className="footer-icon-btn">
        <FaInstagram className="footer-icon" />
      </button>
      <button type="button" className="footer-icon-btn">
        <FaYoutube className="footer-icon" />
      </button>
    </div>
    <p className="contact-us-heading">Contact us</p>
  </div>
)

export default Footer
