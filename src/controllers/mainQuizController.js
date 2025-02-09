import Quiz from "../models/MainQuizModel.js";

// CREATE a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, course, batch, questions } = req.body;

    const newQuiz = new Quiz({ title, course, batch, questions });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz created successfully", newQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const { courseId, batchId } = req.query;
    const query = {};
    // console.log(req.query);
    if (courseId && courseId !== "undefined") {
      query.course = courseId;
    }

    if (batchId && batchId !== "undefined") {
      query.batch = batchId;
    }

    const quizzes = await Quiz.find(query).populate("course batch");
    // console.log(quizzes, "query", query);
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found." });
    }
    const quizzesWithQuestionCount = quizzes.map((quiz) => ({
      ...quiz.toObject(),
      numberOfQuestions: quiz.questions.length,
      questions: undefined, // Remove the questions array
    }));
    res.status(200).json({ quizzes: quizzesWithQuestionCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ a single quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate("course batch");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a quiz by ID
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log("update quiz", req.body);
    console.log(updatedQuiz);

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz updated successfully", updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a quiz by ID
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all questions from a specific quiz by ID
export const getAllQuestionsFromQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ questions: quiz.questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD a question to a specific quiz by ID
export const addQuestionToQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    // console.log(req.body);
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions.push(question);
    await quiz.save();

    res.status(200).json({ message: "Question added successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateQuestionInQuiz = async (req, res) => {
  try {
    const { id, questionId } = req.params;
    const { question, options, correctAnswer, type } = req.body;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionIndex = quiz.questions.findIndex(
      (q) => q._id.toString() === questionId
    );

    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found" });
    }
    // console.log(req.body);

    // Update only the fields that are provided in the request body
    if (question !== undefined)
      quiz.questions[questionIndex].question = question;
    if (options !== undefined) quiz.questions[questionIndex].options = options;
    if (correctAnswer !== undefined)
      quiz.questions[questionIndex].correctAnswer = correctAnswer;
    if (type !== undefined) quiz.questions[questionIndex].type = type;

    await quiz.save();

    res.status(200).json({ message: "Question updated successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a question from a specific quiz by quiz ID and question ID
export const deleteQuestionFromQuiz = async (req, res) => {
  try {
    const { id, questionId } = req.params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions = quiz.questions.filter(
      (q) => q._id.toString() !== questionId
    );
    await quiz.save();

    res.status(200).json({ message: "Question deleted successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// READ a single question from a specific quiz by quiz ID and question ID
export const getQuestionFromQuiz = async (req, res) => {
  try {
    const { id, questionId } = req.params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = quiz.questions.find(
      (q) => q._id.toString() === questionId
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
