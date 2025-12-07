import nodemailer from "nodemailer";
import RfpModel from "../model/rfp.model.js";
import getVendorEmails from "../services/emailFinder.js";
import generateVendorEmailHTML from "../services/emailTemplate.js";
import SentMail from "../model/email.model.js"

const sendmail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const details = await RfpModel.findById(req.body._id).populate(
      "vendors.vendor"
    );

    const vendorData = details.vendors;

    vendorData.map(async (v) => {
      console.log("------start-------");

      console.log(v.vendor);
      const emails = getVendorEmails(v.vendor);
      console.log(emails);

      const mailSend = await transporter.sendMail({
        from: process.env.EMAIL,
        to: emails.join(","), // send to ALL vendor emails
        subject: `RFP - ${details._id}`,
        html: generateVendorEmailHTML(details, v.vendor),
      });

      // Store for reply tracking
      await SentMail.create({
        messageId: mailSend.messageId, // <-- correct variable
        rfpId: details._id,
        vendorId: v.vendor._id,
        recipients: emails, // all vendor emails
      });
      //   const mailSender = async () => {
      //     await Promise.all(
      //       emails.map((email) =>
      //         transporter.sendMail({
      //           from: process.env.EMAIL,
      //           to: email,
      //           subject: `Request for Quotation ${details._id}`,
      //           html,
      //         })
      //       )
      //     );
      //   };
      //   mailSender();
      console.log("mail send");
    });

    return res.status(200).json({ ok: true, messageIds: "done" });
  } catch (error) {
    console.log("Error while sending the email:", error);
    return res
      .status(500)
      .json({ ok: false, error: error?.message || String(error) });
  }
};

export default sendmail;
