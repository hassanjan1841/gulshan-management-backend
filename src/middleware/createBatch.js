import { body } from "express-validator";

export const createBatchValidation = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters")
    .not()
    .isEmpty()
    .withMessage("Title is required"),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters")
    .not()
    .isEmpty()
    .withMessage("Description is required"),
  body("course")
    .isMongoId()
    .withMessage("Course ID must be a valid MongoDB ObjectId")
    .not()
    .isEmpty()
    .withMessage("Course is required"),
];
