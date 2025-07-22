import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    // Destructure all fields, including the new 'timestamp'
    const { name, email, phone, projectType, budget, message, timestamp } = formData

    // --- 1. Submit to Google Sheets ---
    let sheetsSuccess = false
    if (process.env.NEXT_PUBLIC_SHEETS_FORM) {
      try {
        // Send the formData object directly, mirroring your working Save Farm example
        const sheetsResponse = await fetch(process.env.NEXT_PUBLIC_SHEETS_FORM, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send the original formData object
        })
        const sheetsResult = await sheetsResponse.json()
        sheetsSuccess = sheetsResult.result === "success"
        console.log("Google Sheets submission result:", sheetsResult)
      } catch (sheetsError) {
        console.error("Google Sheets submission error:", sheetsError)
      }
    } else {
      console.warn("NEXT_PUBLIC_SHEETS_FORM environment variable is not set. Skipping Google Sheets submission.")
      sheetsSuccess = true // Consider it successful if no sheet URL is provided
    }

    // --- 2. Send email notification using Nodemailer ---
    let emailSuccess = false
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      // Email content with InSync branding colors, using destructured variables
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
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${name}</td>
            </tr>
            ${
              // Check if phone is a non-empty string
              typeof phone === "string" && phone.trim().length > 0
                ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${phone}</td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Project Type:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${projectType}</td>
            </tr>
            ${
              budget
                ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold; color: #000000;">Budget:</td>
              <td style="padding: 10px; border-bottom: 1px solid #E5E7EB; color: #333333;">${budget}</td>
            </tr>
            `
                : ""
            }
          </table>
          ${
            message
              ? `
          <h2 style="color: #000000; margin-top: 30px; margin-bottom: 15px;">Message</h2>
          <div style="background-color: #F9F4EB; padding: 15px; border-radius: 5px; border-left: 4px solid #000000;">
            <p style="margin: 0; line-height: 1.6; color: #333333;">${message}</p>
          </div>
          `
              : ""
          }
          <div style="margin-top: 30px; padding: 20px; background-color: #F9F4EB; border-radius: 5px; border: 1px solid #E5E7EB;">
            <h3 style="color: #000000; margin-top: 0;">Quick Actions</h3>
            ${
              // Conditional rendering for Call link
              typeof phone === "string" && phone.trim().length > 0
                ? `
            <p style="margin: 10px 0; color: #333333;">
              <strong>Call:</strong>
              <a href="tel:${phone}" style="color: #000000; text-decoration: none;">${phone}</a>
            </p>
            `
                : ""
            }
            ${
              // More robust check for phone number presence for WhatsApp
              typeof phone === "string" && phone.trim().length > 0
                ? `
            <p style="margin: 10px 0; color: #333333;">
              <strong>WhatsApp:</strong>
              <a href="https://wa.me/91${String(phone).replace(/\D/g, "")}" style="color: #000000; text-decoration: none;" target="_blank">Send WhatsApp Message</a>
            </p>
            `
                : ""
            }
            <p style="margin: 10px 0; color: #333333;">
              <strong>Email:</strong>
              <a href="mailto:${email}" style="color: #000000; text-decoration: none;">${email}</a>
            </p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This inquiry was submitted through the InSync Solutions website contact form.</p>
          <p>Submitted on: ${timestamp}</p>
        </div>
      </div>
    `
      const mailOptions = {
        from: `"InSync Solutions" <${process.env.GMAIL_USER}>`,
        to: "insyncsolutions06@gmail.com",
        subject: `New Inquiry from ${name} - InSync Solutions`,
        html: htmlContent,
        ...(email && { replyTo: email }),
      }

      await transporter.sendMail(mailOptions)
      emailSuccess = true
      console.log("Email sent successfully via Nodemailer")
    } catch (emailError) {
      console.error("Email sending error:", emailError)
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
    console.error("Contact form submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 },
    )
  }
}
