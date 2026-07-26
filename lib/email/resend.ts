import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  studentName: string;
  ticketNumber: number;
  status: string;
  otp?: string;
}

export async function sendStatusEmail({ to, studentName, ticketNumber, status, otp }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return;
  }

  const statusMessages: Record<string, string> = {
    ready: 'Your laundry is ready for pickup! 🎉',
    delivered: 'Your laundry has been delivered. Thank you!',
  };

  const subject = status === 'ready' 
    ? `Laundry #${ticketNumber} Ready for Pickup`
    : `Laundry #${ticketNumber} Status Update`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #7c3aed;">LaundryEase - Christ University</h2>
      <p>Hi ${studentName},</p>
      <p><strong>${statusMessages[status] || `Your laundry status has been updated to: ${status}`}</strong></p>
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Ticket #:</strong> ${ticketNumber}</p>
        <p style="margin: 5px 0 0 0;"><strong>Status:</strong> ${status.toUpperCase()}</p>
        ${otp ? `<p style="margin: 5px 0 0 0; color: #dc2626;"><strong>Pickup OTP:</strong> ${otp}</p>` : ''}
      </div>
      <p style="color: #6b7280; font-size: 14px;">Show this OTP at the laundry counter to collect your items.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #9ca3af; font-size: 12px;">Christ University Hostel Management</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: 'LaundryEase <laundry@christuniversity.in>',
    to,
    subject,
    html,
  });

  if (error) {
    throw error;
  }

  return data;
}
