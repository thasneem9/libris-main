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

function FeedPage() {

  const [input, setInput] = useState("");
  const { posts, loading } = useFeedPosts(); 
  const navigate=useNavigate()

  const handlePostClick=()=>{
    navigate("/comment")


  }

  const handleCreatePost = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post("/api/posts/addPost", { content: input }, {
        withCredentials: true
      });
      console.log("Post created:", res.data);
      setInput(""); // clear input
      window.location.reload(); // 🔄 Quick way to reload posts (or call fetchPosts() if exposed)
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
      toast?.error("Failed to post"); // optional UX
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
          <Card key={post.id} className="mb-4 shadow-sm rounded-4" onClick={handlePostClick}>
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
                    {post.time}
                  </div>
                </div>
              </Stack>

              <Card.Text style={{ whiteSpace: "pre-wrap", fontSize: "15px" }}>
                {post.content}
              </Card.Text>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex gap-3 align-items-center">
                  <FaHeart size={18} color="#ff1f1fda" style={{ cursor: "pointer" }} />
                  <FaRegComment size={17} style={{ cursor: "pointer" }} onClick={handlePostClick}/>
                  <LuSend size={17} style={{ cursor: "pointer" }} />
                </div>
                <span className="text-muted" style={{ fontSize: "14px" }}>
                  {post.likes} likes
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
