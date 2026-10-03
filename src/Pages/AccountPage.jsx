import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Loader2,
  LogOut,
  Phone,
  User,
  ArrowUpRight,
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
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-md bg-white shadow-[0_10px_30px_rgba(24,35,34,0.08)] transition duration-300 hover:shadow-[0_16px_36px_rgba(24,35,34,0.14)]"
    >
      {/* EVENT IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e9ece7]">
        {/* Blurred background */}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-2xl"
        />

        {/* Complete event image */}
        <img
          src={image}
          alt={event?.title || "Event"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="absolute inset-0 h-full w-full object-contain transition duration-700 group-hover:scale-[1.03]"
        />

        {/* CATEGORY BADGE */}
        <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#182322] shadow-sm sm:text-xs">
          {event?.category || "Event"}
        </span>
      </div>

      {/* TICKET CONTENT */}
      <div className="relative flex flex-1 flex-col border-t-2 border-dashed border-[#182322]/15 p-3 sm:p-4">
        {/* Ticket cutouts */}
        <span
          aria-hidden="true"
          className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-md bg-[#fffdf5]"
        />

        <span
          aria-hidden="true"
          className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-md bg-[#fffdf5]"
        />

        <div className="flex min-w-0 items-start gap-3">
          {/* DATE */}
          <div className="min-w-[44px] shrink-0 border-r border-[#182322]/10 pr-3 text-center leading-none">
            {validDate ? (
              <>
                <p className="text-2xl font-extrabold tabular-nums text-[#44807F]">
                  {day}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#182322]/70">
                  {month}
                </p>
              </>
            ) : (
              <p className="text-xs font-bold text-[#182322]/60">
                Date TBA
              </p>
            )}
          </div>

          {/* EVENT DETAILS */}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-extrabold leading-snug tracking-[-0.01em] text-[#182322] sm:text-lg">
              {event?.title || "Untitled Event"}
            </h3>

            {(event?.venue || event?.location) && (
              <p className="mt-1 line-clamp-1 text-xs font-medium text-[#182322]/55 sm:text-sm">
                {event.venue || event.location}
              </p>
            )}
          </div>
        </div>

        {/* EXPLORE BUTTON */}
        <button
          type="button"
          onClick={() => onOpen(event)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-[#182322] px-3 py-2.5 text-xs font-bold text-[#FEDF24] transition hover:bg-[#44807F] hover:text-white sm:text-sm"
        >
          Explore Event
          <ArrowUpRight size={15} />
        </button>
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

const EventRail = ({ events, railId, label }) => {
  const handleOpenEvent = (selectedEvent) => {
    const baseUrl = selectedEvent?.subdomain
      ? `https://${selectedEvent.subdomain}.outsold.in`
      : "https://app.outsold.in";

    const title = String(selectedEvent?.title || "event");
    const eventId = String(selectedEvent?.id || "");

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    window.location.href = `${baseUrl}/e/${slug || "event"}--${eventId}`;
  };

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
              onOpen={handleOpenEvent}
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
  const [bookedEventsLoading, setBookedEventsLoading] =
    useState(true);

  const [loggingOut, setLoggingOut] = useState(false);

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
                  className="fill-[#FEDF24] text-[#182322]"
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
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default AccountPage;