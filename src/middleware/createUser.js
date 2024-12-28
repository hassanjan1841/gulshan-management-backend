// validation.js
import { body } from "express-validator";

export const validateStudent = [
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Phone number must be valid"),
  body("cnic")
    .notEmpty()
    .withMessage("CNIC is required")
    .isLength({ min: 13, max: 13 })
    .withMessage("CNIC must be exactly 13 characters"),
  body("date_of_birth")
    .isDate()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),
  body("father_name")
    .optional()
    .isString()
    .withMessage("Father's name must be a string"),
  body("father_cnic")
    .optional()
    .isLength({ min: 13, max: 13 })
    .withMessage("Father's CNIC must be exactly 13 characters"),
  body("last_qualification")
    .optional()
    .isString()
    .withMessage("Last qualification must be a string"),
  body("computer_proficiency")
    .isIn(["Basic", "Intermediate", "Advanced"])
    .withMessage(
      "Computer proficiency must be Basic, Intermediate, or Advanced"
    ),
  body("country").optional().isString().withMessage("Country must be a string"),
  body("has_laptop")
    .optional()
    .isBoolean()
    .withMessage("Has laptop must be a boolean value"),
  body("section")
    .optional()
    .isObject()
    .withMessage("Section must be a valid Object"),
  body("role")
    .isIn(["admin", "teacher", "student"])
    .withMessage("Role must be one of admin, teacher, or student"),
];

export const validateTeacher = [
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Phone number must be valid"),
  body("cnic")
    .notEmpty()
    .withMessage("CNIC is required")
    .isLength({ min: 13, max: 13 })
    .withMessage("CNIC must be exactly 13 characters"),
  body("date_of_birth")
    .isDate()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString()
    .withMessage("Address must be a string"),
  body("qualifications")
    .isArray({ min: 1 })
    .withMessage("At least one qualification is required")
    .bail()
    .custom((value) => value.every((v) => typeof v === "string"))
    .withMessage("Each qualification must be a string"),
  body("experience")
    .isInt({ min: 0 })
    .withMessage("Experience must be a positive integer")
    .notEmpty()
    .withMessage("Experience is required"),
  body("subjects")
    .isArray({ min: 1 })
    .withMessage("At least one subject is required")
    .bail()
    .custom((value) => value.every((v) => typeof v === "string"))
    .withMessage("Each subject must be a string"),
  body("salary")
    .isFloat({ min: 0 })
    .withMessage("Salary must be a positive number")
    .notEmpty()
    .withMessage("Salary is required"),
  body("joining_date")
    .isISO8601()
    .withMessage("Joining date must be a valid date")
    .notEmpty()
    .withMessage("Joining date is required"),
  body("office_location")
    .isString()
    .withMessage("Office location must be a string")
    .notEmpty()
    .withMessage("Office location is required"),
  body("role")
    .isIn(["admin", "teacher", "student"])
    .withMessage("Role must be one of admin, teacher, or student"),
];
