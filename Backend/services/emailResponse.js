
import imaps from "imap-simple"

const config = {
  imap: {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST,
    port: 993,
    tls: true,
  },
};

imaps.connect({ imap: config.imap })
  .then(() => console.log("IMAP Login SUCCESS"))
  .catch(err => console.error("IMAP Login FAILED:", err));