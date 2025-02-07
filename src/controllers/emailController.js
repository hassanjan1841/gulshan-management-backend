import nodemailer from "nodemailer";
import schedule from "node-schedule";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});
const sendEmail = async (senderName, sender, receiver, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `${senderName} 👻" <${sender}>`, // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      html: message, // html body
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};
export const sendEmailController = async (req, res) => {
  try {
    const { senderName, sender, receiver, subject, message } = req.body;
    await sendEmail(senderName, sender, receiver, subject, message);
    res.status(200).json({ error: false, message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const scheduleEmail = async (req, res) => {
  try {
    const { students } = req.body; // List of student emails

    if (students && students.length > 0) {
      const targetDate = new Date();
      targetDate.setMinutes(targetDate.getMinutes() + 1); // Schedule for 1 minute later

      students.forEach((email) => {
        schedule.scheduleJob(targetDate, () =>
          sendEmail(
            "Your Name",
            process.env.MY_EMAIL,
            email,
            "Scheduled Email",
            "This is a scheduled email."
          )
        );
      });

      res.status(200).json({ message: "Emails scheduled successfully!" });
    } else {
      res.status(400).json({ message: "No student emails provided" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
