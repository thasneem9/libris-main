import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import {
  Container, Card, Row, Col, FormControl, Button, Stack
} from "react-bootstrap";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { LuReply } from "react-icons/lu";
import avatar1 from "../../images/avatar1.png";
import useSinglePost from "../../hooks/useSinglePost.JS";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import { LuSend } from "react-icons/lu";


export default function ViewPost() {
  const { postId } = useParams();
  const { post, loading, refetch } = useSinglePost(postId);

  const [commentInput, setCommentInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const inputRef = useRef(null);
  const user = useRecoilValue(userAtom);
const userId = user.userId;


  const handleReplyClick = (username) => {
    const mention = `@${username} `;
    if (!commentInput.includes(mention)) {
      setCommentInput((prev) => `${mention}${prev}`.trim());
    }
    setReplyTo(username);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    try {
      await axios.post(`/api/posts/comment/${postId}`, {
        comment: commentInput,
        replyToUsername: replyTo || null
      }, { withCredentials: true });

      setCommentInput("");
      setReplyTo(null);
      await refetch();
    } catch (err) {
      console.error("🔥 Failed to post comment:", err.response?.data || err.message);
    }
  };
  const handleToggleLike = async () => {
  if (!userId) {
    console.log("no userId");
    return;
  }

  console.log("💥 Like toggled for post:", postId);

  try {
    await axios.post(`/api/posts/like/${postId}`, {}, { withCredentials: true });

    // Toggle like state locally
    const liked = post.likes.includes(userId);
    const newLikes = liked
      ? post.likes.filter((id) => id !== userId)
      : [...post.likes, userId];

    post.likes = newLikes;
    refetch(); // optional: refresh from backend
  } catch (err) {
    console.error("Error liking post:", err.response?.data || err.message);
    toast?.error("Failed to like post");
  }
};


  const highlightMentions = (text) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith("@")
        ? <span key={i} style={{ color: "#007bff" }}>{part}</span>
        : part
    );
  };

  if (loading) return <DefaultLayout><Container><p>Loading...</p></Container></DefaultLayout>;

  return (
    <DefaultLayout>
      <Container style={{ maxWidth: "540px", padding: "24px 0" }}>
        {/* Post Card */}
        <Card className="mb-4 shadow-sm rounded-4 border-info border-2">
          <Card.Body>
            <Stack direction="horizontal" gap={3} className="mb-2 align-items-start">
              <img src={post.avatar || avatar1} alt="avatar" style={{ width: 44, height: 44, borderRadius: "50%" }} />
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
            <div className="d-flex gap-3 align-items-center">
             {(() => {
  const liked = post.likes.includes(userId);
  return (
    <FaHeart
      size={18}
      color={liked ? "#ff1f1fda" : "#aaa"}
      style={{ cursor: "pointer" }}
      onClick={handleToggleLike}
    />
  );
})()

}



              <FaRegComment size={17} />
               <LuSend size={17} style={{ cursor: "pointer" }} />
                 <span className="text-muted" style={{ fontSize: "14px" }}>
  {post.likes?.length || 0} likes
</span>
            </div>
          </Card.Body>
        </Card>

        {/* Add Comment */}
        <Card className="mb-4 shadow-sm p-3">
          <Row className="align-items-center">
            <Col xs={9}>
              <FormControl
                ref={inputRef}
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

        {/* Comment List */}
        {post.comments?.map((c) => (
          <Card key={c.id} className="mb-3 shadow-sm rounded-3">
            <Card.Body>
              <Stack direction="horizontal" gap={3} className="mb-2 align-items-start">
                <img src={c.avatar || avatar1} alt="avatar" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                <div>
                  <div style={{ fontWeight: 500 }}>{c.username}</div>
                  <div className="text-muted" style={{ fontSize: "12px" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </Stack>
              <div style={{ fontSize: "14px", marginLeft: 48 }}>
                {highlightMentions(c.comment)}
              </div>
              <div className="d-flex gap-3 mt-2" style={{ marginLeft: 48 }}>
                <FaHeart size={16} style={{ cursor: "pointer" }} />
                <LuReply size={16} style={{ cursor: "pointer" }} onClick={() => handleReplyClick(c.username)} />
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </DefaultLayout>
  );
}
