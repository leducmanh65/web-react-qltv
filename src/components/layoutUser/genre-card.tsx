import React from "react";
import "../../styles/User/genre-card.css";

export interface Genre {
  name: string;
  icon: string;
}

interface GenreCardProps {
  genre: Genre;
}

export const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  return (
    <div className="user-genre-card">
      <div className="user-genre-icon">{genre.icon}</div>
      <p className="user-genre-name">{genre.name}</p>
    </div>
  );
};

export default GenreCard;