import { baseTemplate } from "../emails/base";

export function resetPasswordTemplate({
  name,
  resetPasswordUrl,
}: {
  name?: string;
  resetPasswordUrl: string;
}) {
  return baseTemplate(`
    <tr>
      <td>
        <h2>Reset your password</h2>
        <p>Hi ${name ?? "there"},</p>
        <p>Please click on the link below to reset your password</p>
        <p style="margin:30px 0">
          <a href="${resetPasswordUrl}" 
            style="background:#1E3A8A; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px">
            Reset password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
      </td>
    </tr>
  `);
}