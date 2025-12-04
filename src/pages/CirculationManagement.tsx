import TopBar from "../components/TopBar";
import { Search, CheckCircle, AlertCircle, Clock, Plus } from "lucide-react";

export default function CirculationManagement() {
  // Mock data
  const borrowSlips = [
    { id: 1, user: "John Doe", book: "The Great Gatsby", borrowDate: "2024-03-01", dueDate: "2024-03-15", status: "Active" },
    { id: 2, user: "Jane Smith", book: "Clean Code", borrowDate: "2024-02-10", dueDate: "2024-02-24", status: "Overdue" },
    { id: 3, user: "Admin User", book: "Design Patterns", borrowDate: "2024-03-05", dueDate: "2024-03-19", status: "Returned" },
  ];

  // Helper để lấy Config hiển thị (Icon + Class) dựa trên status
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Active": 
        return { className: "badge-active", icon: <Clock size={14} /> };
      case "Overdue": 
        return { className: "badge-overdue", icon: <AlertCircle size={14} /> };
      case "Returned": 
        return { className: "badge-returned", icon: <CheckCircle size={14} /> };
      default: 
        return { className: "", icon: null };
    }
  };

  return (
    <div>
      <TopBar title="Circulation Management" />

      {/* Filter / Search Bar */}
      <div className="card filter-bar">
         <div className="search-wrapper">
            <Search size={18} color="#A3AED0" />
            <input 
              placeholder="Search by user or book..." 
              className="search-input-field" 
            />
         </div>
         
         <button className="btn-primary">
            <Plus size={18} /> Create Slip
         </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}> {/* Padding 0 để table full viền */}
        <table className="table-container">
          <thead>
            <tr>
              <th>Borrower</th>
              <th>Book Title</th>
              <th>Borrowed</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowSlips.map((item) => {
              const config = getStatusConfig(item.status);
              
              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700 }}>{item.user}</td>
                  <td>{item.book}</td>
                  <td>{item.borrowDate}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`status-badge ${config.className}`}>
                      {config.icon} {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status !== "Returned" && (
                        <button className="btn-outline-primary">
                            Return Book
                        </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}