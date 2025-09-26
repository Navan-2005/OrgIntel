import { FlashcardsBlock } from "./FlashcardsBlock";

export const FlashcardsDemo = () => {
  const sampleData = {
    title: "Machine Learning Fundamentals",
    totalCount: 8,
    flashcards: [
      {
        id: "1",
        question: "What is supervised learning?",
        answer: "A type of machine learning where the model learns from labeled training data to make predictions on new, unseen data.",
        category: "Core Concepts"
      },
      {
        id: "2", 
        question: "What is the difference between overfitting and underfitting?",
        answer: "Overfitting occurs when a model learns the training data too well and fails to generalize. Underfitting occurs when a model is too simple to capture the underlying patterns.",
        category: "Model Performance"
      },
      {
        id: "3",
        question: "What is cross-validation?",
        answer: "A technique for assessing model performance by splitting the dataset into multiple folds and training/testing on different combinations.",
        category: "Validation"
      },
      {
        id: "4",
        question: "What is the purpose of feature scaling?",
        answer: "To normalize features to similar ranges so that no single feature dominates the learning process due to its scale.",
        category: "Data Preprocessing"
      },
      {
        id: "5",
        question: "What is gradient descent?",
        answer: "An optimization algorithm that iteratively adjusts model parameters to minimize the cost function by moving in the direction of steepest descent.",
        category: "Optimization"
      }
    ]
  };

  return <FlashcardsBlock data={sampleData} />;
};