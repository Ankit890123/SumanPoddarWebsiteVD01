#!/usr/bin/env python3
"""
tecnosra // Suman Poddar - Production House & Creative Studio
Flask Backend API for Contact Inquiries & Client Bookings
"""

import os
import re
import time
import json
import sqlite3
import smtplib
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests

# Load environment configuration from .env file
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Rate Limiting Store (Sliding window in-memory: IP -> list of timestamps)
RATE_LIMIT_STORE = {}
RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_REQUESTS = 5

def is_rate_limited(ip_address: str) -> bool:
    """Check if IP has exceeded the allowed submissions in time window."""
    now = time.time()
    timestamps = RATE_LIMIT_STORE.get(ip_address, [])
    # Filter only timestamps within the window
    timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(timestamps) >= RATE_LIMIT_MAX_REQUESTS:
        RATE_LIMIT_STORE[ip_address] = timestamps
        return True
    timestamps.append(now)
    RATE_LIMIT_STORE[ip_address] = timestamps
    return False

# Configuration
FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
SECRET_KEY = os.getenv("SECRET_KEY", "tsra_default_secret_key_2026")
ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "tsra_admin_secret_key_2026")
RECEIVER_EMAIL = os.getenv("CONTACT_RECEIVER_EMAIL", "technosra26@gmail.com")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

DB_PATH = os.path.join(os.path.dirname(__file__), "contacts.db")
JSON_BACKUP_PATH = os.path.join(os.path.dirname(__file__), "contacts.json")


def init_db():
    """Initialize SQLite database for storing inquiries."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                notes TEXT NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                status TEXT DEFAULT 'pending',
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Database Error] Could not initialize database: {e}")


def save_to_json(inquiry_data):
    """Save backup copy to contacts.json."""
    try:
        inquiries = []
        if os.path.exists(JSON_BACKUP_PATH):
            with open(JSON_BACKUP_PATH, "r", encoding="utf-8") as f:
                try:
                    inquiries = json.load(f)
                except Exception:
                    inquiries = []
        inquiries.append(inquiry_data)
        with open(JSON_BACKUP_PATH, "w", encoding="utf-8") as f:
            json.dump(inquiries, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[JSON Backup Error]: {e}")


def send_email_notification(data):
    """Send email notification via Resend API or SMTP."""
    subject = f"🎬 New Inquiry: {data['name']} via tecnosra Portfolio"
    body_text = f"""
New Client Inquiry Received for tecnosra (Suman Poddar)
---------------------------------------------------------
Name:         {data['name']}
Email:        {data['email']}
Phone:        {data['phone']}
Time:         {data['created_at']}
IP Address:   {data.get('ip_address', 'N/A')}

