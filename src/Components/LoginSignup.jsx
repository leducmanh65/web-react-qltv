import React, { useState } from 'react'
import '../Styles/LoginSignup.css'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/padlock.png'
import phone_icon from '../Assets/icons8-phone-50.png'
import date_icon from '../Assets/icons8-date-50.png'
import location_icon from '../Assets/icons8-location-24.png'
import user_icon from '../Assets/user.png'

const LoginSignup = () => {
  const [action, setAction] = useState("Login");

  return (
    <div className='login-container'>
      <div className={`container ${action === "Login" ? "login-mode" : "signup-mode"}`}>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Signup" && (
          <>
            <div className="input">
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Name" />
            </div>

            <div className="input">
              <img src={password_icon} alt="" />
              <input type="password" placeholder="Password" />
            </div>

            <div className="input">
              <img src={date_icon} alt="" />
              <input type="text" placeholder="YYYY-MM-DD" />
            </div>

            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" placeholder="Email" />
            </div>

            <div className="input">
              <img src={phone_icon} alt="" />
              <input type="tel" placeholder="Phone Number" />
            </div>

            <div className="input">
              <img src={location_icon} alt="" />
              <input type="text" placeholder="Location" />
            </div>
          </>
        )}

        {action === "Login" && (
          <>
            <div className="input">
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Name" />
            </div>

            <div className="input">
              <img src={password_icon} alt="" />
              <input type="password" placeholder="Password" />
            </div>
          </>
        )}

        <div className="submit-container">
          <div
            className={action === "Signup" ? "submit gray" : "submit"}
            onClick={() => setAction("Signup")}
          >
            Sign Up
          </div>

          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => setAction("Login")}
          >
            Login
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginSignup;
