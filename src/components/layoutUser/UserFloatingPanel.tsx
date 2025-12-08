import React, { useEffect, useRef, useState } from "react";
import "../../styles/User/user-panel.css";

export interface UserInfo {
    name: string;
    role?: string;
    avatar?: string;
    dateOfBirth?: string;
    address?: string;
}

interface UserCardProps {
    user: UserInfo;
    onBorrowSlipClick?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onBorrowSlipClick }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const name = user.name || "Người dùng";
    const role = user.role || "Độc giả";
    const avatar = user.avatar || "https://dummyimage.com/200x200/f3f4f6/94a3b8&text=U";
    const dateOfBirth = user.dateOfBirth || "Chưa cập nhật";
    const address = user.address || "Chưa cập nhật";

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="user-panel-wrapper" ref={wrapperRef}>
            <button className="user-card" type="button" onClick={() => setOpen((v) => !v)}>
                <div className="user-card-left">
                    <div className="user-avatar glow">
                        <img src={avatar} alt={`${name} avatar`} />
                    </div>
                    <div className="user-texts">
                        <span className="user-name">{name}</span>
                        <span className="user-role">{role}</span>
                    </div>
                </div>

                <div className="user-actions-inline">
                    <button
                        className="borrow-chip"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBorrowSlipClick?.();
                        }}
                        aria-label="Phiếu mượn"
                        title="Phiếu mượn"
                    >
                        🛒
                    </button>
                </div>
            </button>

            {open && (
                <div className="user-popup" role="dialog" aria-label="User info">
                    <div className="popup-header">
                        <div className="popup-avatar glow">
                            <img src={avatar} alt={`${name} avatar`} />
                        </div>
                        <div className="popup-texts">
                            <div className="popup-name">{name}</div>
                            <div className="popup-role">{role}</div>
                        </div>
                    </div>

                    <div className="popup-meta">
                        <div>
                            <span className="meta-label">Ngày sinh</span>
                            <span className="meta-value">{dateOfBirth}</span>
                        </div>
                        <div>
                            <span className="meta-label">Địa chỉ</span>
                            <span className="meta-value">{address}</span>
                        </div>
                    </div>

                    <button
                        className="popup-borrow"
                        type="button"
                        onClick={() => onBorrowSlipClick?.()}
                    >
                        🛒 Phiếu mượn
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserCard;
