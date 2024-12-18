import { body } from 'express-validator';

export const assignmentValidationRules = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim(),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),

  body('referencePicture')
    .optional()
    .isString()
    .withMessage('Reference picture must be a string (URL)')
    .isURL()
    .withMessage('Reference picture must be a valid URL'),

  body('section')
    .notEmpty()
    .withMessage('Section is required')
    .isMongoId()
    .withMessage('Section must be a valid MongoDB ObjectId'),

  body('createdBy')
    .notEmpty()
    .withMessage('Creator (Teacher) is required')
    .isMongoId()
    .withMessage('Creator must be a valid MongoDB ObjectId'),
];