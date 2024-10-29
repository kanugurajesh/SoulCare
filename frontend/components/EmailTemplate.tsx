import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  gmail: string;
  supportType: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  gmail,
  supportType,
  message,
}) => (
  <div>
    <h1>Hello {firstName}!</h1>
    <p>
      We have received your message and will get back to you as soon as
      possible.
    </p>
    <p>
      <strong>From:</strong> {gmail}
    </p>
    <p>
      <strong>Support type:</strong> {supportType}
    </p>
    <p>
      <strong>Message:</strong> {message}
    </p>
  </div>
);
