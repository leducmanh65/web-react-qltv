import React from "react";
import "../../styles/User/featured-section.css";

interface FeaturedSectionProps {
  onViewAll?: () => void;
  userName?: string; // Thêm prop tên người dùng
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({  userName = "Bạn" }) => {
  return (
    <section className="user-hero">
      <div className="user-hero__content">
        <div className="user-hero__text">
          <h1 className="user-hero__title">
            Chào {userName}, <br />
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Hôm nay ta đọc gì nhỉ?</span>
          </h1>
          {/* <p className="user-hero__desc">
            Thư viện đang có <strong>1,240+</strong> cuốn sách và Ebook chờ bạn khám phá.
            Đừng quên bạn có sách cần trả trước ngày 15/10 nhé!
          </p> */}
          
      
        </div>

        {/* Phần thống kê nhỏ dạng thẻ nổi */}
        {/* <div className="user-hero__stats">
          <div className="stat-card">
            <div className="stat-icon bg-orange">
              <BookOpen size={20} color="white" />
            </div>
            <div>
              <p className="stat-label">Đang mượn</p>
              <p className="stat-value">3 cuốn</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon bg-blue">
              <Calendar size={20} color="white" />
            </div>
            <div>
              <p className="stat-label">Hạn trả</p>
              <p className="stat-value">2 ngày tới</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Hình minh họa bên phải */}
      <div className="user-hero__image-container">
        <img 
          src="https://cdni.iconscout.com/illustration/premium/thumb/girl-reading-book-sitting-on-books-2974926-2477353.png" 
          alt="Reading Illustration" 
          className="user-hero__image"
        />
      </div>
    </section>
  );
};

export default FeaturedSection;