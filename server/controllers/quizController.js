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
    console.error('Create Quiz Error:', error.message);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// =============================
// @desc    Get all quizzes (optionally filter by category)
// @route   GET /quiz
// =============================
export const getAllQuizzes = async (req, res) => {
  try {
    const category = req.query.category;
    const filter = category ? { category } : {};

    const quizzes = await Quiz.find(filter).select('title category createdAt');
    res.status(200).json(quizzes);
  } catch (err) {
    console.error('Get Quizzes Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// @desc    Get quiz by ID
// @route   GET /quiz/:id
// =============================
export const getQuizById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Quiz ID is required' });
    }
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: `Quiz not found with id: ${id}` });
    }
    res.status(200).json(quiz);
  } catch (err) {
    console.error('Get Quiz By ID Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