Project Brief / Notes:
{data['notes']}
---------------------------------------------------------
Direct Reply: mailto:{data['email']}
"""

    # 1. Try Resend API if API key provided
    if RESEND_API_KEY and RESEND_API_KEY.startswith("re_"):
        try:
            res = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": "tecnosra Inquiry <onboarding@resend.dev>",
                    "to": [RECEIVER_EMAIL],
                    "reply_to": data["email"],
                    "subject": subject,
                    "text": body_text,
                },
                timeout=10,
            )
            if res.status_code in (200, 201):
                print(f"[Resend] Notification sent successfully to {RECEIVER_EMAIL}")
                return True
        except Exception as e:
            print(f"[Resend API Error]: {e}")

    # 2. Try SMTP (Gmail or custom SMTP server)
    if SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg["From"] = SMTP_USER
            msg["To"] = RECEIVER_EMAIL
            msg["Subject"] = subject
            msg.add_header("Reply-To", data["email"])
            msg.attach(MIMEText(body_text, "plain"))

            server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            print(f"[SMTP] Notification sent successfully to {RECEIVER_EMAIL}")
            return True
        except Exception as e:
            print(f"[SMTP Error]: {e}")

    print("[Notification Info] Email credentials not configured in .env yet. Inquiry saved to database & contacts.json.")
    return False


def send_webhook_alerts(data):
    """Dispatch optional Discord or Telegram alerts."""
    # Discord Webhook
    if DISCORD_WEBHOOK_URL and DISCORD_WEBHOOK_URL.startswith("http"):
        try:
            requests.post(
                DISCORD_WEBHOOK_URL,
                json={
                    "content": f"**🎬 New Client Booking Inquiry**\n**Name:** {data['name']}\n**Email:** {data['email']}\n**Phone:** {data['phone']}\n**Notes:** {data['notes'][:300]}",
                },
                timeout=5,
            )
        except Exception as e:
            print(f"[Discord Webhook Error]: {e}")

    # Telegram Bot
    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:
        try:
            tg_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            tg_text = f"🎬 *New tecnosra Inquiry*\n*Name:* {data['name']}\n*Email:* {data['email']}\n*Phone:* {data['phone']}\n\n*Brief:*\n{data['notes']}"
            requests.post(
                tg_url,
                json={"chat_id": TELEGRAM_CHAT_ID, "text": tg_text, "parse_mode": "Markdown"},
                timeout=5,
            )
        except Exception as e:
            print(f"[Telegram Alert Error]: {e}")


# Initialize Database upon start
init_db()


# -----------------------------------------------------------------------------
# REST API ENDPOINTS
# -----------------------------------------------------------------------------

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "tecnosra Contact & Inquiries Backend API",
        "version": "1.0.0",
        "author": "Suman Poddar",
        "endpoints": {
            "submit_contact": "POST /api/contact",
            "health_check": "GET /api/contact/health",
            "admin_inquiries": "GET /api/contact/inquiries (Requires ADMIN_API_KEY header)"
        }
    })


@app.route("/api/contact/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "database": "connected" if os.path.exists(DB_PATH) else "initializing",
        "email_service": "configured" if (RESEND_API_KEY or (SMTP_USER and SMTP_PASSWORD)) else "local_storage_mode"
    })


@app.route("/api/contact", methods=["POST"])
def submit_contact():
    """Handle client inquiry form submissions."""
    try:
        ip_addr = request.headers.get("X-Forwarded-For", request.remote_addr) or "unknown"
        if "," in ip_addr:
            ip_addr = ip_addr.split(",")[0].strip()

        # Check rate limiting
        if is_rate_limited(ip_addr):
            return jsonify({
                "success": False,
                "error": "Rate limit exceeded. Please wait 60 seconds before submitting another inquiry."
            }), 429

        data = request.get_json(silent=True) or request.form.to_dict()

        if not data:
            return jsonify({"success": False, "error": "No inquiry data provided"}), 400

        name = str(data.get("name", "")).strip()[:100]
        email = str(data.get("email", "")).strip()[:120]
        phone = str(data.get("phone", "")).strip()[:30]
        # Accept 'notes', 'description', or 'message' for flexible client payloads
        notes = str(data.get("notes") or data.get("description") or data.get("message") or "").strip()[:3000]

        # Validation
        if not name:
            return jsonify({"success": False, "error": "Name is required"}), 400
        if not email or not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
            return jsonify({"success": False, "error": "A valid email address is required"}), 400
        if not phone:
            return jsonify({"success": False, "error": "Phone number is required"}), 400
        if not notes:
            return jsonify({"success": False, "error": "Project description/brief is required"}), 400

        now_str = datetime.datetime.utcnow().isoformat() + "Z"
        user_agent = request.headers.get("User-Agent", "Unknown")[:255]

        # Insert record into SQLite
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO contacts (name, email, phone, notes, ip_address, user_agent, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
        """, (name, email, phone, notes, ip_addr, user_agent, now_str))
        inquiry_id = cursor.lastrowid
        conn.commit()
        conn.close()

        record = {
            "id": inquiry_id,
            "name": name,
            "email": email,
            "phone": phone,
            "notes": notes,
            "ip_address": ip_addr,
            "user_agent": user_agent,
            "status": "pending",
            "created_at": now_str
        }

        # Backup to JSON
        save_to_json(record)

        # Dispatch background notifications
        try:
            send_email_notification(record)
            send_webhook_alerts(record)
        except Exception as notify_err:
            print(f"[Notification Worker Warning]: {notify_err}")

        return jsonify({
            "success": True,
            "message": f"Thank you {name}! Inquiry received successfully. Suman Poddar & the tecnosra team will reach out within 24 hours.",
            "inquiry_id": inquiry_id
        }), 201

    except Exception as e:
        print(f"[Submission Error]: {e}")
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500


@app.route("/api/contact/inquiries", methods=["GET"])
def get_inquiries():
    """Protected admin endpoint to inspect received inquiries."""
    auth_header = request.headers.get("Authorization", "")
    api_key_header = request.headers.get("X-API-Key", "")
    token = auth_header.replace("Bearer ", "").strip() if "Bearer " in auth_header else api_key_header

    if not token or token != ADMIN_API_KEY:
        return jsonify({"error": "Unauthorized. Please provide valid ADMIN_API_KEY in X-API-Key or Authorization header."}), 401

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM contacts ORDER BY id DESC")
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()

        return jsonify({
            "success": True,
            "count": len(rows),
            "inquiries": rows
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    print(f"🎬 tecnosra Flask Backend starting on port {FLASK_PORT}...")
    print(f"📡 Endpoints available: POST /api/contact | GET /api/contact/health | GET /api/contact/inquiries")
    app.run(host="0.0.0.0", port=FLASK_PORT, debug=FLASK_DEBUG)
