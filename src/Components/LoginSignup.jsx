import React from 'react'
import '../Styles/LoginSignup.css'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/padlock.png'
import user_icon from '../Assets/user.png'


function LoginSignup() {
    return (
        <div className = 'container'>
            <div class="header">
                <div class="text">Sign Up</div>
                <div class="underline"></div>
            </div>
            <div class="inputs">
                <div class="input">
                    <img src={user_icon} alt=""/>
                    <input type="text" placeholder="Name" />
                </div>
                <div class="input">
                    <img src={email_icon} alt=""/>
                    <input type="email" placeholder="Email" />
                </div>
                <div class="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" />
                </div>
                <div class="forgot-password">Lost Password <span>Click here</span></div>
                <div class="submit-container">
                    <div class="submit">Sign Up</div>
                    <div class="submit">Login</div>
                </div>
            </div>
            

        </div>
    );
}

export default LoginSignup;

