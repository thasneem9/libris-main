import DefaultLayout from "../DefaultLayout/DefaultLayout";
import { Card, Container, Row, Col, FormControl, Button, Stack } from "react-bootstrap";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { useState } from "react";

import avatar1 from "../../images/avatar1.png";
import avatar2 from "../../images/avatar2.png";
import avatar3 from "../../images/avatar3.png";
import './styles/feedpage.css'
function FeedPage() {
  const [input, setInput] = useState("");

  const posts = [
    {
      id: 1,
      author: "Diana",
      time: "2d",
      avatar: avatar2,
      text: `“Reading isn't just escape. It’s access to a better self.”\n\nFinished *Atomic Habits* yesterday. I never imagined habit theory could be this practical. Anyone else found it life-changing?`,
      likes: 148,
    },
    {
      id: 2,
      author: "Lark",
      time: "1d",
      avatar: avatar3,
      text: `Just started *The Midnight Library* by Matt Haig. The concept of parallel lives hit me harder than expected.\n\nHas anyone here read it? Would love to hear your interpretation of the ‘regret’ theme.`,
      likes: 92,
    },
    {
      id: 3,
      author: "Mina",
      time: "12h",
      avatar: avatar1,
      text: `“A reader lives a thousand lives before he dies.” – George R.R. Martin\n\nDo you think re-reading a book counts as a different life? I’ve read *Pride and Prejudice* 4 times and still find new things each read.`,
      likes: 210,
    },
    {
      id: 4,
      author: "Eli",
      time: "5m",
      avatar: avatar2,
      text: `What’s a book that made you stop and just... think?\n\nFor me, it was *Man's Search for Meaning*. Nothing else made me reflect so deeply on suffering, purpose, and survival.`,
      likes: 37,
    },
  ];

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
              <Button variant="primary" className="w-100">
                Post
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Feed Posts */}
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 shadow-sm rounded-4">
            <Card.Body>
              <Stack direction="horizontal" gap={3} className="mb-2 align-items-start">
                <img
                  src={post.avatar}
                  alt="avatar"
                  style={{ width: 44, height: 44, borderRadius: "50%" }}
                />
                <div className="flex-grow-1">
                  <div style={{ fontWeight: 600 }}>{post.author}</div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>
                    {post.time}
                  </div>
                </div>
              </Stack>

              <Card.Text style={{ whiteSpace: "pre-wrap", fontSize: "15px" }}>
                {post.text}
              </Card.Text>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex gap-3 align-items-center">
                  <FaHeart size={18} color="#ff1f1fda" style={{ cursor: "pointer" }} />
                  <FaRegComment size={17} style={{ cursor: "pointer" }} />
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
