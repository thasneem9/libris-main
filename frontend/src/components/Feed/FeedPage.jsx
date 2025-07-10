import DefaultLayout from "../DefaultLayout/DefaultLayout";
import { Card, Container, Row, Col, FormControl, Button, Stack } from "react-bootstrap";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { useState } from "react";


import avatar1 from "../../images/avatar1.png";
import avatar2 from "../../images/avatar2.png";
import avatar3 from "../../images/avatar3.png";
import './styles/feedpage.css'
import useFeedPosts from "../../hooks/useFeedPosts.js";
import { toast } from 'react-toastify';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../atoms/userAtom"; // path may vary

import { IoReturnDownForwardOutline } from "react-icons/io5";

function FeedPage() {
  const user = useRecoilValue(userAtom);
  const userId = user.userId;

console.log(userId)
  const [input, setInput] = useState("");
const { posts, loading, refetch, setPosts } = useFeedPosts();


  const navigate=useNavigate()

const handlePostClick = (postId) => {
  navigate(`/comment/${postId}`); // ✅ only the id
};


  const handleCreatePost = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post("/api/posts/addPost", { content: input }, {
        withCredentials: true
      });
      console.log("Post created:", res.data);
      setInput(""); // clear input
    await refetch(); // instead of reload
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      toast?.error("Failed to post"); // optional UX
    }
  };
const handleToggleLike = async (postId) => {
  if (!userId){
    console.log("no userId ")
    return
  }

  console.log("💥 Like toggled for post:", postId); // add this!

  try {
    await axios.post(`/api/posts/like/${postId}`, {}, { withCredentials: true });

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const liked = post.likes.includes(userId);
          const newLikes = liked
            ? post.likes.filter((id) => id !== userId)
            : [...post.likes, userId];

          return { ...post, likes: newLikes };
        }
        return post;
      })
    );
  } catch (err) {
    console.error("Error liking post:", err.response?.data || err.message);
    toast?.error("Failed to like post");
  }
};



  return (
    <DefaultLayout>
      <Container style={{ maxWidth: "540px", padding: "24px 0" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h2>📖 Welcome to the Book Feed</h2>
          <p className="text-muted">Post your favorite quotes, thoughts, or reading reflections.</p>
        </div>

        {/* Input Bar */}
        <Card className="mb-4 shadow-sm p-3">
          <Row className="align-items-center">
            <Col xs={9}>
              <FormControl
                placeholder="What's on your mind..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Col>
            <Col xs={3} className="text-end">
              <Button variant="primary" className="w-100" onClick={handleCreatePost}>
                Post
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Feed Posts */}
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 shadow-sm rounded-4" // ✅ perfect
>
            <Card.Body>
              <Stack direction="horizontal" gap={3} className="mb-2 align-items-start">
                <img
                  src={avatar1}
                  alt="avatar"
                  style={{ width: 44, height: 44, borderRadius: "50%" }}
                />
                <div className="flex-grow-1">
                  <div style={{ fontWeight: 600 }}>{post.username}</div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>
                 {new Date(post.createdAt).toLocaleString()}

                  </div>
                </div>
              </Stack>

              <Card.Text style={{ whiteSpace: "pre-wrap", fontSize: "15px" }}>
                {post.content}
              </Card.Text>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex gap-3 align-items-center">
                    {(() => {
  const liked = post.likes.includes(userId);
  return (
    <FaHeart
      size={18}
      color={liked ? "#ff1f1fda" : "#aaa"}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        handleToggleLike(post.id);
      }}
    />
  );
})()}



                  <FaRegComment size={17} style={{ cursor: "pointer" }}onClick={() => handlePostClick(post.id)} // ✅ perfect
/>
                  <LuSend size={17} style={{ cursor: "pointer" }} />
                </div>
                <span className="text-muted" style={{ fontSize: "14px" }}>
  {post.likes?.length || 0} likes
</span>

              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </DefaultLayout>
  );
}

export default FeedPage;
