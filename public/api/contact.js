const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to load .env variables if not already injected by the environment
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split(/\r?\n/).forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const eqIndex = trimmed.indexOf('=');
                    if (eqIndex > 0) {
                        const key = trimmed.slice(0, eqIndex).trim();
                        let value = trimmed.slice(eqIndex + 1).trim();
                        if ((value.startsWith('"') && value.endsWith('"')) || 
                            (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.slice(1, -1);
                        }
                        if (!process.env[key]) {
                            process.env[key] = value;
                        }
                    }
                }
            });
        }
    } catch (e) {
        // Silently continue if env file cannot be read
    }
}

loadEnv();

// SMS Gateway Configuration
const SMS_GATEWAY_BASE_URL = process.env.SMS_GATEWAY_BASE_URL || 'https://api.smsgateway.com.bd/api';
const SMS_GATEWAY_CLIENT_ID = process.env.SMS_GATEWAY_CLIENT_ID || 'client_uXfE0';
const SMS_GATEWAY_KEY = process.env.SMS_GATEWAY_KEY || process.env.SMS_GATEWAY_API_KEY || 'chrK2ui9S4flrQ3n2sOi';

/**
 * Format and strictly sanitize recipient phone number for SMS Gateway.
 * Converts strings like "+88016..." or "88016..." into standard local format "016...".
 */
function sanitizePhoneNumber(phone) {
    if (!phone) return '';
    // Strip all non-digit characters
    let digits = phone.toString().replace(/[^0-9]/g, '');

    // Convert +88016... or 88016... to 016...
    if (digits.startsWith('880')) {
        digits = digits.slice(2);
    } else if (digits.length === 10 && digits.startsWith('1')) {
        digits = '0' + digits;
    }
    return digits;
}

/**
 * Validate phone number
 */
function isValidPhoneNumber(phone) {
    const cleaned = sanitizePhoneNumber(phone);
    // Standard Bangladeshi mobile number format (11 digits starting with 013-019) or standard 8-16 digits
    return /^01[3-9][0-9]{8}$/.test(cleaned) || /^[0-9]{8,15}$/.test(cleaned);
}

/**
 * Sends SMS via SMSGateway.BD API
 */
async function sendSmsGatewayMessage(recipient, message) {
    const url = `${SMS_GATEWAY_BASE_URL.replace(/\/$/, '')}/send-message`;
    const payload = JSON.stringify({
        client_id: SMS_GATEWAY_CLIENT_ID,
        key: SMS_GATEWAY_KEY,
        recipient: recipient,
        message: message
    });

    // Check if global fetch is available (Node 18+)
    if (typeof fetch === 'function') {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload).toString()
            },
            body: payload
        });

        const data = await res.json().catch(() => null);
        console.log("=== SMS GATEWAY RESPONSE ===", data);

        if (!res.ok || (data && data.response_code && data.response_code !== 200)) {
            const errMsg = (data && (data.message || data.error)) || `Gateway error with code ${data ? data.response_code : res.status}`;
            throw new Error(errMsg);
        }
        return data;
    }

    // Fallback to native https module for Node environments without global fetch
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const data = body ? JSON.parse(body) : {};
                    console.log("=== SMS GATEWAY RESPONSE ===", data);
                    if (res.statusCode >= 200 && res.statusCode < 300 && (!data.response_code || data.response_code === 200)) {
                        resolve(data);
                    } else {
                        reject(new Error(data.message || data.error || `Gateway returned status ${res.statusCode}`));
                    }
                } catch (err) {
                    console.log("=== SMS GATEWAY RESPONSE ===", body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({ raw: body });
                    } else {
                        reject(new Error(`Gateway error: ${body || res.statusCode}`));
                    }
                }
            });
        });

        req.on('error', (err) => reject(err));
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('SMS Gateway connection timed out'));
        });

        req.write(payload);
        req.end();
    });
}

/**
 * Main API Handler (Vercel Serverless / Node HTTP)
 */
module.exports = async function handler(req, res) {
    // Enable CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Method Not Allowed. Use POST.' }));
        return;
    }

    try {
        let body = req.body;

        // Parse body if it arrived as string or stream
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                const urlParams = new URLSearchParams(body);
                body = Object.fromEntries(urlParams.entries());
            }
        } else if (!body) {
            body = await new Promise((resolve, reject) => {
                let data = '';
                req.on('data', chunk => data += chunk);
                req.on('end', () => {
                    try {
                        resolve(data ? JSON.parse(data) : {});
                    } catch {
                        const urlParams = new URLSearchParams(data);
                        resolve(Object.fromEntries(urlParams.entries()));
                    }
                });
                req.on('error', reject);
            });
        }

        const { name, phone, email, subject, message } = body || {};

        // Validation
        if (!name || typeof name !== 'string' || !name.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Full Name is required.' }));
            return;
        }

        if (!phone || !isValidPhoneNumber(phone)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
                success: false, 
                error: 'Valid Phone Number is required (e.g. +8801XXXXXXXXX or 01XXXXXXXXX).' 
            }));
            return;
        }

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Valid Email Address is required.' }));
            return;
        }

        if (!subject || typeof subject !== 'string' || !subject.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Subject is required.' }));
            return;
        }

        if (!message || typeof message !== 'string' || !message.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Message content is required.' }));
            return;
        }

        const sanitizedRecipient = sanitizePhoneNumber(phone);
        const contactName = name.trim();

        // Construct exact required SMS message
        const smsMessage = `Dear ${contactName}, thank you for your inquiry. I appreciate you taking the time to connect. My office is reviewing your note. Feel free to join a quick sync: https://meet.google.com/cdc-kqjv-zur or reach out at +88016223697899 (Direct) / +8809697732099 (Office: 10 AM-6 PM).`;

        // Send SMS through SMS Gateway
        let gatewayResult = null;
        let smsError = null;

        try {
            gatewayResult = await sendSmsGatewayMessage(sanitizedRecipient, smsMessage);
        } catch (err) {
            console.error('SMS Gateway dispatch error:', err.message);
            smsError = err.message;
        }

        // Return response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            success: true,
            message: 'Your message has been received successfully. A confirmation SMS has been dispatched to your phone number.',
            smsStatus: smsError ? 'gateway_warning' : 'dispatched',
            gatewayResponse: gatewayResult,
            warning: smsError ? `SMS could not be delivered: ${smsError}` : undefined
        }));

    } catch (err) {
        console.error('API Error in /api/contact:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
            success: false, 
            error: 'An internal server error occurred while processing your request. Please try again later.' 
        }));
    }
};
