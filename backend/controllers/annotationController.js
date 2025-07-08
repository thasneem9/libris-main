import Annotation from '../models/Annotation.js';
import streamifier from 'streamifier'
import admin from "firebase-admin"
import { db } from "../firebase/firebaseAdmin.js";
// GET: all annotations for a book
export const get = async (req, res) => {
  const { bookId } = req.query;
  if (!bookId) return res.status(400).json({ error: 'bookId required' });
  const list = await Annotation.find({ bookId }).lean();
  res.json(list);
};

export const getAnn = async (req, res) => {
  const { bookId } = req.query;
  if (!bookId) return res.status(400).json({ error: 'bookId required' });

  try {
    const snapshot = await db.collection('annotations')
      .where('bookId', '==', bookId)
      .get();

    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(list);
  } catch (error) {
    console.error("Error fetching annotations:", error);
    res.status(500).json({ error: "Failed to fetch annotations" });
  }
};

/* 
export const save = async (req, res) => {
  const data = new Annotation(req.body);
  await data.save();
  res.status(201).json(data);
};
export const update = async (req, res) => {
  try {
 

    const updated = await Annotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Server error during annotation update' });
  }
};
export const del = async (req, res) => {
  await Annotation.findByIdAndDelete(req.params.id);
  res.status(204).end();
}; */


export const saveAnn = async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection('annotations').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const savedDoc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...savedDoc.data() });
  } catch (err) {
    console.error('Save failed:', err);
    res.status(500).json({ message: 'Failed to save annotation' });
  }
};
export const updateAnn = async (req, res) => {
  try {
    const annotationId = req.params.id;
    const updateData = req.body;

    const docRef = db.collection('annotations').doc(annotationId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Annotation not found' });
    }

    await docRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Server error during annotation update' });
  }
};

export const delAnn = async (req, res) => {
  try {
    const annotationId = req.params.id;

    await db.collection('annotations').doc(annotationId).delete();
    res.status(204).end();
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ message: 'Failed to delete annotation' });
  }
};
