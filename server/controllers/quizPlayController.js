import Quiz from '../models/Quiz.js';
import User from '../models/User.js';

// =============================
// @desc    Fetch quiz by ID (for play)
// @route   GET /quiz/play/:id
// =============================
// Fetch a quiz by ID for playing (excludes correct answers)
export const getQuizForPlay = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate quiz ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid quiz ID format' });
        }

        const quiz = await Quiz.findById(id);

        // Return 404 if quiz not found
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Prepare questions without revealing correct answers
        const filteredQuestions = quiz.questions.map((q) => ({
            _id: q._id,
            questionText: q.questionText,
            difficulty: q.difficulty,
            options: q.options.map((opt) => ({ _id: opt._id, text: opt.text }))
        }));

        res.status(200).json({
            quizId: quiz._id,
            title: quiz.title,
            category: quiz.category,
            questions: filteredQuestions
        });
    } catch (err) {
        console.error('Error in getQuizForPlay:', err.message);
        res.status(500).json({ message: 'Something went wrong while fetching quiz' });
    }
};

// =============================
// @desc    Submit quiz answers
// @route   POST /quiz/play/submit
// =============================
export const submitQuizAnswer = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    // Validate input
    if (!quizId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'quizId and answers are required' });
    }

    // Validate quizId format
    if (!quizId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid quiz ID format' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    let total = quiz.questions.length;
    let feedback = [];

    quiz.questions.forEach((question) => {
      const submittedAnswer = answers.find(ans => ans.questionId === String(question._id));
      const correctOption = question.options.find(opt => opt.isCorrect);

      if (!correctOption) {
        feedback.push({
          questionId: question._id,
          correct: false,
          error: 'No correct option configured for this question'
        });
        return; // Skip scoring this question
      }

      if (submittedAnswer && submittedAnswer.optionId === String(correctOption._id)) {
        score++;
        feedback.push({ questionId: question._id, correct: true });
      } else {
        feedback.push({ questionId: question._id, correct: false });
      }
    });

    // Update user's score history
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          scoreHistory: {
            quizId: quiz._id,
            score,
            total
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Quiz submitted successfully',
      score,
      total,
      feedback
    });
  } catch (err) {
    console.error('Error in submitQuizAnswer:', err.message);
    res.status(500).json({ message: 'Something went wrong while submitting answers' });
  }
};

