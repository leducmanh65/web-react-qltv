import React from "react";
import "../../styles/User/featured-section.css";

interface FeaturedSectionProps {
  onViewAll?: () => void;
}

const FEATURED_BOOKS = [
  { src: "/book-queenie.jpg", alt: "Queenie" },
  { src: "/book-red-girl.jpg", alt: "Red Girl" },
  { src: "/book-washington-black.jpg", alt: "Washington Black" },
  { src: "/book-green-house.jpg", alt: "Green House" },
  { src: "/book-blue-lake.jpg", alt: "Blue Lake" },
];

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ onViewAll }) => {
  return (
    <section className="user-featured-section">
      <div className="user-featured-container">
        <div className="user-featured-left">
          <h1>Join now our book club.</h1>
          <p>3 months of unlimited reading for $2.99</p>
          <button className="user-join-btn" type="button">
            Join Now
          </button>
        </div>

        <div className="user-featured-right">
          <div className="user-featured-books-grid">
            {FEATURED_BOOKS.map((book) => (
              <img key={book.alt} src={book.src} alt={book.alt} className="user-featured-book" />
            ))}
          </div>

          <button className="user-view-all-btn" type="button" onClick={onViewAll}>
            View All
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;