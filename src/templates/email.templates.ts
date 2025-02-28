export const otpTemplate = (otp: number, host: string) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        /* General styles */
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .email-header img {
            max-width: 150px;
            height: auto;
        }

        .email-body {
            text-align: center;
        }

        .otp-container {
            background-color: #e7f3ff;
            padding: 30px;
            border-radius: 8px;
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            color: #0073e6;
            margin-top: 20px;
        }

        .otp-description {
            font-size: 16px;
            color: #555555;
            margin-top: 20px;
            line-height: 1.5;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            margin-top: 30px;
        }

        .footer a {
            color: #0073e6;
            text-decoration: none;
        }

        .btn {
            background-color: #0073e6;
            color: #ffffff;
            padding: 12px 25px;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            margin-top: 25px;
            font-weight: bold;
        }

        .btn:hover {
            background-color: #005bb5;
        }

        .contact-info {
            font-size: 14px;
            color: #333;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://s3-alpha-sig.figma.com/img/d6d4/0ad0/0ecfd0ede2c5f5851dbfddc8148e1545?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=V1vq9FZn5QfdpoXnyCsQ1259MnMivgjygJsdU8cnyIwGcQgDOvtt8cH4ehro9sRJ1DTxQbao-cvjcKwY0SHxFfR9nyJzKXbuJ-ANo-6CdBD97d6IwSVo3LUv55irlBB85wejRleOowA1cuoHHMKk0AODhmEF620bwp~V6c0DRrKVV3r7qS1Wj9ACqiq~ZXI69c3L~Hd96imyoxrQtryOid12R-S00wfw1XhgKh5f7MDWzx-1OcG~L5LabxcYBYmxpOTpcGlY1hQX6eS-s25ZmquH1exRFFg8EkkKVmu~re4BvbnyUaVQHLxHf7PYG9yOOo2TeLGbKgtXC9fBSy5vjg__" alt="BVG Connect Logo">
        </div>
 
        <div class="email-body">
            <h2>OTP Verification</h2>
            <p class="otp-description">
                Dear Customer, <br>
                We have received a request to verify your email address. Please enter the One-Time Password (OTP) below to complete the process:
            </p>

            <div class="otp-container">
                <span>${otp}</span>
            </div>

            <p class="otp-description">
                Please note, the OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.
            </p>
        </div>

        <div class="footer">
            <p>&copy; 2025 BVG. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
}
