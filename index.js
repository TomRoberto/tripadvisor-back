const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(formidable());
app.use(cors());

const mailgun = require("mailgun-js")({
  apiKey: process.env.MAIL_GUN_API_KEY,
  domain: process.env.MAIL_GUN_DOMAIN,
});

app.post("/form", (req, res) => {
  const { name, lastname, email, subject, message } = req.fields;
  const data = {
    from: `${name} ${lastname} <${email}>`,
    to: process.env.MY_EMAIL,
    subject: `${subject}`,
    text: `${message}`,
  };
  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    console.log(error);
  });
  res.status(200).json({ message: "Données reçues, mail envoyé" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
