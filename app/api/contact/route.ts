import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mc_id, couple_name, couple_email, couple_phone, wedding_date, venue, message } = body;

    // Validate required fields
    if (!couple_name || !couple_email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Insert inquiry into database
    const supabase = await createClient();
    const { data: inquiry, error: insertError } = await supabase
      .from('contact_inquiries')
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
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      );
    }

    // Get MC details if mc_id is provided
    let mcDetails = null;
    if (mc_id) {
      const { data: mc } = await supabase
        .from('mc_profiles')
        .select('name, email')
        .eq('id', mc_id)
        .single();
      
      mcDetails = mc;
    }

    // Send email notifications
    try {
      await sendEmailNotifications({
        inquiry,
        mcDetails,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendEmailNotifications({ inquiry, mcDetails }: any) {
  // Create transporter (using environment variables)
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Email to admin
  const adminEmailHtml = `
    <h2>New Wedding Inquiry</h2>
    <p><strong>From:</strong> ${inquiry.couple_name}</p>
    <p><strong>Email:</strong> ${inquiry.couple_email}</p>
    ${inquiry.couple_phone ? `<p><strong>Phone:</strong> ${inquiry.couple_phone}</p>` : ''}
    ${inquiry.wedding_date ? `<p><strong>Wedding Date:</strong> ${inquiry.wedding_date}</p>` : ''}
    ${inquiry.venue ? `<p><strong>Venue:</strong> ${inquiry.venue}</p>` : ''}
    ${mcDetails ? `<p><strong>MC Interested In:</strong> ${mcDetails.name}</p>` : ''}
    ${inquiry.message ? `<p><strong>Message:</strong><br>${inquiry.message}</p>` : ''}
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Wedding Inquiry from ${inquiry.couple_name}`,
    html: adminEmailHtml,
  });

  // Email to MC if applicable
  if (mcDetails && mcDetails.email) {
    const mcEmailHtml = `
      <h2>New Wedding Inquiry</h2>
      <p>You have received a new inquiry through WedList!</p>
      <p><strong>From:</strong> ${inquiry.couple_name}</p>
      <p><strong>Email:</strong> ${inquiry.couple_email}</p>
      ${inquiry.couple_phone ? `<p><strong>Phone:</strong> ${inquiry.couple_phone}</p>` : ''}
      ${inquiry.wedding_date ? `<p><strong>Wedding Date:</strong> ${inquiry.wedding_date}</p>` : ''}
      ${inquiry.venue ? `<p><strong>Venue:</strong> ${inquiry.venue}</p>` : ''}
      ${inquiry.message ? `<p><strong>Message:</strong><br>${inquiry.message}</p>` : ''}
      <p>Please respond to them directly at ${inquiry.couple_email}</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: mcDetails.email,
      subject: `New Wedding Inquiry - ${inquiry.couple_name}`,
      html: mcEmailHtml,
    });
  }

  // Auto-reply to couple
  const coupleEmailHtml = `
    <h2>Thank you for your inquiry!</h2>
    <p>Hi ${inquiry.couple_name},</p>
    <p>We've received your inquiry and ${mcDetails ? `${mcDetails.name} has` : 'we have'} been notified.</p>
    <p>You can expect a response within 24-48 hours.</p>
    <p>Your inquiry details:</p>
    ${inquiry.wedding_date ? `<p><strong>Wedding Date:</strong> ${inquiry.wedding_date}</p>` : ''}
    ${inquiry.venue ? `<p><strong>Venue:</strong> ${inquiry.venue}</p>` : ''}
    ${mcDetails ? `<p><strong>MC:</strong> ${mcDetails.name}</p>` : ''}
    <br>
    <p>Best regards,<br>WedList Team</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: inquiry.couple_email,
    subject: 'Thank you for your inquiry - WedList',
    html: coupleEmailHtml,
  });
}
