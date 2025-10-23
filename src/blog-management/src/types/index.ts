// This file exports TypeScript types and interfaces used throughout the application.

export interface BlogPost {
    id: string;
    title: string;
    author: string;
    thumbnailUrl: string;
    content: string;
    category: string;
    publicationDate: Date;
}

export interface PostFormValues {
    title: string;
    author: string;
    thumbnailUrl: string;
    content: string;
    category: string;
}