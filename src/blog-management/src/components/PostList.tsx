import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        // Fetch posts from an API or a local source
        const fetchPosts = async () => {
            const response = await fetch('/api/posts'); // Replace with your API endpoint
            const data = await response.json();
            setPosts(data);
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div>
            <input
                type="text"
                placeholder="Filter by title"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <button onClick={() => {/* Navigate to create post page */}}>Create New Post</button>
            <div className="post-list">
                {filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} onDelete={handleDelete} />
                ))}
            </div>
            <div>Total Posts: {posts.length}</div>
        </div>
    );
};

export default PostList;