import TopBar from "../components/TopBar";
import React from "react";
import {getMyInfo} from "../api/apiService";

const Logout = () => {
  try{localStorage.removeItem('accessToken');
  window.location.href = '/auth';

  } catch (error) {
    console.error("Logout Error:", error);
  }
  
}



export default function Settings() {
  const [userInfo, setUserInfo] = React.useState<{userCode: string; username: string; roles: string[]; email: string; phoneNumber: string ;createdAt : any; updatedAt: any} | any>(null);
  React.useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getMyInfo();
        setUserInfo(response );
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div>
      <TopBar title="Settings" />
      
      <div className="settings-grid">
        
        {/* Cột trái: Profile Card */}
        <div className="card profile-card">
            <div className="profile-avatar-large">AD</div>
            <h3 className="profile-name">{userInfo?.username}</h3>
            <div className="form-title">{userInfo?.createdAt.map((item: any) => item).join("-")}</div>
            <div className="form-title" >{userInfo?.updatedAt.map((item: any) => item).join("-")}</div>
            <div className="profile-role">{userInfo?.roles.join(", ")}</div>
            
            <button className="btn-logout" onClick={Logout}>Logout</button>
        </div>

        {/* Cột phải: Form */}
        <div className="card settings-form-card">
          <h3 className="form-title">Account Settings</h3>
          {userInfo ? (
            <form className="form-grid">
              <div className="form-group col-span-full">
                <label>Username</label>
                <div className="form-input">{userInfo.username}  </div>
              </div>
              <div className="form-group col-span-full">
                <label>User Code</label>
                <div className="form-input">{userInfo.userCode}  </div>
              </div>
              <div className="form-group col-span-full">
                <label>Email</label>
                <div className="form-input">{userInfo.email}  </div>
              </div>
              <div className="form-group col-span-full">
                <label>Phone Number</label>
                <div className="form-input">{userInfo.phoneNumber}  </div>
              </div>
              <div className="form-group col-span-full">
                <label>Roles</label>
                <div className="form-input">{userInfo.roles.join(", ")}  </div>
              </div>
              <div className="form-group col-span-full">
                <label>Created At</label>
                <div className="form-input">{userInfo.createdAt.map((item: any) => item).join("-")}  </div>
              </div>
              <div className="form-group col-span-full">
                <label>Updated At</label>
                <div className="form-input">{userInfo.updatedAt.map((item: any) => item).join("-")}  </div>
              </div>
              
        
            </form>
          ) : (
            <p>Loading user information...</p>
          )}
        </div>

      </div>

    </div>
  );
}
  // <div className="card">
  //           <h3 className="form-title">General Information</h3>
            
  //           <form className="form-grid">
  //             <div className="form-group col-span-full">
  //                   <label className="form-label">CodeId</label>
  //                   <input type="text" className="form-input" defaultValue={userInfo?.userCode} />
  //               </div>