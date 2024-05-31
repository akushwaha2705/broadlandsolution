const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const Contact = require("./models/contact");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 4000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://lkumanananalytics:bN030jwat94vG2JZ@cluster0.qfj2rmu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Nodemailer setup
var transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "13083ba4cb40ad463d289d99706c972e",
  },
});

// API endpoint
app.post("/api/contact", async (req, res) => {
  const { firstName, email, contact, message } = req.body;
  const newContact = new Contact({ firstName, email, contact, message });
  try {
    const result = await newContact.save();
    if (result) {
      return res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact", err });
  }
});

app.post("/api/contact/email", async (req, res) => {
  const { firstName, email, contact, message } = req.body;
  const newContact = new Contact({ firstName, email, contact, message });
  try {
    await newContact.save();
    const mailOptions = {
      from: "mailtrap@demomailtrap.com", // replace with your email
      to: email,
      subject: "Contact Form Submission",
      text: `Thank you for your message, ${firstName}. We will get back to you soon.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Failed to send email", error });
      }
      res.status(200).json({ message: "Contact saved and email sent" });
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact", err });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
