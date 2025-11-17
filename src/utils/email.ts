import nodemailer, { type TransportOptions } from "nodemailer";
import { logger } from "../middleware/logger.js";
import environment from "../config/env.js";

const { env, emailHost, emailPort, emailUser, emailPass } = environment;

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<boolean> => {
  if (!emailHost || !emailPort || !emailUser || !emailPass) {
    logger.warn("Email configuration not available, skipping email send");
    if (env === "production") {
      throw new Error("Something went wrong, please try again later!");
    }
    throw new Error("Email configuration not available");
  }

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  } as TransportOptions);

  try {
    const info = await transporter.sendMail({
      from: emailUser,
      to: email,
      subject,
      text,
    });
    logger.info(`Email sent: ${info.response}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    throw error;
  }
};

export default sendEmail;
