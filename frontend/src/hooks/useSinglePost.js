import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useSinglePost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/posts/getOne/${postId}`, {
        withCredentials: true,
      });
      setPost(res.data);
    } catch (err) {
      console.error("Failed to fetch single post:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return { post, loading, refetch: fetchPost };
};

export default useSinglePost;
