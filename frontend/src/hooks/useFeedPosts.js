import { useState, useEffect } from "react";
import axios from "axios";

const useFeedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/posts/getAll', { withCredentials: true });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

// ✅ inside useFeedPosts.js
return { posts, loading, refetch: fetchPosts, setPosts };

};


export default useFeedPosts;
