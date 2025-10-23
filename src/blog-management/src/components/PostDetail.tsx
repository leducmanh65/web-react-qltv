import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

const PostDetail: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const history = useHistory();

    // Placeholder for post data fetching logic
    const post = {
        title: "Sample Post Title",
        author: "Author Name",
        date: "Publication Date",
        content: "Full content of the blog post goes here.",
    };

    const handleEdit = () => {
        history.push(`/edit/${postId}`);
    };

    const handleDelete = () => {
        // Placeholder for delete logic
        console.log(`Post ${postId} deleted`);
        history.push('/');
    };

    return (
        <div>
            <h1>{post.title}</h1>
            <h2>By {post.author} on {post.date}</h2>
            <p>{post.content}</p>
            <button onClick={() => history.push('/')}>Go Back</button>
            <button onClick={handleEdit}>Edit Post</button>
            <button onClick={handleDelete}>Delete Post</button>
        </div>
    );
};

export default PostDetail;