import { useState } from "react";
import TopBar from "../components/TopBar";
import { Search, CheckCircle, AlertCircle, Clock, Plus, X } from "lucide-react";


export default function CirculationManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idUser: "",
    idBook: "",
    note: ""
  });

  // Mock data
  const borrowSlips = [
    { id: 1, user: "John Doe", book: "The Great Gatsby", borrowDate: "2024-03-01", dueDate: "2024-03-15", status: "Active" },
    { id: 2, user: "Jane Smith", book: "Clean Code", borrowDate: "2024-02-10", dueDate: "2024-02-24", status: "Overdue" },
    { id: 3, user: "Admin User", book: "Design Patterns", borrowDate: "2024-03-05", dueDate: "2024-03-19", status: "Returned" },
  ];

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

  const handleOpenModal = () => {
    console.log("Opening modal...");
    alert("Button clicked!"); // Test if button works
    setIsModalOpen(true);
    console.log("Modal state set to:", true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ idUser: "", idBook: "", note: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(`Borrow Slip Created!\nUser ID: ${formData.idUser}\nBook ID: ${formData.idBook}\nNote: ${formData.note}`);
    handleCloseModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  console.log("Component rendering, isModalOpen:", isModalOpen);

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
         
         <button className="btn-primary" onClick={handleOpenModal}>
            <Plus size={18} /> Create Slip
         </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Create Borrow Slip</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ID USER</label>
                <input
                  type="text"
                  name="idUser"
                  className="form-input"
                  value={formData.idUser}
                  onChange={handleInputChange}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">ID BOOK</label>
                <input
                  type="text"
                  name="idBook"
                  className="form-input"
                  value={formData.idBook}
                  onChange={handleInputChange}
                  placeholder="Enter book ID"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">NOTE</label>
                <textarea
                  name="note"
                  className="form-input form-textarea"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Enter notes..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Submit
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}