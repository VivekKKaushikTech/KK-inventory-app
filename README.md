# 📦 KK Inventory App

A modern, responsive inventory management application built for internal operations at Kanta King.

---

## 🚀 Key Features

- ✅ User authentication (mobile number + password)
- ✅ Dashboard with real-time inventory insights
- ✅ Item addition with QR code generation
- ✅ Inventory movement tracking
- ✅ Category-wise and location-wise analytics (Pie + Bar charts)
- ✅ Responsive UI with Tailwind CSS
- ✅ Excel export with date range filters
- ✅ Role-based dashboard setup
- ✅ Built-in logout confirmation and auto-collapsing sidebar

---

## 🛠️ Tech Stack

| Layer        | Technology                 |
| ------------ | -------------------------- |
| Frontend     | React + Vite               |
| Styling      | Tailwind CSS               |
| Icons        | Lucide Icons + React Icons |
| Charts       | Recharts                   |
| Excel Export | SheetJS (xlsx)             |
| Routing      | React Router DOM           |
| Auth State   | LocalStorage               |

---

## 📁 Folder Structure

```bash
KK-inventory-app/
├── public/
├── src/
│   ├── components/     # Reusable components like Sidebar, Header
│   ├── pages/          # Page-level routes: Dashboard, Inventory, AddItem etc.
│   ├── data/           # Static data like SKU lists
│   └── App.jsx         # Main routing + layout
├── package.json
└── README.md
```
