import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserGuard } from "../hooks/useUserGuard";
import "../styles/User/reader.css";

const BOOKS_DATA: Record<string, { title: string; author: string; cover: string; content: string }> = {
  "1": {
    title: "Such a Fun Age",
    author: "Kiley Reid",
    cover: "/public/book-cover-fun-age.jpg",
    content: `Chapter I: The Beginning

Alix was always the person who people wanted to be around, not because she was particularly funny or particularly interesting, but because she had a way of making you feel like you were the most interesting person in the room. She worked at a bookstore, and she had a degree in art history, though she wasn't sure how that had happened.

It was a Tuesday when everything changed. The weather was nice, but not in a way that made you want to be outside. It was the kind of nice that made you feel like you should be outside, but you could easily be convinced to stay in.

Alix met Emira at the bookstore. Emira was the first person in years that Alix felt like she couldn't quite figure out. This intrigued her. She wanted to know everything about Emira, and she wanted Emira to want to know everything about her.

But first, Alix had to figure out what Emira wanted. She had to figure out what made Emira tick, what made her laugh, what made her uncomfortable.

The problem was that Alix was very good at figuring people out. She was very good at it. And Emira, it seemed, was not.

"Do you like working here?" Alix asked.

"It's a job," Emira said.

"That's not what I asked."

"It's a job that pays money that I need to live."

Alix nodded. She understood this. She also understood that this was not an answer to her question.

"Would you want to get coffee with me sometime?" Alix asked.

Emira looked at her for a long moment. "I'm dating someone," she said.

"I didn't ask if you were dating someone," Alix said. "I asked if you wanted to get coffee with me."

"Those are the same thing," Emira said.

"Are they?" Alix asked.

Emira didn't answer. But three weeks later, she texted Alix and asked her where she wanted to meet.

---

Chapter II: Development

The relationship between Alix and Emira was complicated from the start. Alix wanted Emira to be her best friend, her confidant, her everything. Emira wanted to keep things simple, but Alix made that impossible.

When Emira started dating Jude, Alix was devastated. She had convinced herself that she and Emira would be together forever, that they would grow old together, that they would have matching tattoos someday.

But Jude changed things. Jude was successful, handsome, and attentive in a way that Alix could never be. Alix resented him immediately.

The resentment grew when Emira started spending more time with Jude than with Alix. The resentment turned into jealousy when Alix realized that Emira was happy, genuinely happy, for the first time.

Alix couldn't accept this. She couldn't accept that Emira had moved on, that Emira had a life that didn't include her as the main character.

So Alix did what Alix always did: she manufactured a crisis.

She had Jude followed. She found out about his past, about the women he'd dated before, about the things he'd done that Emira didn't know about. Most of it was harmless, but some of it was ammunition.

She confronted Emira with the information, expecting Emira to thank her, to see her as the loyal friend who had protected her.

But Emira was furious. She accused Alix of being possessive and manipulative. She said things that Alix couldn't unhear.

"You don't want me to be happy," Emira said. "You want me to be happy only if it involves you."

Alix couldn't argue with this because it was true.`,
  },
  "2": {
    title: "Mrs. Everything",
    author: "Jennifer Weiner",
    cover: "/public/book-cover-everything.jpg",
    content: `Chapter II: Journeys

Mrs. Everything is a story of two women and their journey through life. It follows their lives from the 1950s to the present day, exploring themes of love, loss, identity, and friendship.

The novel begins with Jo and Dinah, two young girls growing up in Michigan during the 1950s. Jo is overweight and insecure, while Dinah is beautiful and confident. Despite their differences, they become best friends.

Their lives take different paths as they grow older. Dinah becomes a model and later a television personality, while Jo becomes a lawyer. But their bond remains strong throughout the years.

The story is told in alternating perspectives, with both Jo and Dinah reflecting on their lives, their loves, and their losses. It's a story about sisterhood, about the choices women make, and about the cost of those choices.

Jo's journey is marked by her struggles with her weight and her self-image. She meets a man named Rick in law school, and they fall in love. But their relationship is complicated by Jo's insecurities and Rick's inability to understand her.

Dinah's journey is marked by her success and her subsequent fall from grace. She becomes famous, but fame comes at a cost. She struggles with her identity, with her relationships, and with her ability to be a good mother.

---

Chapter II: Journeys and Choices

As the years pass, both Jo and Dinah make choices that will define the rest of their lives. Jo chooses to be a lawyer, to pursue her career, to fight for justice. Dinah chooses to be a mother, to be a wife, to be the best version of herself that she can be.

But life has other plans for both of them.

Jo meets a woman named Rita at a legal conference, and her world is turned upside down. Rita is everything that Jo has been looking for, everything that she didn't know she needed.

Dinah, meanwhile, is dealing with the fact that her husband has left her for a younger woman. She is devastated, but she is also relieved. For the first time in her life, she is free to be herself.

The novel explores the ways in which these two women navigate their lives, their relationships, and their identities. It's a story about love in all its forms, about loss and redemption, about the power of female friendship and sisterhood.`,
  },
  "3": {
    title: "All This Could Be...",
    author: "Jami Attenberg",
    cover: "/public/book-cover-all-this.jpg",
    content: `Chapter III: Possibilities

This novel explores the lives of a group of people living in a small New Mexico community. It's a story about art, love, friendship, and the choices we make in life.

The main character is a woman who has moved to New Mexico to start a new life after her divorce. She's hoping to find herself and discover new passions in this new environment.

As she settles into her new life, she meets a group of artists and misfits who become her friends. Together, they navigate the complexities of relationships, creativity, and personal growth.

The novel is set against the backdrop of the New Mexico landscape, which plays a significant role in the story. The beauty and harshness of the desert mirror the characters' internal struggles and growth.

Through these interconnected stories, the author explores what it means to be alive, to create, to love, and to find your place in the world.`,
  },
  "4": {
    title: "The River",
    author: "Peter Heller",
    cover: "/public/book-cover-river.jpg",
    content: `Chapter IV: The Journey

The River is a novel about a man and his teenage son who embark on a canoe trip down a river. What begins as a simple journey becomes a test of their relationship and their survival instincts.

As they travel downriver, they encounter obstacles and dangers that force them to work together and confront their differences. The river becomes a metaphor for life itself, with its currents and rapids representing the challenges we all face.

The novel explores themes of masculinity, fatherhood, and the bond between parent and child. It's a story about facing the unknown and discovering inner strength.

Peter Heller's writing is vivid and immersive. He brings the river to life, making readers feel like they're on the journey alongside the characters.

The novel is both an adventure story and an introspective look at family relationships. It appeals to readers who enjoy outdoor narratives and character-driven stories.`,
  },
  "5": {
    title: "The Old Drift",
    author: "Namwali Serpell",
    cover: "/public/book-cover-drift.jpg",
    content: `Chapter V: Time and Memory

The Old Drift is set in Zambia and tells the story of three families across generations. It's a sweeping narrative that explores colonialism, independence, and the personal stories of people living through historical change.

The novel spans from the 1950s to the present day, following the lives of various characters as they navigate love, ambition, and family obligations.

Namwali Serpell's writing is innovative and experimental. The narrative structure is complex, weaving together multiple storylines and perspectives in a way that mirrors the complexity of life itself.

The novel is a testament to the power of storytelling and how personal narratives are intertwined with larger historical events. It's a thought-provoking and engaging read that challenges readers to think deeply about the world around them.`,
  },
  "6": {
    title: "Underland",
    author: "Robert Macfarlane",
    cover: "/public/book-cover-underland.jpg",
    content: `Chapter VI: Underground Worlds

Underland is a non-fiction exploration of the world beneath our feet. Robert Macfarlane takes readers on a journey through caves, mines, and underground spaces around the world.

The book explores the history, geology, and human significance of these underground places. It's both a scientific exploration and a meditation on what lies beneath the surface of our world.

Macfarlane's writing is lyrical and evocative. He brings these hidden worlds to life, showing readers the beauty and mystery that exists underground.

The book is divided into sections, each exploring a different type of underground space and its significance. From the catacombs of Paris to the mines of Wales, Macfarlane takes readers on a fascinating journey.`,
  },
};

