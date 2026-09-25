import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, ShieldCheck, X } from "lucide-react";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import OTPVerification from "./OTPVerification";
import { useAuth } from "../context/AuthContext";

const LoginModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const { saveProfile } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setStep("details");
      setName("");
      setPhone("");
      setConfirmationResult(null);
      setError("");
      setSendingOtp(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => { },
        "expired-callback": () => {
          window.recaptchaVerifier = null;
        },
      }
    );

    return window.recaptchaVerifier;
  };

  const sendOtp = async () => {
    setError("");

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setSendingOtp(true);

      const appVerifier = setupRecaptcha();
      const formattedPhone = `+91${cleanPhone}`;

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier
      );

      setConfirmationResult(result);
      setStep("otp");
    } catch (error) {
      console.error("OTP error:", error);

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      setError(
        error?.message?.includes("too-many-requests")
          ? "Too many attempts. Please try again later."
          : "Unable to send OTP. Please check your number and try again."
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async (otp) => {
    if (!confirmationResult) return;

    const result = await confirmationResult.confirm(otp);

    await saveProfile(name);

    return result;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-auto fixed inset-0 z-100 flex items-end justify-center bg-[#182322]/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-t-[30px] bg-[#fffdf5] shadow-[0_25px_80px_rgba(24,35,34,0.28)] sm:rounded-[30px]"
        >
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FEDF24]/25 blur-2xl" />
          <div className="absolute -left-20 bottom-0 h-36 w-36 rounded-full bg-[#44807F]/15 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#182322]/5 text-[#182322]/60 transition hover:bg-[#182322]/10"
          >
            <X size={18} />
          </button>

          <div className="relative px-6 pb-7 pt-8 sm:px-8 sm:pt-9">
            {step === "details" ? (
              <>
                <div className="mb-7">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#182322] shadow-[0_10px_25px_rgba(24,35,34,0.16)]">
                    <span className="text-xl font-black text-[#FEDF24]">
                      O
                    </span>
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-[#182322]">
                    Welcome to OutSold
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#182322]/55">
                    Login to discover events, save your interests and keep
                    everything in one place.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#182322]/50">
                      Your name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Enter your name"
                      className="h-12 w-full rounded-xl border border-[#182322]/10 bg-white px-4 text-sm font-semibold text-[#182322] outline-none transition placeholder:text-[#182322]/30 focus:border-[#44807F]/50 focus:ring-4 focus:ring-[#44807F]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#182322]/50">
                      Mobile number
                    </label>

                    <div className="flex h-12 overflow-hidden rounded-xl border border-[#182322]/10 bg-white transition focus-within:border-[#44807F]/50 focus-within:ring-4 focus-within:ring-[#44807F]/10">
                      <div className="flex w-16 shrink-0 items-center justify-center border-r border-[#182322]/10 bg-[#182322]/2.5 text-sm font-bold text-[#182322]">
                        +91
                      </div>

                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(event) =>
                          setPhone(event.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter mobile number"
                        className="min-w-0 flex-1 bg-transparent px-4 text-sm font-semibold text-[#182322] outline-none placeholder:text-[#182322]/30"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={sendingOtp}
                    onClick={sendOtp}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FEDF24] text-sm font-black text-[#182322] shadow-[0_10px_25px_rgba(254,223,36,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(254,223,36,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue with OTP
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-[#182322]/40">
                    <ShieldCheck size={14} className="text-[#44807F]" />
                    Your mobile number is securely verified
                  </div>
                </div>
              </>
            ) : (
              <OTPVerification
                phone={phone}
                onBack={() => setStep("details")}
                onClose={onClose}
                onVerify={verifyOtp}
              />
            )}

            <div id="recaptcha-container" className="hidden"/>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;