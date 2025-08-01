import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

// Input validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  budget: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.string(),
})

// Create transporter once (reused across requests)
let transporter: nodemailer.Transporter | null = null

const getTransporter = () => {
  if (!transporter && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }
  return transporter
}

// HTML escape function
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// Timeout wrapper for external API calls
const withTimeout = (promise: Promise<any>, timeoutMs = 10000): Promise<any> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), timeoutMs),
  )
  return Promise.race([promise, timeoutPromise])
}

// Submit to Google Sheets
const submitToSheets = async (formData: any): Promise<boolean> => {
  if (!process.env.NEXT_PUBLIC_SHEETS_FORM) {
    return true // Consider successful if no sheet URL provided
  }

  const response = await withTimeout(
    fetch(process.env.NEXT_PUBLIC_SHEETS_FORM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }),
  )

  const result = await response.json()
  return result.result === "success"
}

// Send email notification
const sendEmail = async (formData: any): Promise<boolean> => {
  const emailTransporter = getTransporter()
  if (!emailTransporter) {
    console.warn("Email transporter not configured")
    return false
  }

  // Escape user input
  const safeData = {
    name: escapeHtml(formData.name),
    email: escapeHtml(formData.email),
    phone: formData.phone ? escapeHtml(formData.phone) : null,
    projectType: escapeHtml(formData.projectType),
    budget: formData.budget ? escapeHtml(formData.budget) : null,
    message: formData.message ? escapeHtml(formData.message) : null,
    timestamp: escapeHtml(formData.timestamp),
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F9F4EB; border-radius: 8px;">
      <div style="background-color: #000000; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #FFFFFF; margin: 0; font-size: 24px;">New Inquiry - InSync Solutions</h1>
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="color: #000000; margin-top: 0; margin-bottom: 20px;">Contact Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000; width: 30%;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${safeData.name}</td>
          </tr>
          ${
            safeData.phone
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${safeData.phone}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${safeData.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Project Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${safeData.projectType}</td>
          </tr>
          ${
            safeData.budget
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Budget:</td>
            <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${safeData.budget}</td>
          </tr>
          `
              : ""
          }
        </table>
        ${
          safeData.message
            ? `
        <h2 style="color: #000000; margin-top: 30px; margin-bottom: 15px;">Message</h2>
        <div style="background-color: #F9F4EB; padding: 15px; border-radius: 5px; border-left: 4px solid #000000;">
          <p style="margin: 0; line-height: 1.6; color: #333333;">${safeData.message}</p>
        </div>
        `
            : ""
        }
        <div style="margin-top: 30px; padding: 20px; background-color: #F9F4EB; border-radius: 5px; border: 1px solid #E5E7EB;">
          <h3 style="color: #000000; margin-top: 0;">Quick Actions</h3>
          ${
            safeData.phone
              ? `
          <p style="margin: 10px 0; color: #333333;">
            <strong>Call:</strong>
            <a href="tel:${safeData.phone}" style="color: #000000; text-decoration: none;">${safeData.phone}</a>
          </p>
          <p style="margin: 10px 0; color: #333333;">
            <strong>WhatsApp:</strong>
            <a href="https://wa.me/91${safeData.phone.replace(/\D/g, "")}" style="color: #000000; text-decoration: none;" target="_blank">Send WhatsApp Message</a>
          </p>
          `
              : ""
          }
          <p style="margin: 10px 0; color: #333333;">
            <strong>Email:</strong>
            <a href="mailto:${safeData.email}" style="color: #000000; text-decoration: none;">${safeData.email}</a>
          </p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>This inquiry was submitted through the InSync Solutions website contact form.</p>
        <p>Submitted on: ${safeData.timestamp}</p>
      </div>
    </div>
  `

  const mailOptions = {
    from: `"InSync Solutions" <${process.env.GMAIL_USER}>`,
    to: "insyncsolutions06@gmail.com",
    subject: `New Inquiry from ${safeData.name} - InSync Solutions`,
    html: htmlContent,
    replyTo: formData.email,
  }

  await withTimeout(emailTransporter.sendMail(mailOptions))
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json()
    const validatedData = contactSchema.parse(body)

    // Process both operations in parallel
    const [sheetsResult, emailResult] = await Promise.allSettled([
      submitToSheets(validatedData),
      sendEmail(validatedData),
    ])

    const sheetsSuccess = sheetsResult.status === "fulfilled" && sheetsResult.value
    const emailSuccess = emailResult.status === "fulfilled" && emailResult.value

    // Log errors without exposing sensitive data
    if (sheetsResult.status === "rejected") {
      console.error("Sheets submission failed:", sheetsResult.reason?.message)
    }
    if (emailResult.status === "rejected") {
      console.error("Email sending failed:", emailResult.reason?.message)
    }

    if (sheetsSuccess || emailSuccess) {
      return NextResponse.json({
        success: true,
        message: "Form submitted successfully",
        details: {
          sheetsSubmitted: sheetsSuccess,
          emailSent: emailSuccess,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to submit form. Please try again or contact us directly.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form data",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Contact form submission error:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 },
    )
  }
}
