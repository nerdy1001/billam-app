import { baseTemplate } from "../emails/base";

export function verifyEmailTemplate({
  name,
  verifyUrl,
}: {
  name?: string;
  verifyUrl: string;
}) {
  return baseTemplate(`
    <tr>
      <td>
        <h2>Verify your email</h2>
        <p>Hi ${name ?? "there"},</p>
        <p>Thanks for signing up to Billam. Please confirm your email address by clicking the button below.</p>
        <p style="margin:30px 0">
          <a href="${verifyUrl}" 
             style="background:#1E3A8A; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px">
            Verify Email
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
      </td>
    </tr>
  `);
}