
const axios = require("axios");

const sendEmail = async (req, res) => {
    try {
        const { subject, message, sender_email_id, to_emails } = req.body;

        const response = await axios.post(
            `${process.env.EMAIL_API_URL}/api/replies/new`,
            {
                subject,
                message,
                sender_email_id,
                content_type: "html",
                to_emails,
                cc_emails: [],
                bcc_emails: []
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.EMAIL_API_TOKEN}`,
                    "Content-Type": "application/json",
                }
            }
        );

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};

module.exports = { sendEmail };
