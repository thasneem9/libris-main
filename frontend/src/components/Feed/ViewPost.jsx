import DefaultLayout from "../DefaultLayout/DefaultLayout";
import {
  Card,
  Container,
  Row,
  Col,
  FormControl,
  Button,
  Stack,
} from "react-bootstrap";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { LuReply } from "react-icons/lu";
import { useState } from "react";

import avatar1 from "../../images/avatar1.png";
import avatar2 from "../../images/avatar2.png";
import avatar3 from "../../images/avatar3.png";

const dummyPost = {
  id: 101,
  username: "Eli",
  time: "2h ago",
  avatar: avatar2,
  content: `“A reader lives a thousand lives before he dies.”\n\nWhat are your thoughts on rereading books?`,
  likes: 120,
};

const dummyComments = [
  {
    id: 1,
    username: "Mina",
    avatar: avatar1,
    comment: "Rereading makes me feel like I’m growing alongside the book.",
    time: "1h ago",
    replies: [],
  },
  {
    id: 2,
    username: "Diana",
    avatar: avatar3,
    comment: "Absolutely! I noticed different themes when I reread *The Alchemist* last month.",
    time: "35m ago",
    replies: [
      {
        id: "2a",
        username: "Lark",
        avatar: avatar1,
        comment: "Same here! My second read felt completely different.",
        time: "20m ago",
      },
      {
        id: "2b",
        username: "Mina",
        avatar: avatar2,
        comment: "What did you notice differently the second time?",
        time: "15m ago",
      },
    ],
  },
];

export default function Viewpost() {
  const [commentInput, setCommentInput] = useState("");

  const handleAddComment = () => {
    if (commentInput.trim()) {
      alert("Submit comment to backend");
      setCommentInput("");
    }
  };

  return (
    <DefaultLayout>
      <Container style={{ maxWidth: "540px", padding: "24px 0" }}>
        {/* Selected Post */}
        <Card className="mb-4 shadow-sm rounded-4 border-info border-2">
          <Card.Body>
            <Stack direction="horizontal" gap={3} className="mb-2 align-items-start">
              <img
                src={dummyPost.avatar}
                alt="avatar"
                style={{ width: 44, height: 44, borderRadius: "50%" }}
              />
              <div className="flex-grow-1">
                <div style={{ fontWeight: 600 }}>{dummyPost.username}</div>
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  {dummyPost.time}
                </div>
              </div>
            </Stack>

            <Card.Text style={{ whiteSpace: "pre-wrap", fontSize: "15px" }}>
              {dummyPost.content}
            </Card.Text>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="d-flex gap-3 align-items-center">
                <FaHeart size={18} color="#ff1f1fda" style={{ cursor: "pointer" }} />
                <FaRegComment size={17} style={{ cursor: "pointer" }} />
              </div>
              <span className="text-muted" style={{ fontSize: "14px" }}>
                {dummyPost.likes} likes
              </span>
            </div>
          </Card.Body>
        </Card>

        {/* Add New Comment */}
        <Card className="mb-4 shadow-sm p-3">
          <Row className="align-items-center">
            <Col xs={9}>
              <FormControl
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
            </Col>
            <Col xs={3}>
              <Button className="w-100" variant="primary" onClick={handleAddComment}>
                Comment
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Threaded Comments */}
        {dummyComments.map((c) => (
          <Card key={c.id} className="mb-3 shadow-sm rounded-3">
            <Card.Body>
              {/* Main comment */}
              <Stack direction="horizontal" gap={3} className="mb-2 align-items-start">
                <img
                  src={c.avatar}
                  alt="avatar"
                  style={{ width: 36, height: 36, borderRadius: "50%" }}
                />
                <div>
                  <div style={{ fontWeight: 500 }}>{c.username}</div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>{c.time}</div>
                </div>
              </Stack>

              <div style={{ fontSize: "14px", marginLeft: 48 }}>{c.comment}</div>

              <div className="d-flex gap-3 mt-2" style={{ marginLeft: 48 }}>
                <FaHeart size={16} style={{ cursor: "pointer" }} />
                <LuReply size={16} style={{ cursor: "pointer" }} />
              </div>

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="mt-3" style={{ marginLeft: 48 }}>
                  {c.replies.map((r) => (
                    <div key={r.id} className="mb-3 ps-3 border-start">
                      <Stack direction="horizontal" gap={3} className="mb-2 align-items-start">
                        <img
                          src={r.avatar}
                          alt="avatar"
                          style={{ width: 30, height: 30, borderRadius: "50%" }}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{r.username}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>{r.time}</div>
                        </div>
                      </Stack>

                      <div style={{ fontSize: "14px", marginLeft: 38 }}>{r.comment}</div>

                      <div className="d-flex gap-3 mt-2" style={{ marginLeft: 38 }}>
                        <FaHeart size={15} style={{ cursor: "pointer" }} />
                        <LuReply size={15} style={{ cursor: "pointer" }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </Container>
    </DefaultLayout>
  );
}
