import DefaultLayout from "../DefaultLayout/DefaultLayout";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { useState } from "react";
import "./styles/feedpage.css";


function FeedPage() {
  const [input, setInput] = useState("");

  const posts = [
  {
    id: 1,
    author: "Diana",
    time: "2d",
    avatar: "https://loremflickr.com/40/40/girl?lock=12",
    text: `“Reading isn't just escape. It’s access to a better self.”\n\nFinished *Atomic Habits* yesterday. I never imagined habit theory could be this practical. Anyone else found it life-changing?`,
    likes: 148,
  },
  {
    id: 2,
    author: "Lark",
    time: "1d",
    avatar: "https://loremflickr.com/40/40/boy?lock=24",
    text: `Just started *The Midnight Library* by Matt Haig. The concept of parallel lives hit me harder than expected.\n\nHas anyone here read it? Would love to hear your interpretation of the ‘regret’ theme.`,
    likes: 92,
  },
  {
    id: 3,
    author: "Mina",
    time: "12h",
    avatar: "https://loremflickr.com/40/40/woman?lock=31",
    text: `“A reader lives a thousand lives before he dies.” – George R.R. Martin\n\nDo you think re-reading a book counts as a different life? I’ve read *Pride and Prejudice* 4 times and still find new things each read.`,
    likes: 210,
  },
  {
    id: 4,
    author: "Eli",
    time: "5m",
    avatar: "https://loremflickr.com/40/40/man?lock=41",
    text: `What’s a book that made you stop and just... think?\n\nFor me, it was *Man's Search for Meaning*. Nothing else made me reflect so deeply on suffering, purpose, and survival.`,
    likes: 37,
  }
];


  return (
    <DefaultLayout>

        <div className="feed-page">
    {/* 🔝 Feed Intro Header */}
    <div className="feed-top-header">
      <h1>📖 Welcome to the Book Feed</h1>
      <p>Post your favorite quotes, thoughts, or reading reflections.</p>
    </div>
      <div className="feed-container">
        {/* Post Input Bar */}
        <div className="post-input-bar">
          <img
            className="avatar"
            src="https://loremflickr.com/40/40/avatar?lock=999"
            alt="avatar"
          />
          <input
            type="text"
            placeholder="What's on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="post-btn">Post</button>
        </div>

        {/* Feed Posts */}
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="post-header">
              <img className="avatar" src={post?.avatar} alt="avatar" />

              <div className="post-info">
                <span className="author">{post.author}</span>
                <span className="time">{post.time}</span>
              </div>
              <div className="options">•••</div>
            </div>

            <div className="post-text">
              {post.text.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

           <div className="post-actions">
  <div className="icons">
    <FaHeart className="icon" />
    <FaRegComment className="icon" />
    <FaShare className="icon" />
  </div>
  <div className="likes">{post.likes} likes</div>
</div>

          </div>
        ))}
      </div>
      </div>
    </DefaultLayout>
  );
}

export default FeedPage;
