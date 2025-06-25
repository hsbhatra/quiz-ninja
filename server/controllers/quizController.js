import Quiz from '../models/Quiz.js';

// =============================
// @desc    Create a new quiz (Admin only)
// @route   POST /quiz/create
// @access  Admin
// =============================
export const createQuiz = async (req, res) => {
  try {
    const { title, category, questions } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({ message: 'Quiz title is required' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Quiz category is required' });
    }
    if (!questions) {
      return res.status(400).json({ message: 'Quiz questions are required' });
    }
    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Questions must be an array' });
    }

    // Create and save quiz
    const quiz = new Quiz({
      title,
      category,
      questions,
      createdBy: req.user._id, // from JWT
    });

    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz,
    });
  } catch (error) {
    console.error('Create Quiz Error:', error);
    res.status(500).json({ message: 'Server error while creating quiz' });
  }
};

