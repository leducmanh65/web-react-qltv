import TopBar from "../components/TopBar";
import { Save } from "lucide-react";

export default function Settings() {
  return (
    <div>
      <TopBar title="Settings" />
      
      <div className="settings-grid">
        
        {/* Cột trái: Profile Card */}
        <div className="card profile-card">
            <div className="profile-avatar-large">AD</div>
            <h3 className="profile-name">Administrator</h3>
            <p className="profile-role">Super Admin</p>
        </div>

        {/* Cột phải: Form */}
        <div className="card">
            <h3 className="form-title">General Information</h3>
            
            <form className="form-grid">
                {/* Full Name - Chiếm cả dòng */}
                <div className="form-group col-span-full">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" defaultValue="Administrator" />
                </div>

                {/* Email - 1 nửa dòng */}
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue="admin@lms.com" />
                </div>

                {/* Phone - 1 nửa dòng */}
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-input" defaultValue="+84 999 999 999" />
                </div>

                {/* Nút Save */}
                <div className="form-actions">
                    <button type="button" className="btn-primary">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </form>
        </div>

      </div>
    </div>
  );
}