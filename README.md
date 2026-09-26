# Income Network - Modern Affiliate & Referral Platform

A complete, mobile-friendly referral and affiliate marketing platform built exclusively using **HTML5, CSS3, and Vanilla JavaScript**. Designed specifically for 100% static hosting on **GitHub Pages** with zero backend or database setup required.

---

## 📁 Repository File Structure

```text
├── index.html        # Main landing page with Hero, Calculator, Success Stories, Tiers, FAQ
├── dashboard.html    # Direct user dashboard with balance, referrals, link copier & simulator
├── referral.html     # Multi-tier referral hub, attribution roster, and promotional media kit
├── admin.html        # Administrative control console with user table, search & settings
├── style.css         # Main modern dark theme stylesheet with emerald/cyan accents
├── admin.css         # Admin console stylesheet for high-density tables and management
├── app.js            # Vanilla JavaScript engine: localStorage, referral engine, and simulator
└── README.md         # Deployment and usage documentation
```

---

## 🚀 Key Features

1. **Automatic Referral Parameter Detection**:
   - Captures `?ref=CODE` parameters from any landing or registration URL (e.g. `https://USERNAME.github.io/REPO/?ref=ALEX99`).
   - Stores tracking in browser `localStorage` with a 90-day simulated cookie window.
   - Automatically credits the referring partner upon new user sign-up.

2. **Multi-Tier Affiliate Structure**:
   - **Tier 1 (Direct)**: 25% direct commission on sales/referrals.
   - **Tier 2 (Network Overrides)**: 10% secondary passive override commission.
   - **$10.00 Welcome Starter Bonus**: Credited immediately upon new registration.

3. **Built-In Live Referral Flow Simulator**:
   - Reviewers and affiliates can test the platform without opening second browsers by clicking **"Simulate Link Click"** or **"Simulate Referral Sign-Up (+$25.00)"** directly in `dashboard.html`.

4. **Complete Admin Suite (`admin.html`)**:
   - Global network KPIs (Total Users, Total Referrals, Distributed Earnings, Active Partners).
   - Searchable, filterable affiliate user roster.
   - User detail modals, account status toggles (Active / Suspended), and manual bonus credit tool.
   - Platform settings editor with custom commission rates, minimum withdrawal threshold, and GitHub Pages repository URL override.

---

## 🌐 Step-by-Step Instructions: Deploying to GitHub Pages

### Step 1: Create a GitHub Repository
1. Log in to your [GitHub](https://github.com/) account.
2. Click the **"+"** icon in the top right corner and select **New repository**.
3. Name your repository (e.g., `income-network`).
4. Select **Public** (required for free GitHub Pages).
5. Click **Create repository**.

### Step 2: Upload Files to Your Repository
You can upload the files using Git command line or directly via the GitHub website:

#### Option A: Using Git Command Line
```bash
git init
git add .
git commit -m "Initial commit of Income Network affiliate platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/income-network.git
git push -u origin main
```

#### Option B: Upload via GitHub Web Browser
1. In your new repository on GitHub, click **Upload files** or **Add file > Upload files**.
2. Drag and drop the project files:
   - `index.html`
   - `dashboard.html`
   - `referral.html`
   - `admin.html`
   - `style.css`
   - `admin.css`
   - `app.js`
3. Click **Commit changes**.

### Step 3: Enable GitHub Pages
1. In your repository on GitHub, click the **Settings** tab.
2. In the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment > Source**, ensure **Deploy from a branch** is selected.
4. Under **Branch**, select **`main`** (or `master`) and folder **`/ (root)`**.
5. Click **Save**.

### Step 4: Access Your Live Website
- Within 1–2 minutes, GitHub Pages will deploy your site at:
  ```
  https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
  ```
- Your affiliate links will automatically format as:
  ```
  https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/?ref=YOURCODE
  ```

---

## 🔑 Demo Credentials

- **Affiliate User Account**:
  - Email / Username: `demouser` or `demo@incomenetwork.io`
  - Password: `password123`
  - Or use the **"⚡ 1-Click Login as Demo Affiliate"** button on `login.html`.

- **Admin Console**:
  - Email / Username: `admin@incomenetwork.io`
  - Password: `admin123`
  - Or use the **"⚡ 1-Click Access as Demo Administrator"** button on `admin.html`.
