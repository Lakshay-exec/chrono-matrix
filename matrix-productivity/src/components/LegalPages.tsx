import React from 'react';
import { ArrowLeft, Shield, Lock, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onBack }) => {
  return (
    <div className="min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-main)] font-sans-app p-4 sm:p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs font-mono opacity-70 hover:opacity-100 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chrono Matrix</span>
        </button>

        {type === 'privacy' ? (
          /* Privacy Policy */
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed opacity-90 font-mono">
            <div className="space-y-2 border-b border-current/10 pb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-3 h-3" />
                <span>OFFICIAL SPECIFICATION</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-app text-current">
                Chrono Matrix Privacy Policy & Google API Disclosure
              </h1>
              <p className="text-[11px] opacity-50">Last updated: November 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-current">1. Overview & Core Philosophy</h2>
              <p className="opacity-80">
                Chrono Matrix is an educational, minimalist productivity and habit tracking web application developed by students for personal discipline and time management. We operate on a <strong>local-first data sovereignty principle</strong>: your habits, journal logs, and disciplinary strikes are primarily stored on your local device.
              </p>
            </section>

            <section className="space-y-3 p-4 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-500/5">
              <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>2. Google API Services User Data Policy Compliance</span>
              </h2>
              <p className="opacity-90">
                Chrono Matrix requests read-only permissions for Google Fitness APIs (specifically <code>fitness.activity.read</code> and <code>fitness.sleep.read</code>) solely to display daily step counts, active minutes, and circadian sleep telemetry to the user.
              </p>
              <ul className="list-disc list-inside space-y-1.5 opacity-80 pt-1">
                <li><strong>No Commercial Sale:</strong> We never sell your Google user or fitness data to data brokers or third parties.</li>
                <li><strong>No Advertising:</strong> Google Fit data is never used for targeting advertisements or tracking users across external websites.</li>
                <li><strong>Strict Local Scoping:</strong> Health and fitness telemetry retrieved via the Google Fit REST API is stored solely in local client storage and can be wiped instantly by tapping "Disconnect Google Fit".</li>
                <li><strong>Limited Use Requirements:</strong> Chrono Matrix's use and transfer of information received from Google APIs adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer" className="underline text-emerald-400">Google API Services User Data Policy</a>, including Limited Use requirements.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-current">3. Information We Collect</h2>
              <p className="opacity-80">
                When you sign in using Google Authentication, we receive your email address and profile name to authenticate your account and sync your encrypted habit matrix to Google Firebase Firestore. If you use Offline Guest Mode, no account information is gathered.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-current">4. Data Deletion & Revocation</h2>
              <p className="opacity-80">
                You can revoke Chrono Matrix's access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="underline">Google Account Security Permissions</a>. You can also wipe all local data by clicking the "System Reset" option inside the app.
              </p>
            </section>

            <section className="space-y-2 border-t border-current/10 pt-4 text-[11px] opacity-60">
              <p>Developer Contact: kandolalakshay23@gmail.com</p>
              <p>Hosting: Vercel / Google Cloud Firebase</p>
            </section>
          </div>
        ) : (
          /* Terms of Service */
          <div className="space-y-6 text-xs sm:text-sm leading-relaxed opacity-90 font-mono">
            <div className="space-y-2 border-b border-current/10 pb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>TERMS & USER COVENANT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif-app text-current">
                Chrono Matrix Terms of Service
              </h1>
              <p className="text-[11px] opacity-50">Last updated: November 2026</p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-current">1. Permitted Use</h2>
              <p className="opacity-80">
                Chrono Matrix is provided 100% free of charge for individual personal productivity, time habit tracking, and sleep consistency analysis. There are no paid tiers or hidden subscription fees.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-current">2. User Responsibility & Disciplinary Tribunal</h2>
              <p className="opacity-80">
                The Disciplinary Tribunal and accountability features represent voluntary stoic self-regulation protocols. Users are solely responsible for setting their own disciplinary commitments.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-current">3. Air-Gapped & PWA Availability</h2>
              <p className="opacity-80">
                The service is provided "as is" with client-side progressive web app caching. You are encouraged to utilize the JSON backup export feature periodically to maintain offline data records.
              </p>
            </section>

            <section className="space-y-2 border-t border-current/10 pt-4 text-[11px] opacity-60">
              <p>Inquiries: kandolalakshay23@gmail.com</p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
