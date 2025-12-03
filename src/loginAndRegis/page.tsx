"use client"

import { createUser, loginAuthentication } from '../api/authenticationApi';
import type { LoginDto } from '../api/authenticationApi';
import { useState } from "react"

export default function AuthPage() {
  const [isActive, setIsActive] = useState(false)

  const handleRegisterClick = () => setIsActive(true)
  const handleLoginClick = () => setIsActive(false)

  // SỬA 1: Khởi tạo state birthDate là string rỗng để tương thích với input type="date"
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username1, setUsername1] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>(""); 
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  // SỬA 2: Thêm tham số (e) và e.preventDefault()
  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn hành vi reload trang mặc định

    const loginDto: LoginDto = {
      username: username1,
      password: password1 ,
    };

    try {
      console.log("Login Sending:", loginDto);
      const response = await loginAuthentication(loginDto);
      console.log("Login Success:", response);
      alert("Đăng nhập thành công!"); // Thông báo nhẹ
    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Đăng nhập thất bại");
    }
  };
  

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Chặn hành vi reload trang mặc định

     const registerDto = {
      username: username,
      password: password,
      // API thường cần Date object hoặc ISO string, ta convert tại đây nếu cần
      birthDate: new Date(birthDate), 
      email: email,
      phoneNumber: phoneNumber,
      location: location,
    };

    try {
      console.log("Register Sending:", registerDto);
      const response = await createUser(registerDto);
      console.log("Register Success:", response);
      alert("Đăng ký thành công!");
      setIsActive(false); // Chuyển về tab Login sau khi đăng ký xong
    } catch (error: any) {
      console.error("Register Error:", error);
      alert("Đăng ký thất bại");
    }
  }

  return (
    <div className={`auth-container ${isActive ? "right-panel-active" : ""}`} id="container">
      
      {/* --- FORM ĐĂNG KÝ --- */}
      <div className="form-container register-container">
        <form onSubmit={handleSubmitRegister}>
          <h1 style={{color:"black"}}>Register here.</h1> 
          
          <input type="text" name="name" placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)} required />
          
          <input type="password" name="password" placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          
          <input type="date" name="birthDate" placeholder="Birth Date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)} required />
          
          <input type="email" name="email" placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          
          <input type="text" name="phoneNumber" placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} />
          
          <input type="text" name="location" placeholder="Location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)} />
            
          <button type="submit">Register</button>
        </form>
      </div>

      {/* --- FORM ĐĂNG NHẬP --- */}
      <div className="form-container login-container">
        <form onSubmit={handleSubmitLogin}>
          <h1 style={{color:"black"}}>Login here.</h1>
          
          <input type="text" name="name" placeholder="Name" 
            value={username1}
            onChange={(e) => setUsername1(e.target.value)} required />
            
          <input type="password" name="password" placeholder="Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)} required />
          
          <div className="content">
            <div className="checkbox">
              <input type="checkbox" name="remember" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-pass">Forgot password?</a>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>

      {/* --- PHẦN OVERLAY --- */}
      <div className="overlay-container">
        <div className="overlay">
          {/* SỬA 3: Đường dẫn video bắt đầu bằng / */}
          <video autoPlay muted loop playsInline className="video-background">
            <source src="/1203.mp4" type="video/mp4" />
          </video>
          
          <div className="overlay-panel overlay-left">
            <h1>Hello<br/>friends</h1>
            <p>If you already have an account login here and have fun</p>
            <button className="ghost" onClick={handleLoginClick}>
              Login
            </button>
          </div>

          <div className="overlay-panel overlay-right">
            <h1>Start your<br/>journey now</h1>
            <p>If you don't have an account yet, join us and start your journey.</p>
            <button className="ghost" onClick={handleRegisterClick}>
              Register
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}