import nodemailer from "nodemailer";

export const mailer = async (reciever, tokenLink) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "elshodtukhtamurodov13@gmail.com",
      pass: "dreprgmixatgoxoc",
    },
  });

  await transporter.sendMail({
    from: "elshodtukhtamurodov13@gmail.com",
    to: reciever,
    subject: "Email Confirmation",
    text: "Your confirmation link: " + tokenLink,
  });
};
