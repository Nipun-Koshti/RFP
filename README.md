
# RFP & Quotation Management System

A full-stack web application for managing Request for Proposals (RFPs), vendor management, and automated quotation processing with AI-powered email parsing.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Setup & Installation](#setup--installation)
4. [Environment Configuration](#environment-configuration)
5. [Application Flow](#application-flow)
6. [API Endpoints](#api-endpoints)
7. [Database Models](#database-models)
8. [Features](#features)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This system streamlines the RFP process by:
- Creating and managing RFPs (Request for Proposals)
- Managing vendor information and communications
- Sending RFQs (Request for Quotations) to vendors via email
- **Automatically processing vendor email replies** using AI (Groq LLM)
- Extracting quotation data and creating quotation records
- Providing a dashboard to view and manage all proposals and quotations

### Key Innovation
**Automatic Email Reply Processing**: When vendors reply to RFQ emails, the system automatically:
1. Matches the email to the correct RFP using AI pattern recognition
2. Identifies the vendor from the email address
3. Extracts line items and pricing using Groq LLM
4. Creates quotation records with embedded rfpId and vendorId

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB
- **AI/LLM**: Groq SDK (llama3-8b-8192 model)
- **Email**: Nodemailer (Gmail SMTP)
- **Validation**: Zod
- **CORS**: Enabled for frontend communication

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide-react
- **Routing**: React Router

### DevTools
- **Backend Dev**: Nodemon
- **Linting**: ESLint
- **Package Manager**: npm

---

## 📁 Directory Structure

```
assignment/
│
├── Backend/
│   ├── Controller/
│   │   ├── ai.controller.js             # AI/Groq features (create RFP from text)
│   │   ├── email.controller.js          # Send RFQ emails to vendors
│   │   ├── rfp.controller.js            # RFP CRUD operations
│   │   ├── vendor.controller.js         # Vendor management (CRUD)
│   │   └── quote.controller.js          # Quotation management (CRUD)
│   │
│   ├── services/
│   │   ├── LLM/
│   │   │   ├── createRfp.js             # Groq: Convert free text to RFP JSON
│   │   │   └── emailData.js             # Email data processing helpers
│   │   │
│   │   ├── validations/
│   │   │   ├── rfp.validation.js        # Zod schema for RFP
│   │   │   ├── quote.validation.js      # Zod schema for quotations
│   │   │   └── vendor.validation.js     # Zod schema for vendor
│   │   │
│   │   ├── cron/                        # Scheduled jobs
│   │   ├── emailExtractor.js            # Extract email data & parse replies
│   │   ├── emailFinder.js               # Extract vendor emails
│   │   ├── emailTemplate.js             # Generate RFQ email HTML
│   │   ├── emailResponse.js             # Email response handling
│   │   ├── asyncHandler.service.js      # Async error wrapper
│   │   ├── api.error.js                 # Custom error class
│   │   └── response.js                  # Standard response format
│   │
│   ├── model/
│   │   ├── rfp.model.js                 # RFP schema
│   │   ├── vendor.model.js              # Vendor schema
│   │   ├── quotation.model.js           # Quotation schema
│   │   └── email.model.js               # Email tracking model
│   │
│   ├── routes/
│   │   ├── rfp.routes.js                # /api/v1/rfp endpoints
│   │   ├── vendor.routes.js             # /api/v1/vendor endpoints
│   │   ├── quote.route.js               # /api/v1/quote endpoints
│   │   ├── email.route.js               # /api/v1/email endpoints
│   │   └── ai.routes.js                 # /api/v1/ai endpoints
│   │
│   ├── db/
│   │   └── connectDb.js                 # MongoDB connection
│   │
│   ├── middleware/                      # Express middleware
│   ├── index.js                         # Express app setup & routes
│   ├── server.js                        # Bootstrap with dotenv
│   ├── .env                             # Environment variables (local)
│   ├── example.env                      # Environment variables template
│   ├── package.json                     # Backend dependencies
│   ├── .gitignore                       # Git ignore rules
│   └── public/                          # Static files
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx               # Navigation component
│   │   │
│   │   ├── Pages/
│   │   │   ├── Home.jsx                 # Landing page
│   │   │   ├── Rfp.jsx                  # View all RFPs table
│   │   │   ├── RfpView.jsx              # View single RFP details
│   │   │   ├── RfpCreate.jsx            # Create/edit RFP form
│   │   │   ├── Vendor.jsx               # View all vendors
│   │   │   ├── VendorView.jsx           # View vendor details
│   │   │   ├── VendorCreate.jsx         # Create/edit vendor form
│   │   │   ├── Quote.jsx                # View all quotations
│   │   │   ├── NotFound.jsx             # 404 error page
│   │   │   └── index.js                 # Page exports
│   │   │
│   │   ├── Outlets/
│   │   │   └── MainLayout.jsx           # Main layout wrapper
│   │   │
│   │   ├── Routes/
│   │   │   └── routes.jsx               # React Router configuration
│   │   │
│   │   ├── services/
│   │   │   ├── Api/
│   │   │   │   ├── axios.api.js         # Axios instance with base config
│   │   │   │   ├── rfp.api.js           # RFP API calls
│   │   │   │   ├── vendor.api.js        # Vendor API calls
│   │   │   │   ├── quote.api.js         # Quotation API calls
│   │   │   │   ├── email.api.js         # Email API calls
│   │   │   │   └── ai.api.js            # AI API calls
│   │   │   │
│   │   │   └── Validations/
│   │   │       ├── rfp.validation.js    # Zod RFP schema (client-side)
│   │   │       └── quote.validation.js  # Zod quotation schema (client-side)
│   │   │
│   │   ├── assets/                      # Images, fonts, static assets
│   │   ├── store/                       # State management (if using)
│   │   ├── App.jsx                      # Root component
│   │   ├── main.jsx                     # React entry point
│   │   ├── App.css                      # App styles
│   │   └── index.css                    # Global styles
│   │
│   ├── public/                          # Static public assets
│   ├── vite.config.js                   # Vite build configuration
│   ├── eslint.config.js                 # ESLint rules
│   ├── package.json                     # Frontend dependencies
│   ├── index.html                       # HTML template
│   ├── .gitignore                       # Git ignore rules
│   └── README.md                        # Frontend-specific docs
│
└── README.md                            # This file (root documentation)
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v16+ and npm
- **MongoDB** v5+ (local or Atlas)
- **Gmail Account** with 2FA enabled (for email sending)
- **Groq API Key** (free tier available at console.groq.com)
- **Git** (for version control)

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd assignment

# Backend setup
cd Backend
npm install

# Frontend setup (from project root)
cd ../Frontend
npm install
```

### Step 2: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB server (Windows)
mongod

```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string

### Step 3: Gmail Configuration (For Email Sending)

1. **Enable 2FA on Gmail account**
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. **Store credentials securely** (see Environment Configuration)

### Step 4: Get Groq API Key

1. Go to https://console.groq.com
2. Sign up (free tier includes API quota)
3. Create API key in console
4. Copy the key

---

## 🔧 Environment Configuration

### Backend `.env` File

Create `Backend/.env`:

```env
# Server
PORT=8000

# Database
MONGO_URI=mongodb://127.0.0.1:27017/assignment
# OR for Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/assignment

# CORS
CORS_ORIGIN=http://localhost:5173

# Email Configuration
EMAIL=your-gmail@gmail.com
PASS=your-16-char-app-password

# AI/LLM
GROQ_API_KEY=gsk_your_api_key_here

# Optional: Google Generative AI (Gemini)
GEMINI_API_KEY=your_gemini_key_here
```

### Frontend `.env` (Optional)

Create `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 🔄 Application Flow

### 1️⃣ **Create RFP Flow**

```
Frontend (RfpCreate.jsx)
    ↓
User fills form: subject, budget, delivery, lineItems, vendors
    ↓
Form validation (Zod: rfpValidator)
    ↓
POST /api/v1/rfp/create
    ↓
Backend (rfp.controller.js → createRfp)
    ↓
Validate payload with Zod
    ↓
Create RFP document in MongoDB
    ↓
Store vendors & line items
    ↓
Return RFP document with _id
    ↓
Frontend redirects to rfp listing
```

**Key Files**: 
- Frontend: `Frontend/src/Pages/RfpCreate.jsx`
- Backend: `Backend/Controller/rfp.controller.js`
- Schema: `Backend/model/rfp.model.js`
- Validation: `Backend/services/validations/rfp.validation.js`

---

### 2️⃣ **Send RFQ Email Flow**

```
Frontend (Rfp.jsx or RfpView.jsx)
    ↓
User clicks "Create RFQ" button
    ↓
POST /api/v1/email/outbound
{
  _id: rfpId,
  vendors: [{ vendor, email }]
}
    ↓
Backend (email.controller.js → sendmail)
    ↓
Fetch RFP document + vendor details
    ↓
For each vendor:
  - Extract vendor email(s) using emailFinder.js
  - Generate HTML email using emailTemplate.js
  - Create transporter (Gmail SMTP via Nodemailer)
  - Send email with subject: "Request for Quotation {rfpId}"
    ↓
Return success response
    
```

**Key Files**:
- Frontend: `Frontend/src/Pages/Rfp.jsx` (or RfpView.jsx)
- Backend Controller: `Backend/Controller/email.controller.js`
- Email Services:
  - `Backend/services/emailFinder.js` — Extract vendor emails
  - `Backend/services/emailTemplate.js` — Generate RFQ HTML

**Example Email Subject**:
```
Request for Quotation 67a1b2c3d4e5f6g7h8i9j0k1
```

---

### 3️⃣ **Automated Email Reply Processing Flow** (NEW)

```
Vendor receives RFQ email
    ↓
Vendor replies to email with quotation details
    ↓
Email arrives in Gmail inbox
    ↓
[Manual Option] Backend polls IMAP periodically

    ↓
Backend (emailWebhook.controller.js)
    ↓
Extract email data: subject, from, text, html
    ↓
PARSE INCOMING EMAIL:
    ↓
  Extract RFP ID from subject using regex:
    
    ↓
  Find RFP in DB by extracted ID
    ↓
  Find Vendor by email address
    ↓
  Verify vendor is part of RFP vendors list
    ↓
EXTRACT QUOTATION DATA:
  Call Groq LLM (email.js pattern)
    ↓
  Groq prompt: Parse email body → extract line items, qty, price
    ↓
  Groq returns JSON: { lineItems: [...], amount, currency, notes }
    ↓
CREATE QUOTATION:
  Store in MongoDB with:
    - vendor: vendorId
    - quotevalue: [{ name, qty, unitPrice, description }]
    - amount: calculated total
    ↓
Return Response with:
  - rfpId
  - vendorId
  - quotation document
  - parsedData (lineItems, amount, currency)
  - emailMetadata (from, subject, receivedAt)
```

**Key Files**:
- Controller: `Backend/Controller/emailWebhook.controller.js`
- Service: `Backend/services/emailWebhookService.js`
- LLM: `Backend/services/LLM/createRfp.js` (Groq prompting)


---

### 5️⃣ **Create RFP from Free Text Flow** (AI Feature)

```
Frontend (future feature)
    ↓
User enters free text description:
"I need 20 solar panels at ~7200 each, 1 inverter 10kW around 58k, 
 mounting structure 1200 each. Budget ~250k, delivery by Feb 15"
    ↓
POST /api/v1/ai/createRFP
{
  text: "..."
}
    ↓
Backend (ai.controller.js → createRfpControllerGroq)
    ↓
Call Groq LLM (createRfp.js)
    ↓
Groq converts free text → structured RFP JSON
    ↓
Returns:
{
  subject: "...",
  budget: 250000,
  lineItem: [...],
  delivery: "2025-02-15",
  ...
}
    ↓
Frontend receives structured data
    ↓
User reviews/edits and submits to create RFP
```

**Key File**: `Backend/services/LLM/createRfp.js`

---

## 🔌 API Endpoints

### RFP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/rfp/list` | List all RFPs |
| POST | `/api/v1/rfp/create` | Create new RFP |
| GET | `/api/v1/rfp/view/:id` | Get RFP details |
| PUT | `/api/v1/rfp/update/:id` | Update RFP |
| DELETE | `/api/v1/rfp/delete/:id` | Delete RFP |

### Email Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/email/outbound` | Send RFQ emails to vendors |


### Quotation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/quote/list` | List all quotations |
| POST | `/api/v1/quote/create` | Create quotation |
| GET | `/api/v1/quote/view/:id` | Get quotation |
| PUT | `/api/v1/quote/update/:id` | Update quotation |
| DELETE | `/api/v1/quote/delete/:id` | Delete quotation |

### Vendor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/vendor/list` | List all vendors |
| POST | `/api/v1/vendor/register` | Register new vendor |
| GET | `/api/v1/vendor/view/:id` | Get vendor details |
| PUT | `/api/v1/vendor/update/:id` | Update vendor |
| DELETE | `/api/v1/vendor/delete/:id` | Delete vendor |

### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/createRFP` | Generate RFP from free text using Groq |
| POST | `/api/v1/ai/process-emails` | Generate Quotation from Vendor Responses using Groq |

---

## 📊 Database Models

### RFP Model (`rfp.model.js`)

```javascript
{
  _id: ObjectId,
  subject: String,           // "Procurement of Solar System"
  budget: Number,            // 250000
  billingAddress: String,    // "45 Industrial Area, Bangalore"
  delivery: Date,            // 2025-02-15
  vendors: [{                // Array of vendor references
    vendor: ObjectId ref,    // Vendor document reference
    quotation: ObjectId ref  // Quotation document reference
  }],
  lineItem: [{               // Line items in RFP
    name: String,            // "Solar Panel 450W"
    quantity: Number,        // 20
    unitPrice: Number,       // 7200
    description: String      // "High efficiency monocrystalline"
  }],
  remark: String,            // Additional notes
  status: Enum,              // "Pending" | "Submitted" | "Quoted" | "Cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

### Quotation Model (`quotation.model.js`)

```javascript
{
  _id: ObjectId,
  vendor: ObjectId ref,      // Vendor who submitted quote
  ref:Object ref,            // RFP for which this quote is made
  amount: Number,            // Total amount auto-calculated
  quotevalue: [{             // Line items in quotation
    name: String,            // "Solar Panel 450W"
    quantity: Number,        // 20
    unitPrice: Number,       // 7200
    description: String,
    total: Number            // qty * unitPrice
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Vendor Model (`vendor.model.js`)

```javascript
{
  _id: ObjectId,
  vendorName: String,        // "Solar Vendor Inc"
  email: String,             // Primary email
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
  gstNumber: String,
  contactPerson: String,
  registeredAt: Date
}
```

---

## ✨ Features

### ✅ Implemented

- [x] Vendor Management (CRUD)
- [x] RFP Creation with line items
- [x] Send RFQ emails to vendors (HTML formatted)
- [x] **Automatic email reply processing** 
- [x] **AI-powered quotation extraction** (Groq LLM)
- [x] Quotation management
- [x] RFP status tracking
- [x] CORS enabled for frontend
- [x] Form validation (Zod)
- [x] Error handling & logging
- [x] Responsive UI


### 🚀 Planned Features

- [ ] Status Updates
- [ ] File attachment parsing (PDF, Excel quotes)
- [ ] Use of redux to reduce api call
- [ ] Improved UI/UX
- [ ] Email templates customization
- [ ] Bulk RFP sending
- [ ] Advanced analytics dashboard

---

## 🚀 Running the Project

### Start MongoDB (if local)

```bash
mongod
```

### Start Backend

```bash
cd Backend
npm run dev
```

Server starts at: **http://localhost:8000**

Console output:
```
Server is up and ready!!!!!
server listening on 8000
```

### Start Frontend

```bash
cd Frontend
npm run dev
```

App opens at: **http://localhost:5173**

---

## 📝 Example Workflow

### Scenario: Send RFQ and Receive Quotation

1. **Open the Link** → http://localhost:5173
2. **Create RFP**
   - Click "Create New RFP"
   - Fill: Subject, Budget, Delivery, Line Items
   - Select vendors
   - Click "Create RFP"
3. **Send RFQ**
   - Go to RFP list
   - Click RFP row
   - Click "Send RFQ"
   - Emails sent to all vendors
4. **Receive Reply** (automatic)
   - Vendor receives email with RFP details
   - Vendor replies with quotation
   - **Cron automatically**:
     - Extracts RFP ID from subject
     - Finds vendor by email
     - Parses quotation using Groq
     - Creates quotation record
5. **View Quotation**
   - Go to RFP details
   - See quotations from each vendor
   - Compare prices and terms

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `Cannot find module 'dotenv'`
```bash
cd Backend && npm install
```

**Error**: `GROQ_API_KEY is undefined`
- Check `.env` file exists in `Backend/`
- Verify `GROQ_API_KEY` is set
- Restart backend after `.env` changes

**Error**: `MongoDB connection failed`
- Verify MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`
- For Atlas: verify connection string and whitelist IP

### Frontend CORS Error

**Error**: `Access-Control-Allow-Origin`
- Verify backend CORS_ORIGIN in `.env`: `http://localhost:5173`
- Backend must be running
- Frontend must use `http://localhost:5173` (not 127.0.0.1)

### Emails Not Sending

**Error**: `Invalid login: Application-specific password required`
- Enable 2FA on Gmail
- Generate app-specific password (not regular password)
- Paste 16-char password into `.env` as `PASS`

**Error**: `imap.openBox is not a function`
- Install IMAP package: `npm install imap`

### Groq Parsing Fails

**Error**: `GROQ_API_KEY is not set`
- Verify key in `.env`
- Check server.js is loading dotenv before app modules
- Restart with: `npm run dev`

**Error**: `Invalid JSON from Groq`
- Groq response format changed
- Check `createRfp.js` prompt format
- Ensure model is `llama3-8b-8192`

---

## 📞 Support & Contribution

For issues or improvements:
1. Check this README first
2. Review error logs in terminal
3. Check `.env` configuration
4. Open an issue with:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, MongoDB)

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0
