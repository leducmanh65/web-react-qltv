import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import PostDetail from '../components/PostDetail';

const Routes: React.FC = () => {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route path="/" exact component={PostList} />
                <Route path="/create" component={PostForm} />
                <Route path="/post/:id" component={PostDetail} />
                <Route path="/edit/:id" component={PostForm} />
            </Switch>
        </Router>
    );
};

export default Routes;