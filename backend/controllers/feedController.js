import { db } from '../firebase/firebaseAdmin.js';


const createPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { content } = req.body;

    if (!content || !userId) {
      return res.status(400).json({ message: 'Missing content or userId' });
    }

    // 🔍 Fetch user's data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    const username = userData.username || "anonymous"; // fallback
    const avatar = userData.avatar || null; // optional

    // 📝 Add username & optional avatar to post
    const newPost = {
      content,
      userId,
      username,
      avatar, // optional field for UI
      likes: [],
      comments: [],
      createdAt: new Date()
    };

    const postRef = await db.collection('posts').add(newPost);
    const createdPost = await postRef.get();

    res.status(201).json({ id: postRef.id, ...createdPost.data() });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};


// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Get a single post by ID
const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const postRef = db.collection('posts').doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const postData = { id: postSnap.id, ...postSnap.data() };
    res.status(200).json(postData);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// Update a post's content
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const postRef = db.collection('posts').doc(postId);
    await postRef.update({ content });

    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    await db.collection('posts').doc(postId).delete();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

// Like or unlike a post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.userId;

    const postRef = db.collection('posts').doc(postId);
    const postSnap = await postRef.get();

    if (!postSnap.exists) return res.status(404).json({ message: 'Post not found' });

    const post = postSnap.data();
    const likes = post.likes || [];

    const updatedLikes = likes.includes(userId)
      ? likes.filter(id => id !== userId)  // Unlike
      : [...likes, userId];                // Like

    await postRef.update({ likes: updatedLikes });

    res.status(200).json({ message: 'Like toggled successfully' });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

const addComment = async (req, res) => {
  try {
    console.log("💬 [addComment] POST triggered");

    const userId = req.userId;
    const { postId } = req.params;
    const { comment, replyToUsername } = req.body;


    console.log("🔐 userId:", userId);
    console.log("🆔 postId:", postId);
    console.log("📝 comment:", comment);
    console.log("↩️ replyTo:", replyToUsername);

    if (!userId || !postId || !comment) {
      return res.status(400).json({ message: "Missing data in request" });
    }

    const postRef = db.collection('posts').doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) return res.status(404).json({ message: 'Post not found' });

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });

    const { username } = userDoc.data();
const avatar = userDoc.data().avatar || null; // fallback if missing


    const newComment = {
      id: db.collection('posts').doc().id,
      userId,
      username,
      avatar,
      comment,
      replyToUsername: replyToUsername || null,
      createdAt: new Date(),
      likes: []
    };

    const comments = postSnap.data().comments || [];
    comments.push(newComment);

    await postRef.update({ comments });

    return res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error("🔥 [addComment] Backend Error:", error);
    return res.status(500).json({ message: 'Failed to add comment' });
  }
};


export {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getSinglePost
};
