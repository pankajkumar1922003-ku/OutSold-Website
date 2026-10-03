import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    ChevronLeft,
    ChevronRight,
    Heart,
    Laugh,
    LayoutGrid,
    Music,
    Search,
    SlidersHorizontal,
    Sparkles,
    Ticket,
    Trophy,
    Wrench,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutsoldEvents } from "../hooks/useOutsoldEvents";
import { db } from "../lib/firebase";
import EventDetailsModal from "../Components/EventDetailsModal";
import {
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    setDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "outsold_user_profile";
const SLIDE_INTERVAL = 4000;
const MAX_SLIDES = 5;

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85";

const FONT_IMPORT =
    "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap');";

const FONT_STYLE = {
    fontFamily:
        "'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

const categories = [
    { name: "All", icon: LayoutGrid, text: "text-slate-700" },
    { name: "Music", icon: Music, text: "text-pink-600" },
    { name: "Comedy", icon: Laugh, text: "text-amber-600" },
    { name: "Business", icon: BriefcaseBusiness, text: "text-blue-600" },
    { name: "Workshop", icon: Wrench, text: "text-emerald-600" },
    { name: "Sports", icon: Trophy, text: "text-cyan-600" },
];

const dates = [
    "All Dates",
    "Today",
    "Tomorrow",
    "This Weekend",
    "This Month",
    "Custom Date",
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const toDate = (value) => {
    if (!value) return null;

    const date = value?.toDate
        ? value.toDate()
        : value instanceof Date
            ? value
            : new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
};

const toDateOnly = (value) => {
    const date = toDate(value);
    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const formatEventDate = (value) => {
    if (!value) return "";

    const date = toDate(value);
    if (!date) return String(value);

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getEventStartDate = (event) =>
    event?.startDate ||
    event?.start_date ||
    event?.eventStartDate ||
    event?.date ||
    "";

const getEventEndDate = (event) =>
    event?.endDate ||
    event?.end_date ||
    event?.eventEndDate ||
    event?.startDate ||
    event?.start_date ||
    event?.date ||
    "";

const isEventExpired = (event) => {
    const endDate = toDateOnly(getEventEndDate(event));

    if (!endDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return endDate < today;
};

const getDateParts = (event) => {
    const start = toDate(getEventStartDate(event));
    if (!start) return null;

    const end = toDate(getEventEndDate(event));

    const sameDay =
        !end || start.toDateString() === end.toDateString();

    return {
        day: start.toLocaleDateString("en-IN", {
            day: "2-digit",
        }),
        month: start.toLocaleDateString("en-IN", {
            month: "short",
        }),
        weekday: start.toLocaleDateString("en-IN", {
            weekday: "short",
        }),
        until: sameDay
            ? ""
            : end.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
            }),
    };
};

const getCategoryStyle = (categoryName) =>
    categories.find(
        (category) =>
            category.name.toLowerCase() ===
            String(categoryName || "").toLowerCase()
    ) || categories[0];

const getImage = (event) => event?.image || FALLBACK_IMAGE;

const handleImageError = (e) => {
    if (e.currentTarget.src !== FALLBACK_IMAGE) {
        e.currentTarget.src = FALLBACK_IMAGE;
    }
};

const hideScrollbar =
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const BlurBackdrop = ({ src }) => (
    <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        onError={handleImageError}
        className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-2xl"
    />
);

/* -------------------------------------------------------------------------- */
/*  Ticket pieces                                                             */
/* -------------------------------------------------------------------------- */

const Notch = ({ tone = "plain", className = "" }) => {
    const tones = {
        plain: "bg-[#fff7cf]",
        bordered: "bg-[#fff7cf] border border-[#44807F]/15",
        dark: "bg-[#182322]",
        page: "bg-[#fff7cf]",
    };

    return (
        <span
            aria-hidden="true"
            className={`absolute h-5 w-5 rounded-full ${tones[tone]} ${className}`}
        />
    );
};

const DateBlock = ({ event, className = "" }) => {
    const start = toDate(getEventStartDate(event));
    const end = toDate(getEventEndDate(event));

    if (!start) {
        return (
            <div
                className={`min-w-[1rem] text-center leading-none ${className}`}
            >
                <p className="text-sm font-bold text-[#182322]/60">
                    Date TBA
                </p>
            </div>
        );
    }

    const startDay = start.toLocaleDateString("en-IN", {
        day: "2-digit",
    });

    const startMonth = start.toLocaleDateString("en-IN", {
        month: "short",
    });

    const isSameDay =
        !end || start.toDateString() === end.toDateString();

    const endDay = end?.toLocaleDateString("en-IN", {
        day: "2-digit",
    });

    const endMonth = end?.toLocaleDateString("en-IN", {
        month: "short",
    });

    return (
        <div
            className={`shrink-0 border-r border-[#182322]/10 pr-2.5 text-center leading-none sm:pr-4 ${className}`}
        >
            <div className="flex items-center gap-1">
                {/* START DATE */}
                <div className="min-w-[20px]">
                    <p className="text-sm font-extrabold tabular-nums text-[#44807F] sm:text-3xl">
                        {startDay}
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#182322]/70 sm:text-sm">
                        {startMonth}
                    </p>
                </div>

                {/* ARROW */}
                {!isSameDay && (
                    <span className="text-base font-extrabold text-[#182322] sm:text-lg">
                        →
                    </span>
                )}

                {/* END DATE */}
                {!isSameDay && (
                    <div className="min-w-[20px]">
                        <p className="text-sm font-extrabold tabular-nums text-[#44807F] sm:text-3xl">
                            {endDay}
                        </p>

                        <p className="mt-0.5 text-xs font-semibold text-[#182322]/70 sm:text-sm">
                            {endMonth}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const SectionHeader = ({ title, note, action, tone = "light" }) => {
    const dark = tone === "dark";

    return (
        <div className="mb-6 flex items-end justify-between gap-4">
            <div className="min-w-0">
                <h3
                    className={`text-xl font-extrabold tracking-[-0.025em] sm:text-3xl ${dark ? "text-[#fffdf5]" : "text-[#182322]"}`}
                >
                    {title}
                </h3>

                {note && (
                    <p
                        className={`mt-1 text-sm ${dark ? "text-[#fffdf5]/60" : "text-[#182322]/55"}`}
                    >
                        {note}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*  Event Ticket                                                              */
/* -------------------------------------------------------------------------- */

const EventTicket = ({
    event,
    onOpen,
    interested = false,
    onToggle,
}) => {
    const style = getCategoryStyle(event.category);
    const CategoryIcon = style.icon;

    return (
        <article
            id="eventsHome"
            role="link"
            tabIndex={0}
            onClick={() => onOpen(event)}
            onKeyDown={(e) => e.key === "Enter" && onOpen(event)}
            aria-label={`View ${event.title || "event"}`}
            className="group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-md bg-white outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(24,35,34,0.10)] focus-visible:ring-4 focus-visible:ring-[#FEDF24]"
        >
            {/* IMAGE */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#e9ece7]">
                {/* Blurred backdrop (side gaps for portrait images) */}
                <BlurBackdrop src={getImage(event)} />

                {/* Full image, no crop */}
                <img
                    src={getImage(event)}
                    alt={event.title || "Event"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-contain transition duration-700 group-hover:scale-105"
                    onError={handleImageError}
                />

                {/* CATEGORY */}
                <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-[#182322] shadow-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs">
                    <CategoryIcon size={11} className={style.text} />

                    {event.category || "Event"}
                </span>
            </div>

            {/* CARD CONTENT */}
            <div className="relative flex flex-col border-t-2 border-dashed border-[#182322]/15 p-2.5 sm:p-4">
                <Notch tone="plain" className="-left-2.5 -top-2.5" />

                <Notch tone="plain" className="-right-2.5 -top-2.5" />

                {/* DATE + TITLE */}
                <div className="flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:items-start sm:gap-4">
                    {/* DATE — MOBILE CENTER */}
                    <div className="w-full text-center sm:w-auto sm:text-left">
                        <DateBlock
                            event={event}
                            className="mx-auto w-fit border-r-0 pr-0 sm:mx-0 sm:border-r sm:pr-4"
                        />
                    </div>

                    {/* EVENT NAME */}
                    <div className="w-full min-w-0 text-center sm:flex-1 sm:text-left">
                        <h4 className="mx-auto line-clamp-2 max-w-full wrap-break-word text-md font-bold leading-[1.3] tracking-normal text-[#182322] sm:mx-0 sm:text-lg sm:leading-snug">
                            {event.title || "Untitled Event"}
                        </h4>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-3 flex w-full items-center gap-2 sm:mt-4 sm:gap-2.5">
                    {/* EXPLORE BUTTON */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen(event);
                        }}
                        className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#182322] px-2 py-2 text-[11px] font-bold text-[#FEDF24] transition duration-200 hover:bg-[#44807F] hover:text-white sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-sm"
                    >
                        <span>Details</span>

                        <ArrowUpRight size={13} className="shrink-0" />
                    </button>

                    {/* HEART BUTTON */}
                    <motion.button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle?.(event.id);
                        }}
                        whileTap={{ scale: 0.88 }}
                        aria-label={
                            interested
                                ? "Remove from interested"
                                : "Add to interested"
                        }
                        aria-pressed={interested}
                        className={`flex h-[34px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition duration-200 sm:h-[42px] sm:w-[46px] ${interested ? "border-[#FF2D55] bg-[#FF2D55] text-white shadow-[0_5px_14px_rgba(255,45,85,0.28)]" : "border-[#FF2D55]/35 bg-[#FFF0F3] text-[#FF2D55] hover:border-[#FF2D55] hover:bg-[#FFE1E8]"}`}
                    >
                        <Heart
                            size={16}
                            fill={interested ? "currentColor" : "none"}
                            strokeWidth={2.5}
                        />
                    </motion.button>
                </div>
            </div>
        </article>
    );
};

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

const EventsHome = () => {
    const navigate = useNavigate();
    const reduceMotion = useReducedMotion();
    const [userName, setUserName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDate, setSelectedDate] = useState("All Dates");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [interestedEvents, setInterestedEvents] = useState([]);
    const [wishlistToast, setWishlistToast] = useState(null);
    const { user } = useAuth();
    const { events: fetchedEvents = [] } = useOutsoldEvents();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    const openEvent = (event) => {
        if (!event) return;

        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const closeEventModal = () => {
        setIsEventModalOpen(false);
        setSelectedEvent(null);
    };

    const events = useMemo(
        () =>
            Array.isArray(fetchedEvents)
                ? fetchedEvents.filter(
                    (event) => event && typeof event === "object"
                )
                : [],
        [fetchedEvents]
    );

    useEffect(() => {
        if (!user?.uid) {
            setInterestedEvents([]);
            return;
        }

        const wishlistRef = collection(
            db,
            "outsold_users",
            user.uid,
            "wishlist"
        );

        const unsubscribe = onSnapshot(
            wishlistRef,
            (snapshot) => {
                setInterestedEvents(
                    snapshot.docs.map((wishlistDoc) => wishlistDoc.id)
                );
            },
            (error) => {
                console.error("Wishlist listener error:", error);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    /* ---------------------------- user name --------------------------- */

    useEffect(() => {
        const readUserProfile = () => {
            try {
                const savedProfile = localStorage.getItem(STORAGE_KEY);

                if (!savedProfile) {
                    setUserName("");
                    return;
                }

                const profile = JSON.parse(savedProfile);

                setUserName(profile?.name?.trim() || "");
            } catch (error) {
                console.error("User profile read error:", error);
                setUserName("");
            }
        };

        readUserProfile();

        window.addEventListener("locationChanged", readUserProfile);
        window.addEventListener("userProfileChanged", readUserProfile);

        return () => {
            window.removeEventListener("locationChanged", readUserProfile);
            window.removeEventListener("userProfileChanged", readUserProfile);
        };
    }, []);

    /* ------------------------------- filtering ------------------------------- */

    const filteredEvents = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const now = new Date();

        const todayOnly = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const tomorrow = new Date(todayOnly);

        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayOfWeek = todayOnly.getDay();

        const weekendStart = new Date(todayOnly);

        weekendStart.setDate(
            weekendStart.getDate() + (dayOfWeek === 0 ? 0 : 6 - dayOfWeek)
        );

        const weekendEnd = new Date(weekendStart);

        if (dayOfWeek !== 0) {
            weekendEnd.setDate(weekendEnd.getDate() + 1);
        }

        const monthStart = new Date(
            todayOnly.getFullYear(),
            todayOnly.getMonth(),
            1
        );

        const monthEnd = new Date(
            todayOnly.getFullYear(),
            todayOnly.getMonth() + 1,
            0
        );

        const overlaps = (start, end, rangeStart, rangeEnd) =>
            !!start &&
            !!end &&
            start <= rangeEnd &&
            end >= rangeStart;

        return events.filter((event) => {
            if (isEventExpired(event)) return false;

            const title = String(event.title || "").toLowerCase();
            const category = String(event.category || "").toLowerCase();

            const matchesSearch =
                !query ||
                title.includes(query) ||
                category.includes(query);

            const matchesCategory =
                selectedCategory === "All" ||
                category === selectedCategory.toLowerCase();

            const startDate = toDateOnly(getEventStartDate(event));

            const endDate = toDateOnly(
                getEventEndDate(event) || startDate
            );

            let matchesDate = true;

            if (selectedDate === "Today")
                matchesDate = overlaps(
                    startDate,
                    endDate,
                    todayOnly,
                    todayOnly
                );

            if (selectedDate === "Tomorrow")
                matchesDate = overlaps(
                    startDate,
                    endDate,
                    tomorrow,
                    tomorrow
                );

            if (selectedDate === "This Weekend")
                matchesDate = overlaps(
                    startDate,
                    endDate,
                    weekendStart,
                    weekendEnd
                );

            if (selectedDate === "This Month")
                matchesDate = overlaps(
                    startDate,
                    endDate,
                    monthStart,
                    monthEnd
                );

            // Custom date range: From → To (only one date = single day)
            if (
                selectedDate === "Custom Date" &&
                (customFrom || customTo)
            ) {
                const from = new Date(
                    `${customFrom || customTo}T00:00:00`
                );
                const to = new Date(
                    `${customTo || customFrom}T00:00:00`
                );

                const rangeStart = from <= to ? from : to;
                const rangeEnd = from <= to ? to : from;

                matchesDate = overlaps(
                    startDate,
                    endDate,
                    rangeStart,
                    rangeEnd
                );
            }

            return matchesSearch && matchesCategory && matchesDate;
        });
    }, [
        events,
        selectedCategory,
        selectedDate,
        searchTerm,
        customFrom,
        customTo,
    ]);

    const isSearching = searchTerm.trim().length > 0;

    const hasActiveFilters =
        selectedCategory !== "All" ||
        selectedDate !== "All Dates" ||
        searchTerm.length > 0;

    /* --------------------- slides / grid / interested ------------------- */

    const { slides, gridEvents } = useMemo(() => {
        const slides = events
            .filter(
                (event) =>
                    event?.displaySection === "featured" &&
                    !isEventExpired(event)
            )
            .slice(0, MAX_SLIDES);
        const source = (hasActiveFilters ? filteredEvents : events)
            .filter((event) => !isEventExpired(event));


        const gridEvents = source
            .filter(
                (event) =>
                    event?.displaySection === "events_youll_love" ||
                    event?.displaySection === "all"
            )
            .sort((a, b) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const getEventPriorityDate = (event) => {
                    const start = toDateOnly(getEventStartDate(event));
                    const end =
                        toDateOnly(getEventEndDate(event)) || start;

                    if (!start) return null;

                    // Event abhi ongoing hai: aaj start aur end ke beech hai
                    if (start <= today && end >= today) {
                        return today.getTime();
                    }

                    // Upcoming event: start date ko priority do
                    if (start > today) {
                        return start.getTime();
                    }

                    // Past event: end date ke hisaab se nearest past event
                    return end.getTime();
                };

                const priorityA = getEventPriorityDate(a);
                const priorityB = getEventPriorityDate(b);

                // Invalid/missing dates wale events end mein
                if (priorityA === null && priorityB === null) return 0;
                if (priorityA === null) return 1;
                if (priorityB === null) return -1;

                // Ongoing → upcoming → past
                const getGroup = (event) => {
                    const start = toDateOnly(getEventStartDate(event));
                    const end =
                        toDateOnly(getEventEndDate(event)) || start;

                    if (!start) return 3;
                    if (start <= today && end >= today) return 0;
                    if (start > today) return 1;
                    return 2;
                };

                const groupA = getGroup(a);
                const groupB = getGroup(b);

                if (groupA !== groupB) return groupA - groupB;
                if (groupA === 0) {
                    const endA = toDateOnly(getEventEndDate(a)) || priorityA;
                    const endB = toDateOnly(getEventEndDate(b)) || priorityB;

                    return endA.getTime() - endB.getTime();
                }

                // Upcoming events: nearest start date first
                if (groupA === 1) {
                    return priorityA - priorityB;
                }

                // Past events: sabse recent end date first
                return priorityB - priorityA;
            })
            .slice(0, 9);

        const interestEvents = source
            .filter((event) => event?.displaySection === "recommended")
            .slice(0, 4);

        return {
            slides,
            gridEvents,
            interestEvents,
        };
    }, [events, filteredEvents, hasActiveFilters]);

    /* -------------------------------- slideshow ------------------------------- */

    useEffect(() => {
        setSlideIndex(0);
    }, [selectedCategory, selectedDate, searchTerm]);

    const activeIndex = slides.length ? slideIndex % slides.length : 0;

    const currentSlide = slides[activeIndex];

    const currentParts = currentSlide ? getDateParts(currentSlide) : null;

    const autoplay = slides.length > 1 && !paused && !reduceMotion;

    useEffect(() => {
        if (!autoplay) return;

        const timer = setTimeout(() => {
            setSlideIndex((activeIndex + 1) % slides.length);
        }, SLIDE_INTERVAL);

        return () => clearTimeout(timer);
    }, [autoplay, activeIndex, slides.length]);

    const goToSlide = (index) =>
        setSlideIndex((index + slides.length) % slides.length);

    /* --------------------------------- actions -------------------------------- */

    const showWishlistToast = (event, action = "added") => {
        if (action !== "added") return;

        setWishlistToast({
            title: event?.title || "Event",
        });

        window.clearTimeout(window.__outsoldWishlistToastTimer);
        window.__outsoldWishlistToastTimer = window.setTimeout(() => {
            setWishlistToast(null);
        }, 2600);
    };

    const toggleInterested = async (eventId) => {
        if (!user?.uid) {
            window.dispatchEvent(new Event("openLoginModal"));
            return;
        }

        const event = events.find((item) => item.id === eventId);

        if (!event) return;

        const wishlistRef = doc(
            db,
            "outsold_users",
            user.uid,
            "wishlist",
            eventId
        );

        const alreadyInterested = interestedEvents.includes(eventId);

        try {
            if (alreadyInterested) {
                await deleteDoc(wishlistRef);
            } else {
                await setDoc(wishlistRef, {
                    id: event.id,
                    title: event.title || "",
                    image: event.image || "",
                    category: event.category || "",
                    date: event.date || "",
                    endDate: event.endDate || "",
                    time: event.time || "",
                    location: event.location || "",
                    venue: event.venue || "",
                    price: event.price || "",
                    slug: event.slug || null,
                    subdomain: event.subdomain || null,
                    companyId: event.companyId || null,
                    createdAt: new Date(),
                });

                showWishlistToast(event, "added");
            }
        } catch (error) {
            console.error("Wishlist update error:", error);
        }
    };

    const clearFilters = () => {
        setSelectedCategory("All");
        setSelectedDate("All Dates");
        setCustomFrom("");
        setCustomTo("");
        setSearchTerm("");
    };

    /* ---------------------------------- render -------------------------------- */

    return (
        <section
            id="home"
            style={FONT_STYLE}
            className="relative overflow-hidden bg-[#fff7cf] pt-28 text-[#182322] sm:pt-28"
        >
            <style>{FONT_IMPORT}</style>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fff7cf] to-transparent" />

            {/* MAIN CONTENT PARENT */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* HERO HEADING */}
                <h1 className="mb-4 mx-auto flex max-w-full items-center justify-center gap-3 whitespace-nowrap text-center text-[30px] font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                    <span className="min-w-0 truncate">
                        Hey! {userName || "Explorer"}
                    </span>

                    <motion.span
                        className="inline-block shrink-0"
                        style={{
                            originX: 0.7,
                            originY: 0.7,
                        }}
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                    rotate: [0, 14, -8, 14, -4, 10, 0],
                                }
                        }
                        transition={{
                            duration: 1.4,
                            delay: 0.6,
                            ease: "easeInOut",
                        }}
                    >
                        👋
                    </motion.span>
                </h1>

                {/* SEARCH */}
                <div className="mx-auto mt-7 max-w-3xl sm:mt-9 hidden md:block mb-7">
                    <div className="flex items-center gap-2 rounded-full border-2 border-[#182322] bg-white py-1.5 pl-5 pr-1.5 shadow-[5px_5px_0_#FEDF24]">
                        <Search
                            size={20}
                            className="shrink-0 text-[#44807F]"
                        />

                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search events or categories"
                            aria-label="Search events"
                            className="min-w-0 flex-1 bg-transparent py-2 text-base font-medium text-[#182322] outline-none placeholder:text-[#182322]/40"
                        />

                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="rounded-full p-2 text-[#182322]/50 transition hover:bg-[#182322]/5 hover:text-[#182322]"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}

                        <button
                            onClick={() => setShowFilters((value) => !value)}
                            aria-expanded={showFilters}
                            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${showFilters || selectedCategory !== "All" ? "bg-[#44807F] text-white" : "bg-[#182322] text-white hover:bg-[#44807F]"}`}
                        >
                            <SlidersHorizontal size={15} />

                            {selectedCategory === "All"
                                ? "Category"
                                : selectedCategory}
                        </button>
                    </div>

                    {/* CATEGORY PANEL */}
                    <AnimatePresence initial={false}>
                        {showFilters && (
                            <motion.div
                                initial={{
                                    height: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    height: "auto",
                                    opacity: 1,
                                }}
                                exit={{
                                    height: 0,
                                    opacity: 0,
                                }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap justify-center gap-2 pt-4">
                                    {categories.map((category) => {
                                        const Icon = category.icon;

                                        const selected =
                                            selectedCategory === category.name;

                                        return (
                                            <button
                                                key={category.name}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category.name
                                                    )
                                                }
                                                aria-pressed={selected}
                                                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selected ? "border-[#182322] bg-[#182322] text-white" : "border-[#182322]/15 bg-white text-[#182322]/75 hover:border-[#182322]/40"}`}
                                            >
                                                <Icon
                                                    size={15}
                                                    className={
                                                        selected
                                                            ? "text-[#FEDF24]"
                                                            : category.text
                                                    }
                                                />

                                                {category.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DATE TABS */}
                    <div
                        className={`mt-5 flex items-center gap-1.5 overflow-x-auto sm:justify-center ${hideScrollbar}`}
                    >
                        {dates.map((date) => {
                            const selected = selectedDate === date;

                            return (
                                <button
                                    key={date}
                                    type="button"
                                    onClick={() => setSelectedDate(date)}
                                    aria-pressed={selected}
                                    className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${selected
                                        ? "bg-[#182322] text-white"
                                        : "text-[#182322]/60 hover:bg-[#182322]/5 hover:text-[#182322]"
                                        }`}
                                >
                                    {date}
                                </button>
                            );
                        })}

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-[#44807F] transition hover:bg-[#44807F]/10"
                            >
                                <X size={14} />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* CUSTOM DATE RANGE (FROM / TO) */}
                    <AnimatePresence initial={false}>
                        {selectedDate === "Custom Date" && (
                            <motion.div
                                initial={{
                                    height: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    height: "auto",
                                    opacity: 1,
                                }}
                                exit={{
                                    height: 0,
                                    opacity: 0,
                                }}
                                className="overflow-hidden"
                            >
                                <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                                    <label className="flex items-center gap-2 rounded-full border-2 border-[#182322]/15 bg-white px-4 py-1.5 text-sm font-semibold">
                                        <span className="text-[#182322]/60">
                                            From
                                        </span>

                                        <input
                                            type="date"
                                            value={customFrom}
                                            max={customTo || undefined}
                                            onChange={(e) => {
                                                const value = e.target.value;

                                                setCustomFrom(value);

                                                if (
                                                    customTo &&
                                                    value > customTo
                                                ) {
                                                    setCustomTo("");
                                                }
                                            }}
                                            className="bg-transparent text-sm font-semibold text-[#182322] outline-none"
                                        />
                                    </label>

                                    <label className="flex items-center gap-2 rounded-full border-2 border-[#182322]/15 bg-white px-4 py-1.5 text-sm font-semibold">
                                        <span className="text-[#182322]/60">
                                            To
                                        </span>

                                        <input
                                            type="date"
                                            value={customTo}
                                            min={customFrom || undefined}
                                            onChange={(e) =>
                                                setCustomTo(e.target.value)
                                            }
                                            className="bg-transparent text-sm font-semibold text-[#182322] outline-none"
                                        />
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* EVENTS AREA */}
                <div id="events" className="scroll-mt-24">

                    {/* FEATURED SLIDESHOW */}
                    {currentSlide && (
                        <div
                            className=""
                            onPointerEnter={(e) =>
                                e.pointerType === "mouse" && setPaused(true)
                            }
                            onPointerLeave={(e) =>
                                e.pointerType === "mouse" && setPaused(false)
                            }
                        >
                            {/* MOBILE: SAME FEATURED CARD DESIGN + HORIZONTAL SWIPE */}
                            <div
                                data-featured-mobile-slider
                                className={`sm:hidden overflow-x-auto snap-x snap-mandatory ${hideScrollbar}`}
                                onTouchStart={() => setPaused(true)}
                                onTouchEnd={() => setPaused(false)}
                                onTouchCancel={() => setPaused(false)}
                                onScroll={(e) => {
                                    const container = e.currentTarget;
                                    const card = container.querySelector(
                                        "[data-featured-card]"
                                    );
                                    if (!card || !slides.length) return;

                                    const cardWidth =
                                        card.getBoundingClientRect().width;
                                    const gap = 16;
                                    const nextIndex = Math.round(
                                        container.scrollLeft /
                                        (cardWidth + gap)
                                    );

                                    if (nextIndex !== activeIndex) {
                                        setSlideIndex(
                                            Math.max(
                                                0,
                                                Math.min(
                                                    nextIndex,
                                                    slides.length - 1
                                                )
                                            )
                                        );
                                    }
                                }}
                            >
                                <div className="flex gap-4">
                                    {slides.map((slide, index) => {
                                        const parts = getDateParts(slide);

                                        return (
                                            <div
                                                key={`mobile-featured-${slide.id ?? index}`}
                                                data-featured-card
                                                className="relative min-w-full snap-center"
                                            >
                                                <div className="relative grid min-h-[170px] grid-cols-[55%_45%] overflow-hidden rounded-md bg-[#182322] shadow-[0_24px_60px_rgba(24,35,34,0.14)]">
                                                    {/* IMAGE */}
                                                    <div
                                                        onClick={() => openEvent(slide)}
                                                        className="relative h-full min-h-[170px] cursor-pointer overflow-hidden"
                                                    >
                                                        {/* Blurred backdrop (side gaps) */}
                                                        <BlurBackdrop src={getImage(slide)} />

                                                        {/* Full image, no crop */}
                                                        <motion.img
                                                            src={getImage(slide)}
                                                            alt={slide.title || "Featured event"}
                                                            className="absolute inset-0 h-full w-full object-contain"
                                                            onError={handleImageError}
                                                        />

                                                        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#182322]/85 px-2.5 py-1 text-[10px] font-bold text-[#FEDF24]">
                                                            <Sparkles size={12} />
                                                            Featured
                                                        </span>
                                                    </div>

                                                    {/* STUB SIDE */}
                                                    <div className="relative flex min-w-0 flex-col bg-[#FEDF24] p-3.5 pt-5 text-[#182322]">
                                                        <span
                                                            aria-hidden="true"
                                                            className="absolute left-0 top-0 bottom-0 border-l-2 border-dashed border-[#182322]/30"
                                                        />

                                                        <Notch
                                                            tone="page"
                                                            className="-left-2.5 -top-2.5"
                                                        />

                                                        <Notch
                                                            tone="page"
                                                            className="left-[-10px] right-auto top-auto -bottom-2.5"
                                                        />

                                                        {slides.length > 1 && (
                                                            <span className="absolute right-3 top-5 z-10 min-w-[2rem] text-center text-[10px] font-bold tabular-nums">
                                                                {index + 1}/{slides.length}
                                                            </span>
                                                        )}

                                                        <span className="inline-flex w-fit items-center rounded-full border-2 border-[#182322] px-2.5 py-0.5 text-[10px] font-bold">
                                                            {slide.category || "Event"}
                                                        </span>

                                                        {/* DATE */}
                                                        <div className="mt-4 flex items-end gap-2">
                                                            {parts ? (
                                                                <>
                                                                    <p className="text-3xl font-extrabold leading-[0.85] tracking-[-0.05em] tabular-nums">
                                                                        {parts.day}
                                                                    </p>

                                                                    <div className="pb-1 leading-tight">
                                                                        <p className="text-sm font-bold">
                                                                            {parts.month}
                                                                        </p>

                                                                        <p className="text-[9px] font-medium text-[#182322]/70">
                                                                            {parts.weekday}
                                                                            {parts.until && `, till ${parts.until}`}
                                                                        </p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <p className="text-4xl font-extrabold leading-[0.9]">
                                                                    TBA
                                                                </p>
                                                            )}
                                                        </div>

                                                        <h2 className="mt-3 line-clamp-3 text-base font-extrabold leading-[1.1] tracking-[-0.02em]">
                                                            {slide.title || "An unforgettable experience"}
                                                        </h2>

                                                        <div className="mt-auto flex flex-col gap-2 pt-4">
                                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openEvent(slide);
                                                                    }}
                                                                    className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#182322] px-3 py-2 text-[11px] font-bold text-[#FEDF24]"
                                                                >
                                                                    <span>Details</span>
                                                                    <ArrowUpRight size={13} />
                                                                </button>

                                                                <motion.button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleInterested(slide.id);
                                                                    }}
                                                                    whileTap={{ scale: 0.88 }}
                                                                    aria-label={
                                                                        interestedEvents.includes(slide.id)
                                                                            ? "Remove from interested"
                                                                            : "Add to interested"
                                                                    }
                                                                    className={`flex h-[34px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition duration-200 ${interestedEvents.includes(slide.id)
                                                                        ? "border-[#FF2D55] bg-[#FF2D55] text-white shadow-[0_5px_14px_rgba(255,45,85,0.28)]"
                                                                        : "border-[#FF2D55]/35 bg-[#FFF0F3] text-[#FF2D55] hover:border-[#FF2D55] hover:bg-[#FFE1E8]"
                                                                        }`}
                                                                >
                                                                    <Heart
                                                                        size={16}
                                                                        fill={
                                                                            interestedEvents.includes(slide.id)
                                                                                ? "currentColor"
                                                                                : "none"
                                                                        }
                                                                        strokeWidth={2.5}
                                                                    />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* MOBILE SLIDER DOTS */}
                            {slides.length > 1 && (
                                <div className="mt-3 flex items-center justify-center gap-1.5 sm:hidden">
                                    {slides.map((slide, index) => (
                                        <button
                                            key={`featured-dot-${slide.id ?? index}`}
                                            type="button"
                                            aria-label={`Go to featured event ${index + 1}`}
                                            onClick={() => {
                                                const container = document.querySelector(
                                                    "[data-featured-mobile-slider]"
                                                );
                                                const card = container?.querySelector(
                                                    "[data-featured-card]"
                                                );

                                                if (container && card) {
                                                    container.scrollTo({
                                                        left:
                                                            index *
                                                            (card.getBoundingClientRect().width + 16),
                                                        behavior: "smooth",
                                                    });
                                                }

                                                setSlideIndex(index);
                                            }}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex
                                                ? "w-6 bg-[#182322]"
                                                : "w-1.5 bg-[#182322]/25"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* DESKTOP FEATURED SLIDER */}
                            <div className="relative hidden sm:block">
                                {/* FEATURED SLIDER CONTROLS */}
                                {slides.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => goToSlide(activeIndex - 1)}
                                            aria-label="Previous event"
                                            className="absolute left-3 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white shadow-md transition duration-200 hover:bg-black sm:left-4 sm:flex sm:h-10 sm:w-10"
                                        >
                                            <ChevronLeft size={19} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => goToSlide(activeIndex + 1)}
                                            aria-label="Next event"
                                            className="absolute right-3 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 text-white shadow-md transition duration-200 hover:bg-black sm:right-4 sm:flex sm:h-10 sm:w-10"
                                        >
                                            <ChevronRight size={19} />
                                        </button>
                                    </>
                                )}

                                <div className="relative grid min-h-[170px] grid-cols-[55%_45%] overflow-hidden rounded-md bg-[#182322] shadow-[0_24px_60px_rgba(24,35,34,0.14)] sm:min-h-[420px] lg:min-h-[500px] lg:grid-cols-[minmax(0,1fr)_400px]">

                                    {/* IMAGE */}
                                    <div
                                        onClick={() => openEvent(currentSlide)}
                                        className="relative h-full min-h-[170px] cursor-pointer overflow-hidden sm:min-h-[420px] lg:h-auto"
                                    >
                                        {/* Blurred backdrop (side gaps) */}
                                        <BlurBackdrop src={getImage(currentSlide)} />

                                        <AnimatePresence initial={false}>
                                            <motion.img
                                                key={currentSlide.id ?? activeIndex}
                                                src={getImage(currentSlide)}
                                                alt={currentSlide.title || "Featured event"}
                                                initial={{
                                                    opacity: 0,
                                                    x: reduceMotion ? 0 : 55,
                                                    scale: reduceMotion ? 1 : 1.02,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    x: reduceMotion ? 0 : -55,
                                                }}
                                                transition={{
                                                    duration: reduceMotion ? 0 : 0.55,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="absolute inset-0 h-full w-full object-contain"
                                                onError={handleImageError}
                                            />
                                        </AnimatePresence>

                                        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#182322]/85 px-2.5 py-1 text-xs font-bold text-[#FEDF24] backdrop-blur-md sm:left-6 sm:top-6 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm">
                                            <Sparkles size={13} />
                                            Featured
                                        </span>
                                    </div>

                                    {/* STUB SIDE */}
                                    <div className="relative flex min-w-0 flex-col bg-[#FEDF24] p-3.5 pt-5 text-[#182322] sm:p-6 sm:pt-8 lg:p-8 lg:pt-8">
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-0 top-0 bottom-0 border-l-2 border-dashed border-[#182322]/30 lg:inset-y-4 lg:left-0 lg:right-auto lg:top-4 lg:border-l-2 lg:border-t-0"
                                        />

                                        <Notch
                                            tone="page"
                                            className="-left-2.5 -top-2.5"
                                        />

                                        <Notch
                                            tone="page"
                                            className="left-[-10px] right-auto top-auto -bottom-2.5"
                                        />

                                        {slides.length > 1 && (
                                            <span className="absolute right-3 top-5 z-10 min-w-[2rem] text-center text-[10px] font-bold tabular-nums sm:right-8 sm:top-8 sm:min-w-[2.5rem] sm:text-sm">
                                                {activeIndex + 1}/{slides.length}
                                            </span>
                                        )}

                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={currentSlide.id ?? activeIndex}
                                                initial={{
                                                    opacity: 0,
                                                    y: reduceMotion ? 0 : 14,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: reduceMotion ? 0 : -8,
                                                }}
                                                transition={{
                                                    duration: reduceMotion ? 0 : 0.25,
                                                }}
                                                className="flex flex-1 flex-col"
                                            >
                                                <span className="inline-flex w-fit items-center rounded-full border-2 border-[#182322] px-2.5 py-0.5 text-[10px] font-bold sm:px-3 sm:py-1 sm:text-sm">
                                                    {currentSlide.category || "Event"}
                                                </span>

                                                {/* DATE */}
                                                <div className="flex items-end gap-2 sm:mt-7 sm:gap-4">
                                                    {currentParts ? (
                                                        <>
                                                            <p className="text-3xl font-extrabold leading-[0.85] tracking-[-0.05em] tabular-nums sm:text-8xl">
                                                                {currentParts.day}
                                                            </p>

                                                            <div className="pb-1 leading-tight">
                                                                <p className="text-sm font-bold sm:text-xl">
                                                                    {currentParts.month}
                                                                </p>

                                                                <p className="text-[9px] font-medium text-[#182322]/70 sm:text-sm">
                                                                    {currentParts.weekday}

                                                                    {currentParts.until &&
                                                                        `, till ${currentParts.until}`}
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <p className="text-4xl font-extrabold leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                                                            TBA
                                                        </p>
                                                    )}
                                                </div>

                                                <h2 className="mt-3 line-clamp-3 text-base font-extrabold leading-[1.1] tracking-[-0.02em] sm:mt-5 sm:text-3xl">
                                                    {currentSlide.title ||
                                                        "An unforgettable experience"}
                                                </h2>

                                                <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-7">
                                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                                        {/* EXPLORE BUTTON */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEvent(currentSlide);
                                                            }}
                                                            className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#182322] px-3 py-2 text-[11px] font-bold text-[#FEDF24] transition duration-200 hover:bg-[#44807F] hover:text-white sm:gap-1.5 sm:px-6 sm:py-2.5 sm:text-sm lg:px-10"
                                                        >
                                                            <span>Details</span>

                                                            <ArrowUpRight
                                                                size={13}
                                                                className="shrink-0"
                                                            />
                                                        </button>

                                                        {/* HEART BUTTON */}
                                                        <motion.button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleInterested(currentSlide.id);
                                                            }}
                                                            whileTap={{ scale: 0.88 }}
                                                            aria-label={
                                                                interestedEvents.includes(currentSlide.id)
                                                                    ? "Remove from interested"
                                                                    : "Add to interested"
                                                            }
                                                            aria-pressed={interestedEvents.includes(
                                                                currentSlide.id
                                                            )}
                                                            className={`flex h-[34px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition duration-200 sm:h-[42px] sm:w-[46px] ${interestedEvents.includes(currentSlide.id)
                                                                ? "border-[#FF2D55] bg-[#FF2D55] text-white shadow-[0_5px_14px_rgba(255,45,85,0.28)]"
                                                                : "border-[#FF2D55]/35 bg-[#FFF0F3] text-[#FF2D55] hover:border-[#FF2D55] hover:bg-[#FFE1E8]"
                                                                }`}
                                                        >
                                                            <Heart
                                                                size={16}
                                                                fill={
                                                                    interestedEvents.includes(currentSlide.id)
                                                                        ? "currentColor"
                                                                        : "none"
                                                                }
                                                                strokeWidth={2.5}
                                                            />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* SEARCH + mobile */}
                    <div className="mx-auto mt-7 max-w-3xl sm:mt-9 block md:hidden">
                        <div className="flex items-center gap-2 rounded-full border-2 border-[#182322] bg-white py-1.5 pl-5 pr-1.5 shadow-[5px_5px_0_#FEDF24]">
                            <Search
                                size={20}
                                className="shrink-0 text-[#44807F]"
                            />

                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search events or categories"
                                aria-label="Search events"
                                className="min-w-0 flex-1 bg-transparent py-2 text-base font-medium text-[#182322] outline-none placeholder:text-[#182322]/40"
                            />

                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="rounded-full p-2 text-[#182322]/50 transition hover:bg-[#182322]/5 hover:text-[#182322]"
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}

                            <button
                                onClick={() => setShowFilters((value) => !value)}
                                aria-expanded={showFilters}
                                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${showFilters || selectedCategory !== "All" ? "bg-[#44807F] text-white" : "bg-[#182322] text-white hover:bg-[#44807F]"}`}
                            >
                                <SlidersHorizontal size={15} />

                                {selectedCategory === "All"
                                    ? "Category"
                                    : selectedCategory}
                            </button>
                        </div>

                        {/* CATEGORY PANEL */}
                        <AnimatePresence initial={false}>
                            {showFilters && (
                                <motion.div
                                    initial={{
                                        height: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        height: "auto",
                                        opacity: 1,
                                    }}
                                    exit={{
                                        height: 0,
                                        opacity: 0,
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                                        {categories.map((category) => {
                                            const Icon = category.icon;

                                            const selected =
                                                selectedCategory === category.name;

                                            return (
                                                <button
                                                    key={category.name}
                                                    onClick={() =>
                                                        setSelectedCategory(
                                                            category.name
                                                        )
                                                    }
                                                    aria-pressed={selected}
                                                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selected ? "border-[#182322] bg-[#182322] text-white" : "border-[#182322]/15 bg-white text-[#182322]/75 hover:border-[#182322]/40"}`}
                                                >
                                                    <Icon
                                                        size={15}
                                                        className={
                                                            selected
                                                                ? "text-[#FEDF24]"
                                                                : category.text
                                                        }
                                                    />

                                                    {category.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* DATE TABS */}
                        <div
                            className={`mt-5 flex items-center gap-1.5 overflow-x-auto sm:justify-center ${hideScrollbar}`}
                        >
                            {dates.map((date) => {
                                const selected = selectedDate === date;

                                return (
                                    <button
                                        key={date}
                                        type="button"
                                        onClick={() => setSelectedDate(date)}
                                        aria-pressed={selected}
                                        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${selected
                                            ? "bg-[#182322] text-white"
                                            : "text-[#182322]/60 hover:bg-[#182322]/5 hover:text-[#182322]"
                                            }`}
                                    >
                                        {date}
                                    </button>
                                );
                            })}

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-[#44807F] transition hover:bg-[#44807F]/10"
                                >
                                    <X size={14} />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* CUSTOM DATE RANGE (FROM / TO) */}
                        <AnimatePresence initial={false}>
                            {selectedDate === "Custom Date" && (
                                <motion.div
                                    initial={{
                                        height: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        height: "auto",
                                        opacity: 1,
                                    }}
                                    exit={{
                                        height: 0,
                                        opacity: 0,
                                    }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                                        <label className="flex items-center gap-2 rounded-full border-2 border-[#182322]/15 bg-white px-4 py-1.5 text-sm font-semibold">
                                            <span className="text-[#182322]/60">
                                                From
                                            </span>

                                            <input
                                                type="date"
                                                value={customFrom}
                                                max={customTo || undefined}
                                                onChange={(e) => {
                                                    const value = e.target.value;

                                                    setCustomFrom(value);

                                                    if (
                                                        customTo &&
                                                        value > customTo
                                                    ) {
                                                        setCustomTo("");
                                                    }
                                                }}
                                                className="bg-transparent text-sm font-semibold text-[#182322] outline-none"
                                            />
                                        </label>

                                        <label className="flex items-center gap-2 rounded-full border-2 border-[#182322]/15 bg-white px-4 py-1.5 text-sm font-semibold">
                                            <span className="text-[#182322]/60">
                                                To
                                            </span>

                                            <input
                                                type="date"
                                                value={customTo}
                                                min={customFrom || undefined}
                                                onChange={(e) =>
                                                    setCustomTo(e.target.value)
                                                }
                                                className="bg-transparent text-sm font-semibold text-[#182322] outline-none"
                                            />
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* NO EVENTS FOUND */}
                    {hasActiveFilters && gridEvents.length === 0 && (
                        <div className="mt-10 sm:mt-16">
                            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#182322]/20 bg-white/60 px-6 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#FEDF24] text-[#182322]">
                                    <Ticket size={30} />
                                </div>

                                <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.02em]">
                                    No events found
                                </h3>

                                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#182322]/60">
                                    Try a different search, date or category.
                                </p>

                                <button
                                    onClick={clearFilters}
                                    className="mt-6 rounded-full bg-[#182322] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#44807F]"
                                >
                                    Reset filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* EVENTS YOU'LL LOVE GRID */}
                    {gridEvents.length > 0 && (
                        <div className="mt-8 sm:mt-12">
                            <SectionHeader
                                title={
                                    isSearching
                                        ? `${filteredEvents.length} ${filteredEvents.length === 1
                                            ? "event"
                                            : "events"
                                        } found`
                                        : "Events you'll love"
                                }
                                action={
                                    !isSearching && (
                                        <button
                                            type="button"
                                            onClick={() => navigate("/all-events")}
                                            className="group flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-bold text-[#44807F] transition hover:text-[#182322] sm:text-base"
                                        >
                                            <span className="whitespace-nowrap">
                                                Explore all events
                                            </span>

                                            <ArrowRight
                                                size={15}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </button>
                                    )
                                }
                            />

                            {/* DESKTOP: 6 = 3 + 3 | MOBILE: 4 = 2 + 2 */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3">
                                {gridEvents.map((event, index) => (
                                    <div
                                        key={event.id || index}
                                        className={
                                            index >= 8
                                                ? "hidden lg:block"
                                                : "block"
                                        }
                                    >
                                        <EventTicket
                                            event={event}
                                            onOpen={openEvent}
                                            interested={interestedEvents.includes(
                                                event.id
                                            )}
                                            onToggle={toggleInterested}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* OLD EXPLORE ALL EVENTS BUTTON - KEPT */}
                    {filteredEvents.length > 0 && !isSearching && (
                        <div className="mt-10 flex justify-center sm:mt-12">
                            <button
                                onClick={() => navigate("/all-events")}
                                className="group flex cursor-pointer items-center gap-3 rounded-md bg-[#182322] py-2 pl-7 pr-2 text-sm font-bold text-white transition hover:bg-[#44807F]"
                            >
                                Explore all events

                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEDF24] text-[#182322] transition group-hover:translate-x-1">
                                    <ArrowRight size={16} />
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {/* ================================================== */}
            {/* WISHLIST / ORGANIZER CONNECTION */}
            {/* ================================================== */}

            <section className="relative mt-8 w-full overflow-hidden border-y border-[#44807F]/25 bg-[#071A16] px-4 py-8 text-[#F4F1E4] sm:mt-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">

                {/* GREEN / TEAL BACKGROUND GLOW */}
                <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#00A896]/20 blur-[100px]" />

                <div className="pointer-events-none absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-[#FEDF24]/10 blur-[110px]" />

                <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-96 w-96 rounded-full bg-[#44807F]/20 blur-[120px]" />

                <div className="relative z-10 mx-auto max-w-7xl">

                    {/* MOBILE + DESKTOP LAYOUT */}
                    <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">

                        {/* HEADING */}
                        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">

                            {/* WISHLIST LABEL */}
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#72D6C6]/25 bg-[#72D6C6]/10 px-3 py-2">

                                <Heart
                                    size={14}
                                    className="text-[#72D6C6]"
                                    fill="currentColor"
                                />

                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A9F0E2] sm:text-xs">
                                    Wishlist → Real conversations
                                </span>

                            </div>

                            {/* MAIN HEADING */}
                            <h3 className="max-w-2xl text-[30px] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#F4F1E4] sm:text-4xl lg:text-5xl xl:text-6xl">

                                Your kind of events,{" "}

                                <span className="text-[#FEDF24]">
                                     all in one place.
                                </span>

                            </h3>

                        </div>

                        {/* LARGE IMAGE */}
                        <div className="relative flex w-full items-center justify-center lg:min-w-0">

                            {/* SOFT IMAGE GLOW */}
                            <div className="pointer-events-none absolute inset-10 rounded-full bg-[#00A896]/15 blur-[70px]" />

                            <img
                                src="/wishlist-guide.png"
                                alt="Wishlist and organizer connection guide"
                                loading="lazy"
                                className="relative
                        z-10
                        block
                        h-auto
                        w-full
                        max-w-[650px]
                        object-contain
                        sm:max-w-[680px]
                        scale-[1.2]
                        lg:max-w-none
                        lg:scale-[1.08]
                        xl:scale-[1.12]
                    "
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* WISHLIST SUCCESS TOAST */}
            <AnimatePresence>
                {wishlistToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.96 }}
                        transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="pointer-events-none fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 sm:bottom-7"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="flex items-center gap-3 rounded-2xl border border-[#FF2D55]/20 bg-[#182322] px-4 py-3.5 text-white shadow-[0_18px_50px_rgba(24,35,34,0.28)]">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF2D55] shadow-[0_6px_18px_rgba(255,45,85,0.32)]">
                                <Heart
                                    size={20}
                                    fill="currentColor"
                                    strokeWidth={2.5}
                                />
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-extrabold leading-tight text-white">
                                    Added to wishlist ❤️
                                </p>
                                <p className="mt-0.5 truncate text-xs font-medium text-white/65">
                                    {wishlistToast.title}
                                </p>
                            </div>

                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FEDF24] text-[#182322]">
                                <span className="text-sm font-black">✓</span>
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <EventDetailsModal
                event={selectedEvent}
                isOpen={isEventModalOpen}
                onClose={closeEventModal}
            />
        </section>
    );
};

export default EventsHome;