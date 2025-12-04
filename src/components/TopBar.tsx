import { Search, Bell } from "lucide-react";

export default function TopBar({ title }: { title: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '30px' 
    }}>
      <div>
        <p style={{ fontSize: '14px', color: '#A3AED0' }}>Pages / {title}</p>
        <h2 style={{ fontSize: '30px', fontWeight: '700', color: '#2B3674' }}>{title}</h2>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#fff', 
        padding: '10px', 
        borderRadius: '30px',
        boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' 
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#F4F7FE', 
          padding: '10px 20px', 
          borderRadius: '20px' 
        }}>
          <Search size={18} color="#8F9BBA" />
          <input 
            placeholder="Search..." 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              marginLeft: '10px', 
              outline: 'none' 
            }} 
          />
        </div>
        <div style={{ marginLeft: '20px', cursor: 'pointer', color: '#A3AED0' }}>
            <Bell size={24} />
        </div>
      </div>
    </div>
  );
}