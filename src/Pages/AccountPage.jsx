import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, MapPin, Phone, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const AccountPage = () => {
  const navigate = useNavigate();
  const { profile, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffdf5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#44807F]/20 border-t-[#44807F]" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#fffdf5] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-7 flex items-center gap-2 text-sm font-bold text-[#182322]/55 transition hover:text-[#182322]"
        >
          <ArrowLeft size={17} />
          Back to events
        </button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[28px] border border-[#182322]/10 bg-white shadow-[0_20px_60px_rgba(24,35,34,0.08)]"
        >
          <div className="relative overflow-hidden bg-[#182322] px-6 pb-10 pt-8 sm:px-8">
            <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-[#FEDF24]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-[#44807F]/30 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FEDF24]">
                OutSold Account
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
                My Account
              </h1>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-8">
            <div className="-mt-16 mb-8 flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border-4 border-white bg-[#FEDF24] text-3xl font-black text-[#182322] shadow-lg">
                {profile?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="pb-2">
                <h2 className="text-xl font-black text-[#182322]">
                  {profile?.name || "OutSold User"}
                </h2>

                <p className="mt-1 text-sm font-semibold text-[#182322]/45">
                  OutSold member
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-2xl border border-[#182322]/8 bg-[#fffdf5] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10 text-[#44807F]">
                  <UserRound size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#182322]/35">
                    Full name
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#182322]">
                    {profile?.name || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#182322]/8 bg-[#fffdf5] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10 text-[#44807F]">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#182322]/35">
                    Mobile number
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#182322]">
                    {profile?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-[#182322]/8 bg-[#fffdf5] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10 text-[#44807F]">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#182322]/35">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#182322]">
                    {profile?.location || "Not selected"}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-black text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AccountPage;