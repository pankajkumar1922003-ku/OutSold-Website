import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  Phone,
  User,
  ArrowUpRight,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80";

const formatDate = (value) => {
  if (!value) return "Date TBA";

  const date = value?.toDate
    ? value.toDate()
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const EventCard = ({ event, onOpen }) => {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-[#182322]/10 bg-[#FFF3C4] shadow-[0_10px_30px_rgba(24,35,34,0.06)]"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-[#182322]/10">
        <img
          src={event?.image || FALLBACK_IMAGE}
          alt={event?.title || "Event"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        <span className="absolute left-3 top-3 rounded-full bg-[#FEDF24] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#182322] shadow-sm">
          {event?.category || "Event"}
        </span>
      </div>

      <div className="relative border-t-2 border-dashed border-[#182322]/15 p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-[#182322]">
              {event?.title || "Untitled Event"}
            </h3>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-xs font-semibold text-[#182322]/55">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={14}
              className="shrink-0 text-[#44807F]"
            />

            <span>
              {formatDate(event?.date)}
            </span>
          </div>

          {event?.location && (
            <div className="flex items-center gap-2">
              <MapPin
                size={14}
                className="shrink-0 text-[#44807F]"
              />

              <span className="line-clamp-1">
                {event.location}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpen(event)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#182322] px-4 py-3 text-sm font-black text-[#FEDF24] transition hover:bg-[#44807F] hover:text-white"
        >
          Explore
          <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.article>
  );
};

const EmptyWishlist = () => {
  return (
    <div className="rounded-3xl border border-dashed border-[#182322]/15 bg-white/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEDF24]/30 text-[#182322]">
        <Heart size={28} />
      </div>

      <h3 className="mt-5 text-xl font-black text-[#182322]">
        Your wishlist is empty
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#182322]/50">
        Tap the heart on any event you like and it will appear here.
      </p>
    </div>
  );
};

const AccountPage = () => {
  const navigate = useNavigate();

  const {
    user,
    profile,
    loading: authLoading,
    logout,
  } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] =
    useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.uid) {
      setWishlist([]);
      setWishlistLoading(false);
      return;
    }

    setWishlistLoading(true);

    const wishlistRef = collection(
      db,
      "outsold_users",
      user.uid,
      "wishlist"
    );

    const wishlistQuery = query(
      wishlistRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      wishlistQuery,
      (snapshot) => {
        const wishlistEvents =
          snapshot.docs.map((wishlistDoc) => ({
            id: wishlistDoc.id,
            ...wishlistDoc.data(),
          }));

        setWishlist(wishlistEvents);
        setWishlistLoading(false);
      },
      (error) => {
        console.error(
          "Wishlist fetch error:",
          error
        );

        setWishlistLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const openEvent = (event) => {
    const baseUrl = event?.subdomain
      ? `https://${event.subdomain}.outsold.in`
      : "https://app.outsold.in";

    const title = String(
      event?.title || "event"
    );

    const eventId = String(
      event?.id || ""
    );

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    window.location.href =
      `${baseUrl}/e/${slug || "event"}--${eventId}`;
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf5]">
        <Loader2
          size={30}
          className="animate-spin text-[#44807F]"
        />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-5 pb-20 pt-28 text-[#182322] sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-xl rounded-[30px] border border-[#182322]/10 bg-white p-8 text-center shadow-[0_20px_60px_rgba(24,35,34,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#182322] text-[#FEDF24]">
            <User size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-black">
            Login to your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#182322]/55">
            Login to view your wishlist and manage your OutSold account.
          </p>
        </div>
      </main>
    );
  }

  const displayName = profile?.name || user?.displayName || "User";

  const displayPhone =
    profile?.phone ||
    user?.phoneNumber ||
    "Mobile number unavailable";

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 pb-20 pt-28 text-[#182322] sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* ACCOUNT HEADER */}
        <section className="relative overflow-hidden rounded-[30px] bg-[#182322] p-6 shadow-[0_20px_60px_rgba(24,35,34,0.15)] sm:p-8 lg:p-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#FEDF24]/20 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-[#44807F]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* USER INFO */}
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FEDF24] text-2xl font-black text-[#182322] sm:h-20 sm:w-20 sm:text-3xl">
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FEDF24]/70">
                  My Account
                </p>

                <h1 className="mt-1 truncate text-2xl font-black text-white sm:text-4xl">
                  {displayName}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/55">
                  <Phone size={15} />

                  <span>
                    {displayPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-sm transition hover:bg-[#FEDF24] hover:text-[#182322] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <LogOut size={17} />
              )}

              {loggingOut
                ? "Logging out..."
                : "Logout"}
            </button>
          </div>
        </section>

        {/* WISHLIST */}
        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
                Wishlist

                <Heart
                  size={24}
                  className="fill-[#FEDF24] text-[#182322]"
                />
              </h2>

              <p className="mt-1 text-sm text-[#182322]/50">
                Events you are interested in
              </p>
            </div>

            <span className="rounded-full bg-[#FEDF24] px-3 py-1 text-xs font-black text-[#182322]">
              {wishlist.length}
            </span>
          </div>

          {wishlistLoading ? (
            <div className="flex justify-center py-16">
              <Loader2
                size={30}
                className="animate-spin text-[#44807F]"
              />
            </div>
          ) : wishlist.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onOpen={openEvent}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AccountPage;