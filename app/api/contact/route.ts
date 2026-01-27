import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    const body = await request.json();
    const {
      mc_id,
      couple_name,
      couple_email,
      couple_phone,
      wedding_date,
      venue,
      message,
    } = body;

    // Validate required fields
    if (!couple_name || !couple_email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Insert inquiry into database
    const { data: inquiry, error: insertError } = await supabase
      .from("contact_inquiries")
      .insert({
        mc_id: mc_id || null,
        couple_name,
        couple_email,
        couple_phone: couple_phone || null,
        wedding_date: wedding_date || null,
        venue: venue || null,
        message: message || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database error:", insertError);
      return NextResponse.json(
        { error: "Failed to save inquiry" },
        { status: 500 },
      );
    }

    // Get MC details if mc_id is provided
    let mcDetails = null;
    if (mc_id) {
      const { data: mc } = await supabase
        .from("mc_profiles")
        .select("name, email")
        .eq("id", mc_id)
        .single();

      mcDetails = mc;
    }

    // Send email notifications
    try {
      await sendEmailNotifications({
        inquiry,
        mcDetails,
        couple_name,
      });
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function sendEmailNotifications({
  inquiry,
  mcDetails,
  couple_name,
}: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@wedlist.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@wedlist.com";

  // Format date if present
  const formattedDate = inquiry.wedding_date
    ? new Date(inquiry.wedding_date).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  try {
    // 1. Email to admin
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `New Wedding Inquiry from ${inquiry.couple_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">New Wedding Inquiry</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${inquiry.couple_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${inquiry.couple_email}">${inquiry.couple_email}</a></p>
            ${inquiry.couple_phone ? `<p><strong>Phone:</strong> ${inquiry.couple_phone}</p>` : ""}
            ${formattedDate ? `<p><strong>Wedding Date:</strong> ${formattedDate}</p>` : ""}
            ${inquiry.venue ? `<p><strong>Venue:</strong> ${inquiry.venue}</p>` : ""}
            ${mcDetails ? `<p><strong>MC Interested In:</strong> ${mcDetails.name}</p>` : ""}
          </div>

          ${
            inquiry.message
              ? `
          <div style="margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="background: #f9fafb; padding: 15px; border-left: 4px solid #374151;">${inquiry.message}</p>
          </div>
          `
              : ""
          }

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This inquiry was submitted through WedList
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send admin email:", error);
  }

  // 2. Email to MC if applicable
  if (mcDetails && mcDetails.email) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: mcDetails.email,
        subject: `New Wedding Inquiry - ${inquiry.couple_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">New Wedding Inquiry</h2>
            <p>You have received a new inquiry through WedList!</p>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${inquiry.couple_name}</p>
              <p><strong>Email:</strong> <a href="mailto:${inquiry.couple_email}">${inquiry.couple_email}</a></p>
              ${inquiry.couple_phone ? `<p><strong>Phone:</strong> ${inquiry.couple_phone}</p>` : ""}
              ${formattedDate ? `<p><strong>Wedding Date:</strong> ${formattedDate}</p>` : ""}
              ${inquiry.venue ? `<p><strong>Venue:</strong> ${inquiry.venue}</p>` : ""}
            </div>

            ${
              inquiry.message
                ? `
            <div style="margin: 20px 0;">
              <p><strong>Their Message:</strong></p>
              <p style="background: #f9fafb; padding: 15px; border-left: 4px solid #374151;">${inquiry.message}</p>
            </div>
            `
                : ""
            }

            <p style="margin: 30px 0; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Please respond to them directly at <a href="mailto:${inquiry.couple_email}">${inquiry.couple_email}</a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              Sent from WedList
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send MC email:", error);
    }
  }

  // 3. Auto-reply to couple
  try {
    await resend.emails.send({
      from: fromEmail,
      to: inquiry.couple_email,
      subject: "Thank you for your inquiry - WedList",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Thank you for your inquiry!</h2>
          
          <p>Hi ${inquiry.couple_name},</p>
          
          <p>We've received your inquiry and ${
            mcDetails ? `<strong>${mcDetails.name}</strong> has` : "we have"
          } been notified.</p>
          
          <p>You can expect a response within <strong>24-48 hours</strong>.</p>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0;"><strong>Your Inquiry Details:</strong></p>
            ${formattedDate ? `<p style="margin: 8px 0;"><strong>Wedding Date:</strong> ${formattedDate}</p>` : ""}
            ${inquiry.venue ? `<p style="margin: 8px 0;"><strong>Venue:</strong> ${inquiry.venue}</p>` : ""}
            ${mcDetails ? `<p style="margin: 8px 0;"><strong>MC:</strong> ${mcDetails.name}</p>` : ""}
          </div>

          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>WedList Team</strong>
          </p>

          <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            This is an automated email. Please do not reply to this message. Contact the MC directly using the information they provide.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send couple auto-reply:", error);
  }
}
