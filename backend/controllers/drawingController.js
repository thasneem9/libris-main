import Drawing from '../models/Drawing.js'
import admin from "firebase-admin"
import { db } from "../firebase/firebaseAdmin.js";
export const getDrawings = async (req, res) => {
  try {
    const { bookId, page } = req.query;

    if (!bookId) return res.status(400).json({ error: "bookId is required" });

    let query = db.collection("drawings").where("bookId", "==", bookId);

    if (page) {
      query = query.where("page", "==", page);
    }

    const snapshot = await query.get();
    const drawings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(drawings);
  } catch (err) {
    console.error("Fetch failed:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
};


export const createDrawing = async (req, res) => {
  try {
    const data = req.body;

    const docRef = await db.collection("drawings").add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const savedDoc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...savedDoc.data() });
  } catch (err) {
    console.error("Create failed:", err);
    res.status(400).json({ error: "Create failed" });
  }
};
export const deleteDrawing = async (req, res) => {
  try {
    const drawingId = req.params.id;

    await db.collection("drawings").doc(drawingId).delete();
    res.json({ success: true });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(400).json({ error: "Delete failed" });
  }
};



/* export const getDrawings = async (req, res) => {
  try {
    const { bookId, page } = req.query;
    const query = { bookId };
    if (page) query.page = page;
    const drawings = await Drawing.find(query);
    res.json(drawings);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

export const createDrawing = async (req, res) => {
  try {
    const drawing = await Drawing.create(req.body);
    res.status(201).json(drawing);
  } catch (err) {
    res.status(400).json({ error: 'Create failed' });
  }
};

export const deleteDrawing = async (req, res) => {
  try {
    await Drawing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
};
 */