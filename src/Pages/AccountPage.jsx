import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EventDetailsModal from "../Components/EventDetailsModal";
import {
  Heart,
  Loader2,
  LogOut,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";

import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80";

/* =====================================================
   EVENT CARD
===================================================== */

const EventCard = ({ event, onOpen }) => {
  const image = event?.image || event?.coverImageUrl || FALLBACK_IMAGE;

  const eventDate =
    event?.date || event?.startDate || event?.start_date || "";

  const parsedDate = eventDate?.toDate
    ? eventDate.toDate()
    : eventDate
      ? new Date(eventDate)
      : null;

  const validDate =
    parsedDate && !Number.isNaN(parsedDate.getTime());

  const day = validDate
    ? parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
    })
    : "";

  const month = validDate
    ? parsedDate.toLocaleDateString("en-IN", {
      month: "short",
    })
    : "";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpen(event)}
      className="group flex h-full w-full min-w-0 cursor-pointer flex-col outline-none"
    >
      {/* EVENT IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#e9ece7] shadow-[0_10px_28px_rgba(24,35,34,0.07)] transition duration-300 group-hover:shadow-[0_18px_38px_rgba(24,35,34,0.12)]">
        <img
          src={image}
          alt={event?.title || "Event"}
          loading="lazy"
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      {/* EVENT DETAILS */}
      <div className="px-1.5 pt-3.5 sm:px-2 sm:pt-4">

        {/* DATE */}
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#44807F] sm:text-[11px]">
          {validDate ? (
            <>
              {day} {month}
            </>
          ) : (
            "Date TBA"
          )}
        </div>

        {/* EVENT NAME */}
        <h4 className="line-clamp-2 text-sm font-extrabold leading-[1.15] tracking-[-0.02em] text-[#182322] sm:text-base">
          {event?.title || "Untitled Event"}
        </h4>

        {/* LOCATION / PRICE */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-[#182322]/60 sm:text-xs">
          {(event?.location || event?.venue) && (
            <span className="truncate">
              {event?.location || event?.venue}
            </span>
          )}

          {(event?.location || event?.venue) && event?.price && (
            <span className="text-[#182322]/25">
              •
            </span>
          )}

          {event?.price && (
            <span className="text-[#182322]">
              Starts from ₹
              {String(event.price).replace(/^₹\s*/, "")}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};
/* =====================================================
   EMPTY WISHLIST
===================================================== */

const EmptyWishlist = () => {
  return (
    <div className="rounded-md border border-dashed border-[#182322]/15 bg-white/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-[#FEDF24]/30 text-[#182322]">
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

/* =====================================================
   EMPTY BOOKED EVENTS
===================================================== */

const EmptyBookedEvents = () => {
  return (
    <div className="rounded-md border border-dashed border-[#182322]/15 bg-white/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-[#44807F]/10 text-[#44807F]">
        <History size={28} />
      </div>

      <h3 className="mt-5 text-xl font-black text-[#182322]">
        No booked events
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#182322]/50">
        Events you have booked will appear here.
      </p>
    </div>
  );
};

/* =====================================================
   REUSABLE EVENT RAIL
===================================================== */

const EventRail = ({ events, railId, label, onOpenEvent }) => {
  return (
    <div className="relative px-0 sm:px-14">
      {/* DESKTOP LEFT BUTTON */}
      {events.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => {
              document.getElementById(railId)?.scrollBy({
                left: -350,
                behavior: "smooth",
              });
            }}
            aria-label={`Previous ${label}`}
            className="absolute left-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border-2 border-[#182322]/15 bg-[#FFF3C4] text-[#182322] shadow-lg transition hover:border-[#182322] hover:bg-[#182322] hover:text-[#FEDF24] sm:flex"
          >
            <ChevronLeft size={19} strokeWidth={2.5} />
          </button>

          {/* DESKTOP RIGHT BUTTON */}
          <button
            type="button"
            onClick={() => {
              document.getElementById(railId)?.scrollBy({
                left: 350,
                behavior: "smooth",
              });
            }}
            aria-label={`Next ${label}`}
            className="absolute right-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border-2 border-[#182322]/15 bg-[#FFF3C4] text-[#182322] shadow-lg transition hover:border-[#182322] hover:bg-[#182322] hover:text-[#FEDF24] sm:flex"
          >
            <ChevronRight size={19} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* HORIZONTAL EVENT CARDS */}
      <div
        id={railId}
        className="flex gap-3 overflow-x-auto pb-3 sm:gap-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {events.map((event) => (
          <div
            key={`${event.companyId || "event"}-${event.id}`}
            className="w-[68%] min-w-[68%] shrink-0 snap-start sm:w-[43%] sm:min-w-[43%] md:w-[31.5%] md:min-w-[31.5%] lg:w-[23.5%] lg:min-w-[23.5%]"
          >
            <EventCard
              event={event}
              onOpen={onOpenEvent}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* =====================================================
   ACCOUNT PAGE
===================================================== */

const AccountPage = () => {
  const navigate = useNavigate();

  const {
    user,
    profile,
    loading: authLoading,
    logout,
  } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  const [bookedEvents, setBookedEvents] = useState([]);
  const [bookedEventsLoading, setBookedEventsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleOpenEvent = (event) => {
    if (!event) return;

    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEvent = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  /* =====================================================
     WISHLIST
  ===================================================== */

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
        const wishlistEvents = snapshot.docs.map(
          (wishlistDoc) => ({
            id: wishlistDoc.id,
            ...wishlistDoc.data(),
          })
        );

        setWishlist(wishlistEvents);
        setWishlistLoading(false);
      },
      () => {
        setWishlistLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, authLoading]);

  /* =====================================================
     MY BOOKED EVENTS
  ===================================================== */

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setBookedEvents([]);
      setBookedEventsLoading(false);
      return;
    }

    const normalizePhone = (value) => {
      if (!value) return "";

      const digits = String(value).replace(/\D/g, "");

      return digits.slice(-10);
    };

    const profilePhone = normalizePhone(profile?.phone);
    const authPhone = normalizePhone(user?.phoneNumber);

    const possiblePhones = [
      profilePhone,
      authPhone,
    ].filter(Boolean);

    const uniquePhones = [...new Set(possiblePhones)];

    if (uniquePhones.length === 0) {
      setBookedEvents([]);
      setBookedEventsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchBookedEvents = async () => {
      try {
        setBookedEventsLoading(true);

        const COMPANY_ID = "CMP-3158";

        const eventsRef = collection(
          db,
          "companies",
          COMPANY_ID,
          "events"
        );

        const eventsSnapshot = await getDocs(eventsRef);

        if (cancelled) return;

        if (eventsSnapshot.empty) {
          setBookedEvents([]);
          return;
        }

        const bookedEventsMap = new Map();

        for (const eventDoc of eventsSnapshot.docs) {
          if (cancelled) return;

          try {
            const eventId = eventDoc.id;
            const eventData = eventDoc.data();

            const attendeesRef = collection(
              db,
              "companies",
              COMPANY_ID,
              "events",
              eventId,
              "attendees"
            );

            const attendeesSnapshot = await getDocs(
              attendeesRef
            );

            if (cancelled) return;

            if (attendeesSnapshot.empty) continue;

            const matchedAttendee = attendeesSnapshot.docs.find(
              (attendeeDoc) => {
                const attendeeData = attendeeDoc.data();

                const attendeePhone = normalizePhone(
                  attendeeData?.phone
                );

                return uniquePhones.includes(attendeePhone);
              }
            );

            if (!matchedAttendee) continue;

            const event = {
              id: eventId,
              companyId: COMPANY_ID,
              title: eventData?.title || "Untitled Event",
              category: eventData?.category || "",
              description: eventData?.description || "",
              date: eventData?.date || "",
              endDate: eventData?.endDate || "",
              time: eventData?.time || "",
              venue: eventData?.venue || "",
              location: eventData?.location || "",
              isOnline: eventData?.isOnline || false,
              image:
                eventData?.coverImageUrls?.[0] ||
                eventData?.coverImageUrl ||
                eventData?.coverImageDesktop ||
                FALLBACK_IMAGE,
              images:
                eventData?.coverImageUrls ||
                (eventData?.coverImageUrl
                  ? [eventData.coverImageUrl]
                  : []),
              subdomain: eventData?.subdomain || "",
              status: eventData?.status || "",
              isPrivate: eventData?.isPrivate || false,
              registrationMode:
                eventData?.registrationMode || "tickets",
              rsvpLink: eventData?.rsvpLink || "",
              rsvpButtonLabel:
                eventData?.rsvpButtonLabel || "RSVP Now",
              tiers: eventData?.tiers || [],
            };

            const uniqueKey = `${COMPANY_ID}_${eventId}`;

            bookedEventsMap.set(uniqueKey, event);
          } catch (eventError) {
            // Ignore errors for individual events.
          }
        }

        const finalBookedEvents = Array.from(
          bookedEventsMap.values()
        ).sort((a, b) => {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();

          return dateB - dateA;
        });

        setBookedEvents(finalBookedEvents);
      } catch (error) {
        setBookedEvents([]);
      } finally {
        if (!cancelled) {
          setBookedEventsLoading(false);
        }
      }
    };

    fetchBookedEvents();

    return () => {
      cancelled = true;
    };
  }, [
    user?.uid,
    user?.phoneNumber,
    profile?.phone,
    authLoading,
  ]);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      // Ignore logout errors.
    } finally {
      setLoggingOut(false);
    }
  };

  /* =====================================================
     AUTH LOADING
  ===================================================== */

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

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-5 pb-20 pt-28 text-[#182322] sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-xl rounded-md border border-[#182322]/10 bg-white p-8 text-center shadow-[0_20px_60px_rgba(24,35,34,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-[#182322] text-[#FEDF24]">
            <User size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-black">
            Login to your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#182322]/55">
            Login to view your wishlist and manage your OutSold
            account.
          </p>
        </div>
      </main>
    );
  }

  const displayName =
    profile?.name ||
    user?.displayName ||
    "User";

  const displayPhone =
    profile?.phone ||
    user?.phoneNumber ||
    "Mobile number unavailable";

  /* =====================================================
     PAGE UI
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#fffdf5] px-5 pb-20 pt-28 text-[#182322] sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        {/* ACCOUNT HEADER */}
        <section className="relative overflow-hidden rounded-md bg-[#182322] p-6 shadow-[0_20px_60px_rgba(24,35,34,0.15)] sm:p-8 lg:p-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-md bg-[#FEDF24]/20 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-md bg-[#44807F]/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* USER INFO */}
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[#FEDF24] text-2xl font-black text-[#182322] sm:h-20 sm:w-20 sm:text-3xl">
                {displayName.charAt(0).toUpperCase()}
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
                  <span className="break-all">
                    {displayPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex shrink-0 items-center justify-center gap-2 rounded-md border border-[#FEDF24]/40 bg-[#FEDF24] px-5 py-3 text-sm font-extrabold text-[#182322] shadow-[4px_4px_0_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <LogOut size={17} />
              )}

              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </section>

        {/* MY BOOKED EVENTS */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
                My Booked Events

                <History
                  size={24}
                  className="text-[#44807F]"
                />
              </h2>

              <p className="mt-1 text-sm text-[#182322]/50">
                Events you have booked
              </p>
            </div>
          </div>

          {bookedEventsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2
                size={30}
                className="animate-spin text-[#44807F]"
              />
            </div>
          ) : bookedEvents.length === 0 ? (
            <EmptyBookedEvents />
          ) : (
            <EventRail
              events={bookedEvents}
              railId="booked-events-rail"
              label="booked events"
              onOpenEvent={handleOpenEvent}
            />
          )}
        </section>

        {/* WISHLIST */}
        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
                Wishlist
                <Heart
                  size={24}
                  className="fill-[#FF4F8B] text-[#FF4F8B]"
                />
              </h2>

              <p className="mt-1 text-sm text-[#182322]/50">
                Events you are interested in
              </p>
            </div>
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
            <EventRail
              events={wishlist}
              railId="wishlist-events-rail"
              label="wishlist events"
              onOpenEvent={handleOpenEvent}
            />
          )}
        </section>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={handleCloseEvent}
        />
      )}
    </main>
  );
};

export default AccountPage;