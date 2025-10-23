import React from 'react';

interface PostCardProps {
    title: string;
    author: string;
    date: string;
    description: string;
    thumbnail: string;
    onReadMore: () => void;
    onDelete: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ title, author, date, description, thumbnail, onReadMore, onDelete }) => {
    return (
        <div className="post-card">
            <img src={thumbnail} alt={title} className="post-thumbnail" />
            <h2 className="post-title">{title}</h2>
            <p className="post-author">By {author} on {date}</p>
            <p className="post-description">{description}</p>
            <button onClick={onReadMore}>Read More</button>
            <button onClick={onDelete}>Delete</button>
        </div>
    );
};

export default PostCard;