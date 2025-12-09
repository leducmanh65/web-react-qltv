import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserGuard } from "../hooks/useUserGuard";
import { Sidebar } from "../components/layoutUser/sidebar";

/**
 * UserLayout - Quản lý toàn bộ state cho /user routes
 * Sidebar được render một lần duy nhất ở đây
 */
export const UserLayout: React.FC = () => {
    useUserGuard();
    const navigate = useNavigate();
    const location = useLocation();
    const [bookType, setBookType] = useState<string>("Book");
    const [activePage, setActivePage] = useState<string>("home");

    const handleNavigate = (page: string, id?: string) => {
        if (page === "history") {
            setActivePage("history");
            navigate("/user/history");
        } else if (page === "ebook-history") {
            setActivePage("ebook-history");
            navigate("/user/ebook-history");
        } else if (page === "settings") {
            setActivePage("settings");
            navigate("/user/settings");
        } else if (page === "notifications") {
            setActivePage("notifications");
            navigate("/user/notifications");
        } else if (page === "search") {
            setActivePage("search");
            // TODO: implement search page
        } else if (page === "help") {
            setActivePage("help");
            // TODO: implement help page
        } else if (page === "reader" && id) {
            navigate(`/user/reader/${id}`);
        } else if (page === "home") {
            setActivePage("home");
            navigate("/user");
        }
    };

    // Detect current page from pathname
    useEffect(() => {
        const pathname = location.pathname;
        if (pathname.includes("/history")) {
        } else if (pathname.includes("/ebook-history")) {
            setActivePage("ebook-history");
        } else if (pathname.includes("/settings")) {
            setActivePage("settings");
        } else if (pathname.includes("/notifications")) {
            setActivePage("notifications");
        } else if (pathname.includes("/reader")) {
            // Keep current activePage when on reader
        } else {
            setActivePage("home");
        }
    }, [location.pathname]);

    return (
        <div className="user-app-container" style={{ display: "flex", height: "100vh" }}>
            <Sidebar
                onNavigate={handleNavigate}
                activePage={activePage}
            />
            <Outlet context={{ bookType, setBookType, activePage, setActivePage }} />
        </div>
    );
};

export default UserLayout;
