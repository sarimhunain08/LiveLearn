const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// Subject labels for readable emails
const subjectLabels = {
  general: "General Inquiry",
  pricing: "Pricing & Plans",
  technical: "Technical Support",
  billing: "Billing Issue",
  "become-tutor": "Become a Tutor",
  feedback: "Feedback",
  other: "Other",
};

/**
 * Send email notification to admin (optional — only if SMTP env vars are set)
 */
async function notifyAdmin(contact) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
    console.log("SMTP not configured — skipping email notification");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Ilmify Contact Form" <${SMTP_USER}>`,
      to: ADMIN_EMAIL,
      subject: `New Contact: ${subjectLabels[contact.subject] || contact.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px;">
          <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${contact.name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Subject</td><td style="padding:8px;">${subjectLabels[contact.subject] || contact.subject}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${contact.message}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Date</td><td style="padding:8px;">${new Date(contact.createdAt).toLocaleString()}</td></tr>
        </table>
      `,
    });

    console.log("Admin notification email sent");
  } catch (err) {
    console.error("Failed to send notification email:", err.message);
  }
}

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({ name, email, subject, message });

    // Fire-and-forget email notification
    notifyAdmin(contact);

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you within 24 hours.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private (Admin)
exports.getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private (Admin)
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      const err = new Error("Contact submission not found");
      err.statusCode = 404;
      return next(err);
    }

    // Mark as read if it's new
    if (contact.status === "new") {
      contact.status = "read";
      await contact.save();
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status / add admin notes
// @route   PUT /api/contact/:id
// @access  Private (Admin)
exports.updateContact = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      const err = new Error("Contact submission not found");
      err.statusCode = 404;
      return next(err);
    }

    if (status) contact.status = status;
    if (adminNotes !== undefined) contact.adminNotes = adminNotes;
    await contact.save();

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact submission
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      const err = new Error("Contact submission not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ success: true, message: "Contact submission deleted" });
  } catch (error) {
    next(error);
  }
};
