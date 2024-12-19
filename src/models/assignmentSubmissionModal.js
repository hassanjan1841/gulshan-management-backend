
import mongoose from "mongoose";
const assignmentSubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submission: {
        type: mongoose.Schema.Types.Mixed, // Can store file paths, text, or other data
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    gradedAt: {
        type: Date
    },
    grade: {
        type: Number
    },
    isLate: {
        type: Boolean,
        default: false
    }
});

const AssignmentSubission = mongoose.model('AssignmentSubission', assignmentSubmissionSchema)
export default AssignmentSubission