export const ReaderPage: React.FC = () => {
  useUserGuard(); // Check authentication
  const navigate = useNavigate();
  const { bookId = "1" } = useParams<{ bookId: string }>();
  const book = BOOKS_DATA[bookId];
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleGoBack = () => {
    navigate("/user");
  };

  const pages = useMemo(() => {
    const lines = book?.content.split("\n") ?? [];
    const linesPerPage = Math.max(10, Math.floor(800 / (fontSize * 1.5)));
    const res: string[] = [];
    for (let i = 0; i < lines.length; i += linesPerPage) {
      res.push(lines.slice(i, i + linesPerPage).join("\n"));
    }
    return res;
  }, [book, fontSize]);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));

  if (!book) {
    return (
      <div className="reader-container">
        <div className="book-not-found">
          <p>Book not found</p>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`reader-container ${isDarkMode ? "dark-mode" : ""}`}>
      <header className="reader-header">
        <button className="back-btn" onClick={handleGoBack}>
          ← Back
        </button>
        <div className="book-title-header">
          <h1>{book.title}</h1>
          <p className="reader-author">{book.author}</p>
        </div>
        <button className="menu-btn" onClick={() => setIsDarkMode((prev) => !prev)}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <div className="reader-menu">
        <div className="menu-section">
          <h3>Font Size</h3>
          <div className="font-controls">
            <button onClick={() => setFontSize((p) => Math.max(12, p - 2))}>A-</button>
            <span>{fontSize}px</span>
            <button onClick={() => setFontSize((p) => Math.min(24, p + 2))}>A+</button>
          </div>
        </div>
        <div className="menu-section">
          <h3>Mode</h3>
          <button
            className={`mode-toggle ${isDarkMode ? "active" : ""}`}
            onClick={() => setIsDarkMode((prev) => !prev)}
          >
            {isDarkMode ? "Dark" : "Light"}
          </button>
        </div>
        <div className="menu-section">
          <p className="page-info">
            Page {currentPage + 1} of {pages.length || 1}
          </p>
        </div>
      </div>

      <div className="reader-content">
        <div className="book-display">
          <div className="book-cover-sidebar">
            <img src={book.cover} alt={book.title} className="book-cover-large" />
          </div>
          <div className="text-content" style={{ fontSize: `${fontSize}px` }}>
            {pages[currentPage]}
          </div>
        </div>
      </div>

      <footer className="reader-footer">
        <button className="nav-btn prev" onClick={handlePrevious} disabled={currentPage === 0}>
          ←
        </button>
        <div className="page-indicator">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentPage + 1) / (pages.length || 1)) * 100}%` }} />
          </div>
          <span className="page-number">
            {currentPage + 1} / {pages.length || 1}
          </span>
        </div>
        <button
          className="nav-btn next"
          onClick={handleNext}
          disabled={currentPage >= (pages.length || 1) - 1}
        >
          →
        </button>
      </footer>
    </div>
  );
};

export default ReaderPage;
