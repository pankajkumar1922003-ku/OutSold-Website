import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, ShieldCheck } from "lucide-react";

const OTPVerification = ({ phone, onBack, onClose, onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, "");

    if (!cleanValue) {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = cleanValue[cleanValue.length - 1];
    setOtp(updatedOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const updatedOtp = [...otp];

    pasted.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const verify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setError("");
      setVerifying(true);

      await onVerify(code);

      onClose();
    } catch (error) {
      console.error("OTP verification error:", error);

      setError(
        error?.code === "auth/invalid-verification-code"
          ? "Incorrect OTP. Please try again."
          : "Unable to verify OTP. Please try again."
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-7 flex items-center gap-2 text-xs font-bold text-[#182322]/55 transition hover:text-[#182322]"
      >
        <ArrowLeft size={15} />
        Change number
      </button>

      <div className="mb-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#44807F]/10">
          <ShieldCheck size={26} className="text-[#44807F]" />
        </div>

        <h2 className="text-2xl font-black tracking-tight text-[#182322]">
          Verify your number
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#182322]/55">
          We sent a 6-digit OTP to{" "}
          <span className="font-bold text-[#182322]">+91 {phone}</span>
        </p>
      </div>

      <div className="mb-6 flex justify-between gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className="h-12 w-11 rounded-xl border border-[#182322]/10 bg-white text-center text-lg font-black text-[#182322] outline-none transition focus:border-[#44807F] focus:ring-4 focus:ring-[#44807F]/10 sm:h-14 sm:w-12"
          />
        ))}
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={verifying}
        onClick={verify}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FEDF24] text-sm font-black text-[#182322] shadow-[0_10px_25px_rgba(254,223,36,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {verifying ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Check size={17} />
            Verify & Login
          </>
        )}
      </button>

      <div className="mt-5 text-center">
        {timer > 0 ? (
          <p className="text-xs font-semibold text-[#182322]/40">
            Resend OTP in{" "}
            <span className="font-black text-[#44807F]">{timer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTimer(30);
              setError("Please go back and request a new OTP.");
            }}
            className="text-xs font-bold text-[#44807F] hover:underline"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;