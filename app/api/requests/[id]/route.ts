import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendStatusEmail } from '@/lib/email/resend';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { status } = body;

  // Update the request
  const { data, error } = await supabaseAdmin
    .from('laundry_requests')
    .update({ status })
    .eq('id', params.id)
    .select(`
      *,
      student:students(id, student_id, full_name, email, hostel_block, room_number)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send email if status is 'ready'
  if (status === 'ready' && data.student?.email) {
    try {
      await sendStatusEmail({
        to: data.student.email,
        studentName: data.student.full_name,
        ticketNumber: data.ticket_number,
        status: status,
        otp: data.delivery_otp,
      });
    } catch (emailError) {
      console.error('Email failed:', emailError);
    }
  }

  return NextResponse.json(data);
}
