# User Manual — TestPOS 2.0

## Table of Contents
1. [Getting Started](#getting-started)
2. [Login](#login)
3. [Dashboard](#dashboard)
4. [POS Terminal](#pos-terminal)
5. [Reports](#reports)
6. [User Management](#user-management)
7. [Theme Switching](#theme-switching)
8. [Session Timeout](#session-timeout)

---

## Getting Started

TestPOS 2.0 is a web-based Point of Sales system designed for farm produce retail. Access it via a web browser at the configured URL.

---

## Login

1. Open the application URL in your browser.
2. Enter your **Username** and **Password**.
3. Click **Sign In**.
4. Alternatively, expand **Demo Credentials** and click any row to auto-fill the credentials.

### Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `accounting` | `acc123` | Accounting |
| `cashier` | `cash123` | Cashier |

If you were logged out due to inactivity, you will see a warning banner explaining the reason.

---

## Dashboard

The Dashboard provides an at-a-glance overview of the day's activity.

### Features
- **Welcome Banner**: Shows your name and role.
- **Stats Cards**:
  - Today's Sales (gross revenue)
  - Number of transactions processed today
  - Top product by quantity sold
  - Items currently in the POS cart
- **Quick Actions**: Shortcut buttons to other pages based on your role.
- **Session Info**: Your user details and current time.
- **Recent Transactions**: The last 10 transactions processed today.

---

## POS Terminal

Access: **Admin** and **Cashier** roles only.

### Adding Products to Cart
1. Navigate to **Terminal** from the sidebar.
2. Browse the product grid or use the **search bar** to find products by name or SKU.
3. Use the **category chips** to filter by product category.
4. Click any product card to add it to the cart.

### Managing the Cart
- Use the **+** and **−** buttons to adjust quantities.
- Click the **trash icon** to remove an item.
- Click **Delete Sweep** (top-right of cart) to clear the entire cart.

### Processing Payment
1. When the cart is ready, click **Process Payment**.
2. Select a payment method: **Cash**, **Card**, or **GCash**.
3. For cash payments, enter the **Amount Tendered**. The change is calculated automatically.
4. Click **Confirm Payment**.
5. A receipt dialog will appear showing the transaction details.

---

## Reports

Access: **Admin** and **Accounting** roles only.

### Filtering Data
- Set a **Start Date** and **End Date** to filter transactions.
- Click **Apply** to update the view.
- Use **Today** to view today's data, or **Week** for the last 7 days.

### Available Reports
- **Summary Stats**: Total revenue, transaction count, average transaction value, and items sold.
- **Sales by Day Chart**: Bar chart showing daily sales totals.
- **Top Products**: Top 10 products by revenue with quantity sold.
- **Transaction Log**: Full list of all transactions in the selected date range.

### Exporting Data
Click **Export** to download the filtered transaction data as a CSV file.

---

## User Management

Access: **Admin** role only.

### Viewing Users
The Users page shows all registered system users with their role and active status.

### Adding a User
1. Click **Add User**.
2. Fill in Full Name, Username, Password, and Role.
3. Click **Add User** to save.

### Editing a User
1. Click the **pencil icon** next to the user.
2. Modify the details.
3. Click **Update**.

### Deactivating / Activating a User
Click the **account-off** / **account-check** icon to toggle the user's active status.

> **Note**: User management in this version is UI-only (no persistent backend). Changes are lost on page refresh.

---

## Theme Switching

Click the **sun/moon/circle icon** in the top-right of the app bar (or on the login page) to cycle through themes:

| Theme | Description |
|-------|-------------|
| **Dawn** | Light theme with Forest Green primary |
| **Dusk** | Dark theme with green accents |
| **AMOLED** | Pure black background for OLED displays |

Your theme preference is saved and persists across sessions.

---

## Session Timeout

For security, the system automatically logs you out after **3 minutes of inactivity**.

- A **warning dialog** appears when 30 seconds remain.
- Click **Stay Logged In** or move your mouse / press any key to reset the timer.
- If the timer expires, you are redirected to the login page with an inactivity notice.
