import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'resend-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.method === 'POST' && (req.url === '/api/contact' || req.url === '/api/feedback')) {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });

              req.on('end', async () => {
                try {
                  const data = JSON.parse(body || '{}');
                  const resendApiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
                  const toEmail = process.env.CONTACT_TO_EMAIL || env.CONTACT_TO_EMAIL || 'research@afterthefire.org';
                  const fromEmail = process.env.CONTACT_FROM_EMAIL || env.CONTACT_FROM_EMAIL || 'notifications@afterthefire.org';

                  // If Resend API key is not configured, return an honest configuration status
                  if (!resendApiKey || resendApiKey.trim() === '') {
                    res.statusCode = 503;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        success: false,
                        configured: false,
                        message:
                          'Resend email delivery is awaiting RESEND_API_KEY configuration in .env.local. Submission recorded locally in developer session.',
                        dataReceived: data,
                      })
                    );
                    return;
                  }

                  // If Resend API key is supplied, dispatch to Resend API
                  const isContact = req.url === '/api/contact';
                  const subjectLine = isContact
                    ? `[AFTER THE FIRE Inquiry] ${data.subject || 'Research Question'}`
                    : `[AFTER THE FIRE Feedback] ${data.category || 'Feedback'} (${data.rating || 5} Stars)`;

                  const htmlContent = isContact
                    ? `<div style="font-family: sans-serif; padding: 20px;">
                        <h2>New Research Inquiry</h2>
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Subject:</strong> ${data.subject}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${data.message}</div>
                       </div>`
                    : `<div style="font-family: sans-serif; padding: 20px;">
                        <h2>New Scientific Feedback</h2>
                        <p><strong>Name:</strong> ${data.name || 'Anonymous'}</p>
                        <p><strong>Category:</strong> ${data.category}</p>
                        <p><strong>Rating:</strong> ${data.rating} / 5 Stars</p>
                        <p><strong>Comment:</strong></p>
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">${data.comment}</div>
                       </div>`;

                  const resendRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${resendApiKey}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: fromEmail,
                      to: toEmail,
                      subject: subjectLine,
                      html: htmlContent,
                    }),
                  });

                  if (resendRes.ok) {
                    const resendData = await resendRes.json();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        success: true,
                        configured: true,
                        id: resendData.id,
                        message: 'Inquiry successfully transmitted via Resend.',
                      })
                    );
                  } else {
                    const errData = await resendRes.text();
                    res.statusCode = 502;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        success: false,
                        configured: true,
                        message: 'Resend API rejected transmission. Check credentials.',
                        error: errData,
                      })
                    );
                  }
                } catch (e: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: e.message }));
                }
              });
              return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': 'http://localhost:8000',
      },
    },
  };
});
