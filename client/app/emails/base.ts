export function baseTemplate(content: string) {
  return `
  <!DOCTYPE html>
    <html>
        <body style="font-family: Inter, sans-serif; background:#f6f6f6; padding:20px">
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                <td align="center">
                    <table width="600" style="background:#ffffff; padding:30px; border-radius:8px">
                    ${content}
                    <tr>
                        <td style="padding-top:30px; font-size:12px; color:#888">
                        If you did not request this, you can safely ignore this email.
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
        </body>
    </html>
  `;
}