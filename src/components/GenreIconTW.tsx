import React from 'react';
import { Genre } from '../types';

export interface GenreIconProps {
    genre: Genre & { icon?: React.ReactNode };
    onClick?: (genre: GenreIconProps['genre']) => void;
}

export const GenreIcon: React.FC<GenreIconProps> = ({ genre, onClick = () => { } }) => {
    return (
        <div className="flex flex-col items-center cursor-pointer group" onClick={() => onClick(genre)}>
            <div className="w-20 h-20 rounded-xl border-2 border-gray-200 flex items-center justify-center text-4xl bg-white group-hover:border-primary-orange group-hover:bg-orange-50 transition-all">
                {genre.icon}
            </div>
            <p className="text-xs font-medium text-gray-700 mt-2 text-center">{genre.name}</p>
        </div>
    );
};

export default GenreIcon;
