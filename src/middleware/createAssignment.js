import { body } from "express-validator";

export const createAssignmentValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1 })
    .withMessage("Title must be at least 1 character long"),

  body("section")
    .notEmpty()
    .withMessage("Section ID is required")
    .isMongoId()
    .withMessage("Section ID must be a valid MongoDB ObjectId"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("pictures")
    .optional()
    .isArray()
    .withMessage("Pictures must be an array")
    .custom((pictures) => {
      // Validate each picture object
      for (const picture of pictures) {
        if (
          typeof picture.fileName !== "string" ||
          typeof picture.fileType !== "string" ||
          !(picture.data instanceof Buffer)
        ) {
          throw new Error("Each picture must include valid data, fileName, and fileType");
        }
      }
      return true;
    }),
];
