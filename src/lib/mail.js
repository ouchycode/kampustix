import nodemailer from "nodemailer";

export async function sendTicketEmail({
  to,
  name,
  eventTitle,
  ticketCode,
  eventDate,
  qrDataUrl,
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"KampusTix Admin" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `Tiket Kamu: ${eventTitle} 🎟️`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0;">Tiket Event Kampus</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Halo <strong>${name}</strong>,</p>
            <p>Terima kasih sudah mendaftar! Berikut adalah detail tiket kamu:</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937;">${eventTitle}</h2>
              <p style="margin: 5px 0;">📅 Tanggal: ${eventDate}</p>
              <p style="margin: 5px 0;">🎫 Kode Tiket: <code style="background: #e5e7eb; padding: 2px 5px; border-radius: 4px;">${ticketCode}</code></p>
            </div>

            <p style="text-align: center;">Tunjukkan QR Code ini di pintu masuk:</p>
            <div style="text-align: center; margin: 20px 0;">
               <img src="cid:unique-qrcode" alt="QR Code" style="width: 200px; height: 200px; border: 1px solid #ddd; padding: 10px; border-radius: 8px;" />
            </div>
            
            <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px;">
              Email ini dikirim otomatis oleh sistem KampusTix.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "ticket-qr.png",
          path: qrDataUrl, // Kita kirim QR Code sebagai attachment agar bisa tampil di body
          cid: "unique-qrcode", // ID untuk dipanggil di tag <img src="cid:...">
        },
      ],
    });

    console.log("Email terkirim: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return false;
  }
}
