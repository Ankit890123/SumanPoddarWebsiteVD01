# 🎬 tecnosra // Flask Contact Backend Setup Guide

This project includes a Python **Flask** backend with SQLite database, email notification service (SMTP / Resend), webhook alerts (Telegram & Discord), and API key authentication configured via `.env`.

---

## 🚀 Quick Start (Running the Flask Backend)

### 1. Requirements
Ensure you have Python 3.9+ installed on your system.

### 2. Install Dependencies
```bash
# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

### 3. Configure `.env` File
Open `.env` in the root folder and add your details:
```env
# Flask Server Configuration
FLASK_ENV=development
FLASK_PORT=5000
FLASK_DEBUG=True
SECRET_KEY=tsra_production_super_secret_key_2026

# Admin Key to view inquiries: GET /api/contact/inquiries
ADMIN_API_KEY=tsra_admin_secret_key_2026

# Receiver Email for Inquiries
CONTACT_RECEIVER_EMAIL=technosra26@gmail.com

# SMTP Settings (Optional - for sending automated email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=technosra26@gmail.com
SMTP_PASSWORD=your_gmail_app_password_here

# Resend API Key (Optional - https://resend.com)
RESEND_API_KEY=re_your_resend_api_key_here

# Telegram Alerts (Optional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Discord Webhook (Optional)
DISCORD_WEBHOOK_URL=
```

### 4. Run the Flask Server
```bash
python3 app.py
```
Server starts on: `http://localhost:5000`

---

## 📡 API Endpoints

### 1. Submit Contact Inquiry
* **URL:** `POST /api/contact`
* **Content-Type:** `application/json`
* **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@brand.com",
  "phone": "+91 98765 43210",
  "notes": "Looking for commercial video editing and DaVinci color grading."
}
```
* **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Thank you Jane Doe! Inquiry received successfully. Suman Poddar & the tecnosra team will reach out within 24 hours.",
  "inquiry_id": 1
}
```

### 2. Health Check
* **URL:** `GET /api/contact/health`
* **Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "email_service": "configured",
  "timestamp": "2026-10-11T14:18:20.000Z"
}
```

### 3. Admin View All Inquiries
* **URL:** `GET /api/contact/inquiries`
* **Headers:**
  * `X-API-Key: tsra_admin_secret_key_2026` *(or `Authorization: Bearer tsra_admin_secret_key_2026`)*
* **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "inquiries": [
    {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@brand.com",
      "phone": "+91 98765 43210",
      "notes": "Looking for commercial video editing...",
      "status": "pending",
      "created_at": "2026-10-11T14:18:20.000Z"
    }
  ]
}
```

---

## 🗄️ Data Storage
* **SQLite Database:** Saved automatically to `contacts.db`
* **JSON Backup:** Saved automatically to `contacts.json`
