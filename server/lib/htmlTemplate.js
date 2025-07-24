const htmlTemplate = `<head>
    <meta charset="UTF-8" />
    <title>Verification Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        color: #4a90e2;
      }
      .code-box {
        background-color: #f0f0f0;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        border-radius: 5px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Email</h1>
        <p>Thanks for signing up for Sharie!</p>
      </div>
      <p>Use the code below to complete your sign-up process:</p>
      <div class="code-box">
        {{CODE}}
      </div>
      <p>This code will expire in 10 minutes. If you didn’t request this, you can ignore this email.</p>
      <div class="footer">
        &copy; 2025 Sharie Inc. All rights reserved.
      </div>
    </div>
  </body>`

export default htmlTemplate