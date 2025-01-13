import { createAssignmentValidation } from "../middleware/createAssignment.js";
// import { User, Teacher, Student } from "../models/userModel.js";

// Create a new user
const createAssignment = async (req, res) => {
  try {
    const errors = createAssignmentValidation(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }   
    res.send("dood")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin access only)
// const getAllAssignment = async (req, res) => {
//   try {
//     const { role, status, batch, teacher, course, search } = req.query;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     // console.log("search filter in backend>>", search);

//     const filter = {};
//     if (role && role !== "undefined") filter.role = role;
//     if (status && status !== "undefined")
//       filter.is_passed_out = status == "false" ? false : true;
//     if (batch && batch !== "undefined") filter["section.batch._id"] = batch;
//     if (teacher && teacher !== "undefined")
//       filter["section.teacher._id"] = teacher;
//     if (course && course !== "undefined") filter["course"] = course;
//     console.log("filter", filter);
//     if (search && search !== "undefined") {
//       filter["full_name"] = { $regex: search, $options: "i" };
//     }
//     const Model = !role ? User : role === "teacher" ? Teacher : Student;
//     const users = await Model.find(role ? filter : {})
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate(
//         role === "teacher"
//           ? ""
//           : {
//               path: "section",
//               populate: [
//                 { path: "batch" },
//                 { path: "teacher" },
//                 { path: "course" },
//               ],
//             }
//       );

//     const totalUsers = await Model.countDocuments(
//       role === "teacher" ? {} : filter
//     );
//     const totalPages = Math.ceil(totalUsers / limit);
//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "No users found." });
//     }

//     res.status(200).json({
//       success: true,
//       users,
//       page,
//       totalPages,
//       totalUsers,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };


export { createAssignment };
