import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ArrowLeft, CalendarDays, Clock3, MapPin, Tag, ExternalLink, Users, Heart, Share2, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// Date helpers
const toValidDate = (value) => {
    if (!value) return null;

    try {
        let date;

        if (typeof value?.toDate === "function") {
            date = value.toDate();
        } else if (typeof value === "object" && typeof value.seconds === "number") {
            date = new Date(value.seconds * 1000 + (value.nanoseconds || 0) / 1000000);
        } else if (value instanceof Date) {
            date = value;
        } else if (typeof value === "number") {
            date = new Date(value < 100000000000 ? value * 1000 : value);
        } else if (typeof value === "string") {
            const timestampMatch = value.match(/seconds\s*=\s*(\d+)/);

            if (timestampMatch) {
                date = new Date(Number(timestampMatch[1]) * 1000);
            } else {
                date = new Date(value);
            }
        } else {
            return null;
        }

        return Number.isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
};

const formatDate = (value) => {
    const date = toValidDate(value);
    if (!date) return "";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (value) => {
    const date = toValidDate(value);
    if (!date) return "";

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

// Clean HTML description
const cleanDescription = (value) => {
    if (!value) return "";

    if (typeof value !== "string") {
        return "";
    }

    if (!/<\/?[a-z][\s\S]*?>/i.test(value) && !/&(?:amp|lt|gt|quot|#\d+|#x[\da-f]+);/i.test(value)) {
        return value.trim();
    }

    try {
        const formattedHtml = value
            .replace(/<\s*br\s*\/?>/gi, "\n")
            .replace(/<\/?\s*(p|div|li|h[1-6]|blockquote)\s*>/gi, "\n")
            .replace(/<\s*li\b[^>]*>/gi, "• ");

        const parsed = new DOMParser().parseFromString(formattedHtml, "text/html");

        return (parsed.body.textContent || "")
            .replace(/\u00a0/g, " ")
            .replace(/[ \t]+\n/g, "\n")
            .replace(/\n[ \t]+/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    } catch {
        return value.replace(/<[^>]*>/g, "").trim();
    }
};

const EventDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventId: routeEventId } = useParams();
    const [searchParams] = useSearchParams();
    const stateEvent = location.state?.event;
    const source = searchParams.get("source");
    const companyId = searchParams.get("companyId");
    const [event, setEvent] = useState(stateEvent || null);
    const [isLoadingEvent, setIsLoadingEvent] = useState(!stateEvent);
    const [eventError, setEventError] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [wishlistToast, setWishlistToast] = useState(false);
    const { user } = useAuth();
    const eventId = stateEvent?.id || routeEventId || "event";

    useEffect(() => {
        if (stateEvent || !routeEventId) {
            setIsLoadingEvent(false);
            return;
        }

        const loadEvent = async () => {
            try {
                setIsLoadingEvent(true);
                setEventError(false);

                let eventDoc;
                let normalizedEvent;

                if (source === "company" && companyId) {
                    const eventRef = doc(db, "companies", companyId, "events", routeEventId);
                    const eventSnapshot = await getDoc(eventRef);

                    if (!eventSnapshot.exists()) {
                        setEventError(true);
                        return;
                    }

                    const data = eventSnapshot.data();

                    normalizedEvent = {
                        id: eventSnapshot.id,
                        title: data.title || "Untitled Event",
                        category: data.category || "Other",
                        otherCategory: data.otherCategory || data.customCategory || data.categoryName || "",
                        description: data.description || "",
                        date: data.date || data.startDate || "",
                        startDate: data.startDate || data.start_date || data.eventStartDate || data.date || "",
                        endDate: data.endDate || data.end_date || data.eventEndDate || data.startDate || data.date || "",
                        time: data.time || "",
                        startTime: data.startTime || "",
                        eventTime: data.eventTime || "",
                        location: data.venue || data.location || "",
                        venue: data.venue || "",
                        price: data.pricing || "Free",
                        image: data.coverImageDesktop || data.coverImageMobile || data.coverImage || data.coverImageUrl || data.coverImageUrls?.[0],
                        coverImageDesktop: data.coverImageDesktop,
                        coverImage: data.coverImage,
                        coverImageUrl: data.coverImageUrl,
                        coverImageUrls: data.coverImageUrls || [],
                        featured: Boolean(data.featured),
                        displaySection: data.displaySection || "events_youll_love",
                        isOnline: Boolean(data.isOnline),
                        registrationMode: data.registrationMode || "tickets",
                        tiers: data.tiers || [],
                        companyId,
                        slug: data.slug || null,
                        subdomain: data.subdomain || null,
                        isPrivate: Boolean(data.isPrivate),
                        status: data.status || "published",
                        bookingUrl: data.bookingUrl || data.ticketBookingUrl || null,
                        source: "company",
                        organizedBy: data.organizedBy || data.organizerName || data.organizer || "",
                    };

                    const companySnapshot = await getDoc(doc(db, "companies", companyId));

                    if (companySnapshot.exists()) {
                        const companyData = companySnapshot.data();

                        normalizedEvent.organizedBy =
                            normalizedEvent.organizedBy ||
                            companyData.name ||
                            companyData.businessName ||
                            companyData.companyName ||
                            companyData.displayName ||
                            "";

                        normalizedEvent.subdomain =
                            normalizedEvent.subdomain ||
                            companyData.subdomain ||
                            null;
                    }

                    eventDoc = eventSnapshot;
                } else if (source === "event_submission") {
                    const submissionId = routeEventId.startsWith("submission_") ? routeEventId.replace("submission_", "") : routeEventId;
                    const eventRef = doc(db, "event_submissions", submissionId);
                    const eventSnapshot = await getDoc(eventRef);

                    if (!eventSnapshot.exists()) {
                        setEventError(true);
                        return;
                    }

                    const data = eventSnapshot.data();

                    normalizedEvent = {
                        id: `submission_${eventSnapshot.id}`,
                        title: data.eventName || data.title || "Untitled Event",
                        category: data.category || "Other",
                        otherCategory: data.otherCategory || data.customCategory || data.categoryName || "",
                        description: data.description || "",
                        date: data.startDate || data.date || "",
                        startDate: data.startDate || data.date || "",
                        endDate: data.endDate || data.startDate || data.date || "",
                        time: data.time || "",
                        startTime: data.startTime || "",
                        eventTime: data.eventTime || "",
                        location: data.venue || data.location || "",
                        venue: data.venue || data.location || "",
                        price: data.pricing || "Free",
                        image: data.coverImageDesktop || data.coverImageMobile || data.coverImage || data.coverImageUrl || data.coverImageUrls?.[0],
                        coverImageDesktop: data.coverImageDesktop,
                        coverImage: data.coverImage,
                        coverImageUrl: data.coverImageUrl,
                        coverImageUrls: data.coverImageUrls || [],
                        featured: data.displaySection === "featured",
                        displaySection: data.displaySection || "all",
                        isOnline: Boolean(data.isOnline),
                        registrationMode: data.registrationMode || "tickets",
                        tiers: data.tiers || [],
                        companyId: data.companyId || null,
                        slug: data.slug || null,
                        subdomain: data.subdomain || null,
                        isPrivate: Boolean(data.isPrivate),
                        status: data.status || "published",
                        bookingUrl: data.bookingUrl || data.ticketBookingUrl || null,
                        source: "event_submission",
                        organizedBy: data.organizedBy || data.organizerName || data.organizer || "",
                        createdAt: data.createdAt || null,
                        updatedAt: data.updatedAt || null,
                    };

                    eventDoc = eventSnapshot;
                } else {
                    setEventError(true);
                    return;
                }

                if (eventDoc) {
                    setEvent(normalizedEvent);
                }
            } catch (error) {
                console.error("Failed to load shared event:", error);
                setEventError(true);
            } finally {
                setIsLoadingEvent(false);
            }
        };

        loadEvent();
    }, [routeEventId, source, companyId, stateEvent]);

    useEffect(() => {
        if (!user?.uid || !event?.id) {
            setIsWishlisted(false);
            return;
        }

        const wishlistRef = doc(db, "outsold_users", user.uid, "wishlist", event.id);

        const loadWishlistStatus = async () => {
            try {
                const snapshot = await getDoc(wishlistRef);
                setIsWishlisted(snapshot.exists());
            } catch (error) {
                console.error("Wishlist status error:", error);
            }
        };

        loadWishlistStatus();
    }, [user?.uid, event?.id]);

    if (isLoadingEvent) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FFFBEA]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#44807F]/20 border-t-[#44807F]" />
                    <p className="mt-4 text-sm font-bold text-[#182322]/60">Loading event...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#FFFBEA] px-5 py-20">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-3xl font-black text-[#182322]">Event Not Found</h1>
                    <p className="mt-3 text-[#182322]/60">This event details page could not be loaded.</p>
                    <button type="button" onClick={() => navigate("/all-events")} className="mt-7 cursor-pointer rounded-xl bg-[#FEDF24] px-6 py-3 text-sm font-black text-[#182322] transition hover:bg-[#44807F] hover:text-white">All Events</button>
                </div>
            </div>
        );
    }

    const toggleWishlist = async () => {
        if (!user?.uid) {
            window.dispatchEvent(new Event("openLoginModal"));
            return;
        }

        if (!event?.id) return;

        const wishlistRef = doc(db, "outsold_users", user.uid, "wishlist", event.id);

        try {
            if (isWishlisted) {
                await deleteDoc(wishlistRef);
                setIsWishlisted(false);
                return;
            }

            await setDoc(wishlistRef, {
                id: event.id,
                title: event.title || "",
                image: event.image || "",
                category: event.category || "",
                date: event.date || event.startDate || "",
                endDate: event.endDate || "",
                time: event.time || event.startTime || "",
                location: event.location || "",
                venue: event.venue || "",
                price: event.price || "",
                slug: event.slug || null,
                subdomain: event.subdomain || null,
                companyId: event.companyId || null,
                source: event.source || null,
                createdAt: new Date(),
            });

            setIsWishlisted(true);
            setWishlistToast(true);

            window.clearTimeout(window.__outsoldEventDetailsWishlistToastTimer);

            window.__outsoldEventDetailsWishlistToastTimer = window.setTimeout(() => {
                setWishlistToast(false);
            }, 2600);
        } catch (error) {
            console.error("Wishlist update error:", error);
        }
    };

    const startDate = event.startDate || event.start_date || event.eventStartDate || event.date;
    const endDate = event.endDate || event.end_date || event.eventEndDate;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const eventTime = event.startTime || event.eventTime || event.time || formatTime(startDate);

    const image = event.image || event.coverImageDesktop || event.coverImage || event.coverImageUrl || event.imageUrl;

    const description = cleanDescription(event.description);

    // Booking URL
    const bookingUrl = event.bookingUrl || event.ticketBookingUrl || (
        event.source === "company" && event.id
            ? (() => {
                const title = String(event.title || event.eventName || "event");
                const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                const baseUrl = event.subdomain ? `https://${event.subdomain}.outsold.in` : "https://app.outsold.in";
                return `${baseUrl}/e/${slug || "event"}--${event.id}`;
            })()
            : ""
    );

    const hasDifferentEndDate = formattedEndDate && formattedStartDate && formattedEndDate !== formattedStartDate;

    const handleBookTicket = () => {
        if (!bookingUrl) return;
        window.open(bookingUrl, "_blank", "noopener,noreferrer");
    };

    const handleShare = async () => {
        if (!event) return;

        const shareUrlObject = new URL(window.location.href);

        shareUrlObject.search = "";

        if (event.source) {
            shareUrlObject.searchParams.set("source", event.source);
        }

        if (event.companyId) {
            shareUrlObject.searchParams.set("companyId", event.companyId);
        }

        const shareUrl = shareUrlObject.toString();
        const shareTitle = event.title || event.eventName || "Event";
        const shareText = `Check out ${shareTitle} on OutSold.`;

        try {
            if (navigator.share && window.isSecureContext) {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });

                setIsShared(true);
                setTimeout(() => setIsShared(false), 2000);
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        } catch (error) {
            if (error?.name === "AbortError") return;
            console.error("Share failed:", error);
        }
    };
    const organizerName = event.organizedBy || event.organizerName || event.organizer || "Event Organizer";

    return (
        <main className="min-h-screen bg-[#FFFBEA]">
            {/* Organizer header */}
            <div className="flex h-[78px] w-full items-center bg-[#FFFBEA] px-5 sm:px-8 lg:px-16">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black uppercase tracking-tight text-[#182322] sm:text-2xl">{organizerName}</h2>
                    <span className="rounded-md bg-[#FEDF24] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#182322] sm:text-xs">Events</span>
                </div>
            </div>

            {/* Event image */}
            <section className="relative w-full overflow-hidden bg-[#182322]">
                {image ? (
                    <div className="relative flex min-h-[30vh] w-full items-center justify-center overflow-hidden sm:min-h-[65vh] lg:min-h-[72vh]">
                        {/* Blurred background */}
                        <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl" />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/35" />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />

                        {/* Main image */}
                        <img src={image} alt={event.title || event.eventName || "Event"} className="relative z-10 max-h-[72vh] w-full object-contain" />

                        {/* All Events button */}
                        <div className="absolute left-3 top-2 z-30 sm:left-6 sm:top-5">
                            <button type="button" onClick={() => navigate("/all-events")} aria-label="All Events" className="flex items-center gap-2 rounded-md bg-black/45 p-2 md:px-4 md:py-3 text-sm font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[#182322]">
                                <ArrowLeft size={19} />
                                <span>All events</span>
                            </button>
                        </div>

                        {/* Image actions */}
                        <div className="absolute right-4 top-1 z-30 flex items-center gap-2 sm:right-6 sm:top-5">
                            <button type="button" onClick={toggleWishlist} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isWishlisted} className={`flex h-9 w-9 md:h-11 md:w-11 cursor-pointer items-center justify-center rounded-md border backdrop-blur-md transition-all duration-200 ${isWishlisted ? "border-[#FF2D55] bg-white text-[#FF2D55] shadow-[0_5px_14px_rgba(255,45,85,0.18)]" : "border-white/30 bg-black/45 text-white hover:bg-white hover:text-[#182322]"}`}>
                                <Heart size={21} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>

                            <button type="button" onClick={handleShare} aria-label="Share event" className="flex cursor-pointer h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-md border border-white/30 bg-black/45 text-white backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[#182322]">
                                {isShared ? <Check size={20} /> : <Share2 size={20} />}
                            </button>
                        </div>

                        {/* Category */}
                        {(event.category || event.otherCategory) && (
                            <span className="absolute bottom-2 md:bottom-5 left-4 z-30 rounded-full bg-[#FEDF24] p-2 md:px-4 md:py-2 text-xs font-black uppercase tracking-wide text-[#182322] shadow-lg sm:bottom-7 sm:left-7">{event.otherCategory || event.category}</span>
                        )}
                    </div>
                ) : (
                    <div className="flex min-h-[55vh] items-center justify-center text-sm font-bold text-white/50">No event image available</div>
                )}
            </section>

            {/* Event details */}
            <section className="w-full bg-[#FFFBEA]">
                <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
                    {/* Event title */}
                    <div>
                        <h1 className="max-w-4xl text-3xl font-black leading-tight text-[#182322] sm:text-4xl lg:text-5xl">{event.title || event.eventName || "Untitled Event"}</h1>

                        {event.organizedBy && (
                            <p className="mt-4 text-sm font-semibold text-[#182322]/55">
                                Organized by <span className="font-black text-[#44807F]">{event.organizedBy}</span>
                            </p>
                        )}
                    </div>

                    {/* Event information */}
                    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {formattedStartDate && (
                            <div className="flex items-start gap-4 rounded-2xl border border-[#182322]/8 bg-white p-4 shadow-sm">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10">
                                    <CalendarDays size={20} className="text-[#44807F]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#182322]/40">{hasDifferentEndDate ? "Event Dates" : "Event Date"}</p>
                                    <p className="mt-1 text-sm font-black text-[#182322] sm:text-base">{formattedStartDate}{hasDifferentEndDate && ` – ${formattedEndDate}`}</p>
                                </div>
                            </div>
                        )}

                        {eventTime && (
                            <div className="flex items-start gap-4 rounded-2xl border border-[#182322]/8 bg-white p-4 shadow-sm">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10">
                                    <Clock3 size={20} className="text-[#44807F]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#182322]/40">Time</p>
                                    <p className="mt-1 text-sm font-black text-[#182322] sm:text-base">{eventTime}</p>
                                </div>
                            </div>
                        )}

                        {(event.venue || event.location) && (
                            <div className="flex items-start gap-4 rounded-2xl border border-[#182322]/8 bg-white p-4 shadow-sm sm:col-span-2">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10">
                                    <MapPin size={20} className="text-[#44807F]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#182322]/40">Location</p>
                                    <p className="mt-1 break-words text-sm font-black text-[#182322] sm:text-base">{event.venue || event.location}</p>
                                </div>
                            </div>
                        )}

                        {event.price && (
                            <div className="flex items-start gap-4 rounded-2xl border border-[#182322]/8 bg-white p-4 shadow-sm">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10">
                                    <Tag size={20} className="text-[#44807F]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#182322]/40">Price</p>
                                    <p className="mt-1 text-sm font-black text-[#182322] sm:text-base">Starts from ₹{String(event.price).replace(/^₹\s*/, "")}</p>
                                </div>
                            </div>
                        )}

                        {(event.capacity || event.totalSeats) && (
                            <div className="flex items-start gap-4 rounded-2xl border border-[#182322]/8 bg-white p-4 shadow-sm">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#44807F]/10">
                                    <Users size={20} className="text-[#44807F]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#182322]/40">Capacity</p>
                                    <p className="mt-1 text-sm font-black text-[#182322] sm:text-base">{event.capacity || event.totalSeats}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {description && (
                        <div className="mt-10 border-t border-[#182322]/10 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#44807F]/10">
                                    <Tag size={19} className="text-[#44807F]" />
                                </div>
                                <h2 className="text-xl font-black text-[#182322]">About this event</h2>
                            </div>

                            <div className="mt-5 max-w-4xl">
                                <p className="whitespace-pre-line break-words text-sm leading-7 text-[#182322]/65 sm:text-base sm:leading-8">{description}</p>
                            </div>
                        </div>
                    )}

                    {/* Booking */}
                    <div className="mt-10 border-t border-[#182322]/10 pt-8">
                        {bookingUrl ? (
                            <button type="button" onClick={handleBookTicket} className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEDF24] px-6 py-4 text-base font-black text-[#182322] shadow-lg transition duration-200 hover:bg-[#44807F] hover:text-white sm:w-auto sm:min-w-[260px]">
                                Book Ticket
                                <ExternalLink size={18} />
                            </button>
                        ) : (
                            <button type="button" disabled className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-[#182322]/10 px-6 py-4 text-base font-bold text-[#182322]/40 sm:w-auto sm:min-w-[260px]">Booking Unavailable</button>
                        )}

                        {bookingUrl && <p className="mt-3 text-xs font-medium text-[#182322]/40">You will be redirected to the official ticket booking page.</p>}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {wishlistToast && (
                    <motion.div initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="pointer-events-none fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 sm:bottom-7" role="status" aria-live="polite">
                        <div className="flex items-center gap-3 rounded-2xl border border-[#FF2D55]/20 bg-[#182322] px-4 py-3.5 text-white shadow-[0_18px_50px_rgba(24,35,34,0.28)]">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF2D55]">
                                <Heart size={20} fill="currentColor" strokeWidth={2.5} />
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-extrabold leading-tight text-white">Added to wishlist ❤️</p>
                                <p className="mt-0.5 truncate text-xs font-medium text-white/65">{event?.title || "Event"}</p>
                            </div>

                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FEDF24] text-[#182322]">
                                <span className="text-sm font-black">✓</span>
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
};

export default EventDetailsPage;