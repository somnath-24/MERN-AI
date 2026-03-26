import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  completedTopics: [String],
  scores: [{
    topic: String,
    score: Number,
    total: Number,
    difficulty: String,
    date: { type: Date, default: Date.now }
  }],
  totalAttempted: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 }
});

export const Progress = mongoose.model('Progress', ProgressSchema);

const RoadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  focus: String,
  level: String,
  tracks: {
    frontend: [{
      title: String,
      completed: { type: Boolean, default: false }
    }],
    backend: [{
      title: String,
      completed: { type: Boolean, default: false }
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

export const Roadmap = mongoose.model('Roadmap', RoadmapSchema);
