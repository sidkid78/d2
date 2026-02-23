# Dwellingly: Commission Protection Infrastructure

Dwellingly is a modern real estate platform designed to streamline and protect professional relationships through transparency, AI-powered insights, and secure verification.

## ✨ Key Features

- **Liquid Glass Aesthetic**: A premium, high-fidelity user interface built with the latest Tailwind CSS v4, featuring glassmorphism and smooth micro-animations.
- **AI-Powered Facilitation**: Real-time agreement summarization using **Gemini 3 Flash**, translating complex legal terms into plain, accessible language.
- **Secure Digital Signatures**: Integrated signature capture system to finalize buyer representation agreements with ease.
- **Public Verification Protocol**: Every signed agreement generates a unique Commission Protection Certificate with a dynamic QR code for instant, public validation.
- **Audit-Ready Lifecycle**: End-to-end event logging (Audit Engine) tracking invitations from creation to signature.

## 🛠️ Technical Architecture

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **AI Integration**: [Google GenAI SDK (@google/genai)](https://ai.google.dev/gemini-api/docs)
- **Document & Verification**:
  - `html2canvas` & `jspdf` for certificate generation.
  - `react-qr-code` for public verification links.
  - `react-signature-canvas` for secure digital inputs.

## 🚀 Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file with your Gemini API Key:

   ```env
   VITE_GEMINI_API_KEY=your_key_here
   ```

3. **Run Development Server**:

   ```bash
   npm run dev
   ```

---
*© 2026 Dwellingly. Built for the future of real estate.*
