import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

// ระบบดูข้อมูลคำถามทั้งหมด
questionRouter.get("/", async (req, res) => {
  const collection = db.collection("questions");

  try {
    const questions = await collection.find({}).toArray();
    return res.json({
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//ระบบดูคำถามด้วย id
questionRouter.get("/:questionId", async (req, res) => {
  const collection = db.collection("questions");
  try {
    const questionId = new ObjectId(req.params.questionId);
    const question = await collection.findOne({ _id: questionId });
    return res.json({
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Cannot fetch question ID: ${questionId}`,
    });
  }
});

// ระบบสร้างคำถาม
questionRouter.post("/", async (req, res) => {
  const collection = db.collection("questions");

  const questionData = { ...req.body };
  try {
    const question = await collection.insertOne(questionData);
    return res.json({
      data: questionData,
      message: `question (${question.insertedId}) has been created successfully`,
    });
  } catch (error) {
    console.error("Error posting question:", error);
    return res.status(500).json({
      message: "Cannot post question",
    });
  }
});

// ระบบแก้ไขคำถาม
questionRouter.put("/:questionId", async (req, res) => {
  const collection = db.collection("questions");

  try {
    const questionId = new ObjectId(req.params.questionId);
    const newQueationData = { ...req.body };
    await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: newQueationData,
      }
    );
    return res.json({
      message: `Question (${questionId}) has been updated`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot update question",
    });
  }
});

// ระบบลบคำถาม
questionRouter.delete("/:questionId", async (req, res) => {
  const collection = db.collection("questions");

  try {
    const questionId = new ObjectId(req.params.questionId);
    await collection.deleteOne({ _id: questionId });
    return res.json({
      message: `Question (${questionId}) has been deleted`,
    });
  } catch (error) {
    return req.status(500).json({
      message: "Cannot delete question",
    });
  }
});

export default questionRouter;
