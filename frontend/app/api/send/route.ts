import { EmailTemplate } from "../../../components/EmailTemplate";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { name, gmail, supportType, message } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [process.env.EMAIL as string],
      subject: "Mental Health Support Request",
      react: EmailTemplate({
        firstName: name,
        gmail: gmail,
        supportType: supportType,
        message: message,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
