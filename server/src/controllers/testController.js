import { MockTest, TestAttempt } from '../models/Test.js';

// @desc    Get all available mock tests
// @route   GET /api/tests
// @access  Public
export const getMockTests = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'ALL') {
      filter.examCategory = category;
    }

    // Omit questions and answer keys on catalog overview
    const tests = await MockTest.find(filter).select('-questions');
    return res.status(200).json({ success: true, count: tests.length, tests });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Start / Resume Exam Attempt
// @route   POST /api/tests/:id/start
// @access  Private (Student)
export const startTestAttempt = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await MockTest.findById(testId);

    if (!test) {
      return res.status(404).json({ success: false, message: 'Mock test not found.' });
    }

    // Check if an in-progress attempt already exists
    let attempt = await TestAttempt.findOne({
      user: req.user._id,
      test: testId,
      status: 'IN_PROGRESS',
    });

    if (!attempt) {
      // Create new attempt with empty answer template
      const initialAnswers = test.questions.map((q, idx) => ({
        questionIndex: idx,
        selectedOption: -1,
        isMarkedForReview: false,
        isCorrect: false,
      }));

      attempt = await TestAttempt.create({
        user: req.user._id,
        test: testId,
        startTime: new Date(),
        answers: initialAnswers,
        totalUnattempted: test.questions.length,
        status: 'IN_PROGRESS',
      });
    }

    // Sanitize questions: DO NOT expose correctOptionIndex or explanation while in test room!
    const sanitizedQuestions = test.questions.map((q, idx) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      subjectTopic: q.subjectTopic,
      difficulty: q.difficulty,
      orderIndex: idx,
    }));

    return res.status(200).json({
      success: true,
      attemptId: attempt._id,
      test: {
        id: test._id,
        title: test.title,
        durationMinutes: test.durationMinutes,
        totalMarks: test.totalMarks,
        positiveMarks: test.positiveMarks,
        negativeMarks: test.negativeMarks,
      },
      startTime: attempt.startTime,
      answers: attempt.answers,
      questions: sanitizedQuestions,
    });
  } catch (error) {
    console.error('Start Test Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save In-Progress Test Answers (Heartbeat / Persistence)
// @route   POST /api/tests/attempt/:attemptId/save-progress
// @access  Private (Student)
export const saveTestProgress = async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id,
      status: 'IN_PROGRESS',
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Active attempt not found.' });
    }

    if (Array.isArray(answers)) {
      attempt.answers = answers;
      await attempt.save();
    }

    return res.status(200).json({ success: true, message: 'Responses synchronized.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Test & Calculate Authoritative Result Breakdown
// @route   POST /api/tests/attempt/:attemptId/submit
// @access  Private (Student)
export const submitTestAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await TestAttempt.findOne({
      _id: req.params.attemptId,
      user: req.user._id,
    }).populate('test');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found.' });
    }

    const test = attempt.test;
    const submittedAnswers = answers || attempt.answers;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    const evaluatedAnswers = [];
    const topicStats = {};

    test.questions.forEach((q, idx) => {
      const userAnswer = submittedAnswers.find((a) => a.questionIndex === idx) || { selectedOption: -1, isMarkedForReview: false };
      const isAttempted = userAnswer.selectedOption !== -1;
      const isCorrect = isAttempted && userAnswer.selectedOption === q.correctOptionIndex;

      if (!topicStats[q.subjectTopic]) {
        topicStats[q.subjectTopic] = { topic: q.subjectTopic, correct: 0, total: 0 };
      }
      topicStats[q.subjectTopic].total += 1;

      if (!isAttempted) {
        unattemptedCount += 1;
      } else if (isCorrect) {
        correctCount += 1;
        topicStats[q.subjectTopic].correct += 1;
      } else {
        incorrectCount += 1;
      }

      evaluatedAnswers.push({
        questionIndex: idx,
        questionText: q.questionText,
        options: q.options,
        selectedOption: userAnswer.selectedOption,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
        subjectTopic: q.subjectTopic,
      });
    });

    const calculatedScore = Math.max(
      0,
      Number((correctCount * test.positiveMarks - incorrectCount * test.negativeMarks).toFixed(2))
    );
    const percentage = Number(((calculatedScore / test.totalMarks) * 100).toFixed(1));

    attempt.answers = evaluatedAnswers;
    attempt.score = calculatedScore;
    attempt.totalCorrect = correctCount;
    attempt.totalIncorrect = incorrectCount;
    attempt.totalUnattempted = unattemptedCount;
    attempt.percentage = percentage;
    attempt.status = 'SUBMITTED';
    attempt.submitTime = new Date();
    attempt.topicBreakdown = Object.values(topicStats);

    await attempt.save();

    return res.status(200).json({
      success: true,
      message: 'Exam submitted successfully! Results evaluated.',
      results: {
        score: attempt.score,
        totalMarks: test.totalMarks,
        passMarks: test.passMarks,
        isPassed: attempt.score >= test.passMarks,
        percentage: attempt.percentage,
        totalCorrect: attempt.totalCorrect,
        totalIncorrect: attempt.totalIncorrect,
        totalUnattempted: attempt.totalUnattempted,
        topicBreakdown: attempt.topicBreakdown,
        evaluatedAnswers: attempt.answers,
      },
    });
  } catch (error) {
    console.error('Submit Test Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Student Test Attempt History
// @route   GET /api/tests/my/history
// @access  Private (Student)
export const getMyTestHistory = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({ user: req.user._id, status: 'SUBMITTED' })
      .populate('test', 'title examCategory totalMarks durationMinutes')
      .sort({ submitTime: -1 });

    return res.status(200).json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
