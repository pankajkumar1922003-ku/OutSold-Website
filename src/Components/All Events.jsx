import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Heart,
    Laugh,
    LayoutGrid,
    MapPin,
    Music,
    Search,
    Ticket,
    Trophy,
    Wrench,
    X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useOutsoldEvents } from "../hooks/useOutsoldEvents";
import EventDetailsModal from "../Components/EventDetailsModal";
import { db } from "../lib/firebase";
import {
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    setDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85";

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap');";

const FONT_STYLE = {
    fontFamily:
        "'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

const CATEGORIES = [
    {
        key: "music",
        name: "Music",
        icon: Music,
        bg: "#B8860B",
        text: "#FEDF24",
    },
    {
        key: "comedy",
        name: "Comedy",
        icon: Laugh,
        bg: "#F4B942",
        text: "#182322",
    },
    {
        key: "business",
        name: "Business",
        icon: BriefcaseBusiness,
        bg: "#5267C8",
        text: "#FFFFFF",
    },
    {
        key: "workshop",
        name: "Workshop",
        icon: Wrench,
        bg: "#9557C8",
        text: "#FFFFFF",
    },
    {
        key: "sports",
        name: "Sports",
        icon: Trophy,
        bg: "#4F9D69",
        text: "#FFFFFF",
    },
    {
        key: "other",
        name: "Other",
        icon: Ticket,
        bg: "#64748B",
        text: "#FFFFFF",
    },
];

const DATE_FILTERS = [
    { key: "all", label: "Any date" },
    { key: "today", label: "Today" },
    { key: "week", label: "This week" },
    { key: "month", label: "This month" },
];

const MAX_FEATURED = 6;
const PREVIEW_PER_CATEGORY = 6;

const hideScrollbar =
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
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

const getStartDate = (event) =>
    event?.startDate ||
    event?.start_date ||
    event?.eventStartDate ||
    event?.date ||
    "";

const getEndDate = (event) =>
    event?.endDate ||
    event?.end_date ||
    event?.eventEndDate ||
    event?.startDate ||
    event?.start_date ||
    event?.date ||
    "";


const isEventExpired = (event) => {
    const endDate = toDate(getEndDate(event));

    if (!endDate) return false;

    const today = startOfDay(new Date());
    const eventEndDay = startOfDay(endDate);

    return eventEndDay < today;
};

const getImage = (event) =>
    event?.image || FALLBACK_IMAGE;

const handleImageError = (e) => {
    if (e.currentTarget.src !== FALLBACK_IMAGE) {
        e.currentTarget.src = FALLBACK_IMAGE;
    }
};

const getDateParts = (event) => {
    const start = toDate(getStartDate(event));

    if (!start) {
        return {
            day: "--",
            month: "TBA",
            weekday: "",
        };
    }

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
    };
};

const getDateRange = (event) => {
    const start = toDate(getStartDate(event));
    const end = toDate(getEndDate(event));

    if (!start) return "Date TBA";

    const startText = start.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

    if (
        !end ||
        start.toDateString() === end.toDateString()
    ) {
        return startText;
    }

    const endText = end.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

    return `${startText} — ${endText}`;
};


const getRawCategoryKey = (eventOrCategory) => {
    const value =
        typeof eventOrCategory === "object" && eventOrCategory !== null
            ? eventOrCategory.category
            : eventOrCategory;

    return String(value || "other").trim().toLowerCase();
};

const getCategoryKey = (eventOrCategory) => {
    const rawKey = getRawCategoryKey(eventOrCategory);

    return CATEGORIES.some((category) => category.key === rawKey)
        ? rawKey
        : "other";
};

const getEventCategoryLabel = (event) => {
    const rawCategory = String(event?.category || "other").trim();

    const customCategory = String(
        event?.otherCategory ||
        event?.customCategory ||
        event?.categoryName ||
        ""
    ).trim();

    if (getRawCategoryKey(event) === "other") {
        return customCategory || "Other";
    }

    return rawCategory;
};

const getCategoryConfig = (category) => {
    const key = getCategoryKey(category);

    return (
        CATEGORIES.find((item) => item.key === key) ||
        CATEGORIES[CATEGORIES.length - 1]
    );
};
const startOfDay = (date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
};

const endOfDay = (date) => {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy;
};

/* -------------------------------------------------------------------------- */
/* NOTCH                                                                      */
/* -------------------------------------------------------------------------- */

const TicketNotch = ({ side = "left" }) => (
    <span
        aria-hidden="true"
        className={`absolute z-20 h-5 w-5 rounded-full bg-[#FFF8DC] ${side === "left" ? "-left-2.5" : "-right-2.5"}`}
    />
);

/* -------------------------------------------------------------------------- */
/* CATEGORY FILTER                                                            */
/* -------------------------------------------------------------------------- */

const CategoryFilter = ({
    category,
    count,
    active,
    onClick,
}) => {
    const Icon = category.icon || Ticket;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`group flex shrink-0 items-center gap-3 rounded-md border-2 px-4 py-3 text-left transition-all duration-200 ${active ? "border-[#182322] -translate-y-0.5 shadow-[4px_4px_0_#FEDF24]" : "border-[#182322]/10 bg-[#FFFDF5] hover:-translate-y-0.5 hover:border-[#182322]/25"}`}
            style={
                active
                    ? {
                        backgroundColor:
                            category.bg,
                        color: category.text,
                    }
                    : undefined
            }
        >
            <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white/20" : ""}`}
                style={
                    !active
                        ? {
                            backgroundColor:
                                category.bg,
                            color: category.text,
                        }
                        : undefined
                }
            >
                <Icon size={19} strokeWidth={2.4} />
            </span>

            <span>
                <span className="block text-sm font-extrabold">
                    {category.name}
                </span>

                <span
                    className={`block text-[11px] font-semibold ${active ? "opacity-80" : "text-[#3A3326]/45"}`}
                >
                    {count}{" "}
                    {count === 1
                        ? "event"
                        : "events"}
                </span>
            </span>
        </button>
    );
};

/* -------------------------------------------------------------------------- */
/* EVENT TICKET                                                               */
/* -------------------------------------------------------------------------- */

const datePartsFor = (event) => getDateParts(event);

const EventTicket = ({ event, onOpen, interested = false, onToggle }) => {
    const reduceMotion = useReducedMotion();
    const style = getCategoryConfig(event?.category);
    const CategoryIcon = style.icon || Ticket;

    return (
        <motion.article
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            role="link"
            tabIndex={0}
            onClick={() => onOpen(event)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(event);
                }
            }}
            aria-label={`View ${event?.title || "event"}`}
            className="group relative flex min-w-0 cursor-pointer flex-col overflow-visible rounded-md border border-[#E8D9AE] bg-[#FFFDF5] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(24,35,34,0.12)] focus-visible:ring-4 focus-visible:ring-[#FEDF24]"
        >
            <div className="relative aspect-16/10 overflow-hidden bg-[#e9ece7]">

                {/* Blurred background for side gaps */}
                <img
                    src={getImage(event)}
                    alt=""
                    aria-hidden="true"
                    onError={handleImageError}
                    className="absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-2xl"
                />

                {/* Full image - no cropping */}
                <img
                    src={getImage(event)}
                    alt={event?.title || "Event"}
                    loading="lazy"
                    onError={handleImageError}
                    className="absolute inset-0 h-full w-full object-contain transition duration-700 group-hover:scale-[1.02]"
                />

                <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-[#3A3326] shadow-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs">
                    <CategoryIcon size={11} className={style.text || ""} />
                    {getEventCategoryLabel(event)}
                </span>
            </div>

            <div className="relative flex flex-col border-t-2 border-dashed border-[#B8860B]/25 p-2.5 sm:p-4">
                <span
                    aria-hidden="true"
                    className="absolute -left-2.5 -top-[11px] z-20 h-5 w-5 rounded-full bg-[#FFF8DC]"
                />

                <span
                    aria-hidden="true"
                    className="absolute -right-2.5 -top-[11px] z-20 h-5 w-5 rounded-full bg-[#FFF8DC]"
                />

                <div className="flex flex-col gap-2">
                    {/* DATE */}
                    <div className="flex min-h-8 items-center">
                        {(() => {
                            const start = toDate(getStartDate(event));
                            const end = toDate(getEndDate(event));

                            if (!start) {
                                return (
                                    <p className="text-xs font-bold text-[#3A3326]/60">
                                        Date TBA
                                    </p>
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
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays size={14} className="shrink-0 text-[#C18B2C]" />

                                    <span className="text-sm font-extrabold text-[#C18B2C]">
                                        {startDay} {startMonth}
                                    </span>

                                    {!isSameDay && (
                                        <>
                                            <span className="text-xs font-bold">→</span>
                                            <span className="text-sm font-extrabold text-[#C18B2C]">
                                                {endDay} {endMonth}
                                            </span>
                                        </>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    {/* EVENT NAME */}
                    <h4 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug tracking-[-0.01em] text-[#3A3326] sm:min-h-0 sm:text-lg">
                        {event?.title || "Untitled Event"}
                    </h4>
                </div>

                <div className="flex w-full items-center gap-2 sm:mt-4 sm:gap-2.5">
                    {/* Details BUTTON */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen(event);
                        }}
                        className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#D9A441] px-2 py-2 text-[11px] font-bold text-[#3A3326] transition duration-200 hover:bg-[#B8860B] hover:text-white sm:gap-1.5 sm:px-3 sm:py-2.5 sm:text-sm"
                    >
                        <span>Details</span>
                        <ArrowUpRight size={13} className="shrink-0" />
                    </button>

                    {/* HEART BUTTON */}
                    <motion.button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle?.(event?.id);
                        }}
                        whileTap={{ scale: 0.88 }}
                        aria-label={
                            interested
                                ? "Remove from interested"
                                : "Add to interested"
                        }
                        aria-pressed={interested}
                        className={`flex h-[34px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition duration-200 sm:h-[42px] sm:w-[46px] ${interested
                            ? "border-[#FF2D55] bg-[#FF2D55] text-white shadow-[0_5px_14px_rgba(255,45,85,0.28)]"
                            : "border-[#FF2D55]/35 bg-[#FFF0F3] text-[#FF2D55] hover:border-[#FF2D55] hover:bg-[#FFE1E8]"
                            }`}
                    >
                        <Heart
                            size={16}
                            fill={interested ? "currentColor" : "none"}
                            strokeWidth={2.5}
                        />
                    </motion.button>
                </div>
            </div>
        </motion.article>
    );
};

/* -------------------------------------------------------------------------- */
/* FEATURED SECTION                                                           */
/* -------------------------------------------------------------------------- */

const FeaturedEvents = ({ events, onOpen, interestedEvents, onToggle }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const trackRef = useRef(null);
    const activeRef = useRef(0);

    activeRef.current = activeIndex;

    const goToSlide = (index) => {
        const track = trackRef.current;
        if (!track || !events.length) return;

        const nextIndex = (index + events.length) % events.length;

        track.scrollTo({
            left: nextIndex * track.clientWidth,
            behavior: "smooth",
        });
        setActiveIndex(nextIndex);
    };

    // User swipe/scroll karte waqt active dot sync rakhna
    const handleScroll = () => {
        const track = trackRef.current;
        if (!track || !track.clientWidth) return;

        const index = Math.round(track.scrollLeft / track.clientWidth);
        const safeIndex = Math.min(Math.max(index, 0), events.length - 1);

        if (safeIndex !== activeRef.current) {
            setActiveIndex(safeIndex);
        }
    };

    // User ne touch kiya => slideshow band
    const stopAutoPlay = () => setAutoPlay(false);

    // Slideshow
    useEffect(() => {
        if (!autoPlay || events.length <= 1) return;

        const timer = window.setInterval(() => {
            goToSlide(activeRef.current + 1);
        }, 4000);

        return () => window.clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay, events.length]);

    useEffect(() => {
        if (activeIndex >= events.length) {
            setActiveIndex(0);
        }
    }, [events.length, activeIndex]);

    if (!events.length) return null;

    return (
        <section className="relative -mx-4 mt-6 overflow-hidden bg-[#D9A441] md:rounded-md sm:-mx-7 lg:-mx-10">
            <div className="relative h-[350px] w-full overflow-hidden sm:h-[290px] lg:h-[500px]">
                {/* SLIDES TRACK: mobile pe swipe, sm+ pe overflow-hidden (sirf arrows/auto) */}
                <div
                    ref={trackRef}
                    onScroll={handleScroll}
                    onTouchStart={stopAutoPlay}
                    className={`flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain sm:overflow-x-hidden ${hideScrollbar}`}
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    {events.map((event) => {
                        const categoryStyle = getCategoryConfig(event?.category);
                        const CategoryIcon = categoryStyle.icon || Ticket;
                        const isInterested = interestedEvents.includes(event?.id);

                        return (
                            <div
                                key={event?.id}
                                className="relative h-full w-full min-w-full shrink-0 snap-center overflow-hidden"
                            >
                                {/* Blurred background (portrait / side gaps ke liye) */}
                                <img
                                    src={getImage(event)}
                                    alt=""
                                    aria-hidden="true"
                                    onError={handleImageError}
                                    className="absolute inset-0 h-full w-full scale-125 object-cover opacity-80 blur-2xl"
                                />

                                {/* Full image, bina crop ke */}
                                <img
                                    src={getImage(event)}
                                    alt={event?.title || "Featured event"}
                                    onError={handleImageError}
                                    className="absolute inset-0 h-full w-full object-contain"
                                />

                                <div className="absolute inset-0 bg-gradient-to-r from-[#182322]/80 via-[#182322]/35 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#182322]/95 via-[#182322]/30 to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 z-10">
                                    <div className="max-w-2xl px-4 pb-5 sm:px-7 sm:pb-7 lg:px-10 lg:pb-10">
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEDF24] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#3A3326]">
                                                <CategoryIcon size={12} />
                                                {getEventCategoryLabel(event)}
                                            </span>
                                        </div>

                                        <h2 className="line-clamp-2 text-2xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                                            {event?.title || "Featured Event"}
                                        </h2>

                                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-white/75 sm:text-sm">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays size={14} />
                                                {getDateRange(event)}
                                            </span>

                                            {event?.location && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin size={14} />
                                                    <span className="line-clamp-1 max-w-[220px]">
                                                        {event.location}
                                                    </span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center gap-2.5">
                                            <button
                                                type="button"
                                                onClick={() => onOpen(event)}
                                                className="flex items-center gap-1.5 rounded-md bg-[#FEDF24] px-4 py-2.5 text-xs font-black text-[#3A3326] transition hover:bg-white sm:px-5 sm:py-3 sm:text-sm"
                                            >
                                                Details
                                                <ArrowUpRight size={15} />
                                            </button>

                                            <motion.button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggle?.(event?.id);
                                                }}
                                                whileTap={{ scale: 0.88 }}
                                                aria-label={
                                                    isInterested
                                                        ? "Remove from interested"
                                                        : "Add to interested"
                                                }
                                                aria-pressed={isInterested}
                                                className={`flex h-[38px] w-[42px] shrink-0 items-center justify-center rounded-lg border transition duration-200 sm:h-[46px] sm:w-[48px] ${isInterested
                                                    ? "border-[#FF2D55] bg-[#FF2D55] text-white shadow-[0_5px_14px_rgba(255,45,85,0.28)]"
                                                    : "border-[#FF2D55]/35 bg-[#FFF0F3] text-[#FF2D55] hover:border-[#FF2D55] hover:bg-[#FFE1E8]"
                                                    }`}
                                            >
                                                <Heart
                                                    size={18}
                                                    fill={isInterested ? "currentColor" : "none"}
                                                    strokeWidth={2.5}
                                                />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="pointer-events-none absolute left-4 top-4 z-20 sm:left-7 sm:top-5 lg:left-10">
                    <span className="inline-flex items-center rounded-full border border-white/25 bg-[#D9A441]/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-md sm:px-5 sm:py-2.5 sm:text-sm">
                        Featured Event
                    </span>
                </div>

                {events.length > 1 && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-[200] flex justify-end px-4 pt-4 sm:px-7 sm:pt-5 lg:px-10">
                        <div className="pointer-events-auto flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    stopAutoPlay();
                                    goToSlide(activeIndex - 1);
                                }}
                                aria-label="Previous featured event"
                                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/50 bg-[#D9A441]/90 text-white shadow-xl backdrop-blur-md transition hover:bg-[#FEDF24] hover:text-[#3A3326] sm:h-12 sm:w-12"
                            >
                                <ChevronLeft size={22} strokeWidth={2.7} />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    stopAutoPlay();
                                    goToSlide(activeIndex + 1);
                                }}
                                aria-label="Next featured event"
                                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/50 bg-[#D9A441]/90 text-white shadow-xl backdrop-blur-md transition hover:bg-[#FEDF24] hover:text-[#3A3326] sm:h-12 sm:w-12"
                            >
                                <ChevronRight size={22} strokeWidth={2.7} />
                            </button>
                        </div>
                    </div>
                )}

                {events.length > 1 && (
                    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 sm:right-7">
                        {events.map((event, index) => (
                            <button
                                key={event?.id || index}
                                type="button"
                                onClick={() => {
                                    stopAutoPlay();
                                    goToSlide(index);
                                }}
                                aria-label={`Show featured event ${index + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex
                                    ? "w-7 bg-[#FEDF24]"
                                    : "w-1.5 bg-white/50 hover:bg-white"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
/* -------------------------------------------------------------------------- */
/* CATEGORY SECTION                                                           */
/* -------------------------------------------------------------------------- */

const CategorySection = ({ category, events, onOpen, interestedEvents, onToggle }) => {
    const railRef = useRef(null);

    const scroll = (direction) => {
        if (!railRef.current) return;

        railRef.current.scrollBy({
            left:
                direction === "left"
                    ? -railRef.current
                        .clientWidth * 0.75
                    : railRef.current
                        .clientWidth * 0.75,
            behavior: "smooth",
        });
    };

    if (!events.length) return null;

    const Icon = category.icon || Ticket;

    return (
        <section className="mt-8 sm:mt-12">
            {/* Category heading */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
                        style={{
                            backgroundColor:
                                category.bg,
                            color:
                                category.text,
                        }}
                    >
                        <Icon size={21} />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="truncate text-xl font-extrabold tracking-[-0.025em] sm:text-2xl">
                                {category.name}
                            </h2>

                            <span className="rounded-full bg-[#D9A441]/5 px-2 py-0.5 text-[10px] font-black text-[#3A3326]/45">
                                {events.length}
                            </span>
                        </div>

                        <p className="hidden text-xs text-[#3A3326]/45 sm:block">
                            More {category.name.toLowerCase()} events
                            to Details
                        </p>
                    </div>
                </div>
            </div>

            {/* Accent line */}
            <div className="mb-4 flex items-center gap-2">
                <span
                    className="h-1 w-12 rounded-full"
                    style={{
                        backgroundColor:
                            category.bg,
                    }}
                />

                <span className="h-px flex-1 bg-[#D9A441]/8" />
            </div>

            {/* Cards + navigation */}
            <div className="relative px-0 sm:px-14">
                {events.length > 1 && (
                    <>
                        <button type="button" onClick={() => scroll("left")} aria-label={`Previous ${category.name} events`} className="absolute left-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 sm:flex items-center justify-center rounded-full border-2 border-[#182322]/15 bg-[#FFFDF5] text-[#3A3326] shadow-lg transition hover:border-[#182322] hover:bg-[#D9A441] hover:text-[#3A3326] sm:h-11 sm:w-11">
                            <ChevronLeft size={18} strokeWidth={2.5} />
                        </button>

                        <button type="button" onClick={() => scroll("right")} aria-label={`Next ${category.name} events`} className="absolute right-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 sm:flex items-center justify-center rounded-full border-2 border-[#182322]/15 bg-[#FFFDF5] text-[#3A3326] shadow-lg transition hover:border-[#182322] hover:bg-[#D9A441] hover:text-[#3A3326] sm:h-11 sm:w-11">
                            <ChevronRight size={18} strokeWidth={2.5} />
                        </button>
                    </>
                )}

                <div
                    ref={railRef}
                    className={`flex gap-3 overflow-x-auto pb-3 sm:gap-4 ${hideScrollbar}`}
                    style={{
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    {events
                        .slice(0, PREVIEW_PER_CATEGORY)
                        .map((event, index) => (
                            <div key={event?.id || `${category.key}-${index}`} className="w-[60%] min-w-[60%] shrink-0 snap-start sm:w-[43%] sm:min-w-[43%] md:w-[31.5%] md:min-w-[31.5%] lg:w-[23.5%] lg:min-w-[23.5%] xl:w-[21.5%] xl:min-w-[21.5%]">
                                <EventTicket event={event} index={index} onOpen={onOpen} interested={interestedEvents.includes(event?.id)} onToggle={onToggle} />
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

const EventsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [customFromDate, setCustomFromDate] = useState("");
    const [customToDate, setCustomToDate] = useState("");
    const [showCategories, setShowCategories] = useState(false);
    const { events: fetchedEvents = [] } = useOutsoldEvents();
    const [interestedEvents, setInterestedEvents] = useState([]);
    const [wishlistToast, setWishlistToast] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const { user } = useAuth();

    const events = useMemo(() => {
        if (!Array.isArray(fetchedEvents)) {
            return [];
        }

        const validEvents = fetchedEvents.filter(
            (event) =>
                event &&
                typeof event === "object"
        );

        const seen = new Set();

        const uniqueEvents = validEvents.filter((event) => {
            const id = String(event?.id || "").trim();

            const fallbackKey = [
                event?.title,
                event?.category,
                getStartDate(event),
                event?.location,
            ]
                .map((value) =>
                    String(value || "")
                        .trim()
                        .toLowerCase()
                )
                .join("|");

            const key = id
                ? `id:${id}`
                : `fallback:${fallbackKey}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });


        const activeEvents = uniqueEvents.filter(
            (event) => !isEventExpired(event)
        );

        return activeEvents.sort((a, b) => {
            const today = startOfDay(new Date());

            const getEventStatus = (event) => {
                const start = toDate(getStartDate(event));
                const end = toDate(getEndDate(event)) || start;

                if (!start) {
                    return {
                        priority: 3,
                        date: Infinity,
                    };
                }

                const startDay = startOfDay(start);
                const endDay = endOfDay(end);

                // Event aaj chal raha hai
                if (startDay <= today && endDay >= today) {
                    return {
                        priority: 0,
                        date: startDay.getTime(),
                    };
                }

                // Event future mein hai
                if (startDay > today) {
                    return {
                        priority: 1,
                        date: startDay.getTime(),
                    };
                }

                // Event khatam ho chuka hai
                return {
                    priority: 2,
                    date: -endDay.getTime(),
                };
            };

            const eventA = getEventStatus(a);
            const eventB = getEventStatus(b);

            if (eventA.priority !== eventB.priority) {
                return eventA.priority - eventB.priority;
            }

            return eventA.date - eventB.date;
        });
    }, [fetchedEvents]);

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
                    snapshot.docs.map(
                        (wishlistDoc) =>
                            wishlistDoc.id
                    )
                );
            },
            (error) => {
                console.error(
                    "Wishlist listener error:",
                    error
                );
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    useLayoutEffect(() => {
        window.history.scrollRestoration =
            "manual";

        document.documentElement.style.scrollBehavior =
            "auto";

        document.body.style.scrollBehavior =
            "auto";

        window.scrollTo(0, 0);

        document.documentElement.scrollTop =
            0;

        document.body.scrollTop = 0;

        return () => {
            document.documentElement.style.scrollBehavior =
                "";

            document.body.style.scrollBehavior =
                "";
        };
    }, []);


    const openEvent = (event) => {
        if (!event) return;

        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const closeEventModal = () => {
        setIsEventModalOpen(false);
        setSelectedEvent(null);
    };

    const toggleInterested = async (eventId) => {
        if (!user?.uid) {
            window.dispatchEvent(
                new Event("openLoginModal")
            );
            return;
        }

        const event = events.find(
            (item) => item.id === eventId
        );

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
                setWishlistToast({
                    title: event?.title || "Event",
                });

                window.clearTimeout(window.__outsoldWishlistToastTimer);

                window.__outsoldWishlistToastTimer = window.setTimeout(() => {
                    setWishlistToast(null);
                }, 2600);
            }
        } catch (error) {
            console.error(
                "Wishlist update error:",
                error
            );
        }
    };


    const categoryList = useMemo(() => {
        const counts = {};

        events.forEach((event) => {
            const key = getCategoryKey(event);
            counts[key] = (counts[key] || 0) + 1;
        });

        return CATEGORIES.map((category) => ({
            ...category,
            count: counts[category.key] || 0,
        }));
    }, [events]);

    /* ---------------------------------------------------------------------- */
    /* DATE FILTER                                                             */
    /* ---------------------------------------------------------------------- */

    const matchesDate = (event) => {
        if (
            dateFilter === "all" &&
            !customFromDate &&
            !customToDate
        ) {
            return true;
        }

        const start = toDate(
            getStartDate(event)
        );

        const end =
            toDate(
                getEndDate(event)
            ) || start;

        if (!start) return false;

        /* Custom date range */
        if (customFromDate || customToDate) {
            const from = customFromDate ? toDate(customFromDate) : null;
            const to = customToDate ? toDate(customToDate) : null;

            if (from && to && from > to) return false;

            const rangeStart = from ? startOfDay(from) : null;
            const rangeEnd = to ? endOfDay(to) : null;

            if (rangeStart && startOfDay(start) < rangeStart && endOfDay(end) < rangeStart) {
                return false;
            }

            if (rangeEnd && endOfDay(end) > rangeEnd && startOfDay(start) > rangeEnd) {
                return false;
            }

            return true;
        }

        const now = new Date();

        let rangeStart =
            startOfDay(now);

        let rangeEnd =
            endOfDay(now);

        /* This week */
        if (dateFilter === "week") {
            const day =
                now.getDay();

            const diffToMonday =
                day === 0
                    ? -6
                    : 1 - day;

            const monday =
                new Date(now);

            monday.setDate(
                now.getDate() +
                diffToMonday
            );

            const sunday =
                new Date(monday);

            sunday.setDate(
                monday.getDate() +
                6
            );

            rangeStart =
                startOfDay(
                    monday
                );

            rangeEnd =
                endOfDay(
                    sunday
                );
        }

        /* This month */
        if (dateFilter === "month") {
            rangeStart =
                startOfDay(
                    new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        1
                    )
                );

            rangeEnd =
                endOfDay(
                    new Date(
                        now.getFullYear(),
                        now.getMonth() +
                        1,
                        0
                    )
                );
        }

        return (
            startOfDay(start) <=
            rangeEnd &&
            endOfDay(end) >=
            rangeStart
        );
    };

    /* ---------------------------------------------------------------------- */
    /* FILTERED EVENTS                                                        */
    /* ---------------------------------------------------------------------- */

    const filteredEvents = useMemo(() => {
        const query = searchTerm
            .trim()
            .toLowerCase();

        return events.filter((event) => {
            const title = String(
                event?.title || ""
            ).toLowerCase();

            const category = getRawCategoryKey(event);
            const categoryLabel = getEventCategoryLabel(event).toLowerCase();
            const categoryKey = getCategoryKey(event);

            const location = String(
                event?.location || ""
            ).toLowerCase();

            const matchesQuery =
                !query ||
                title.includes(query) ||
                category.includes(query) ||
                categoryLabel.includes(query) ||
                location.includes(query);

            const matchesCategory =
                activeCategory === "all" ||
                categoryKey === activeCategory;

            return (
                matchesQuery &&
                matchesCategory &&
                matchesDate(event)
            );
        });
    }, [
        events,
        searchTerm,
        activeCategory,
        dateFilter,
        customFromDate,
        customToDate,
    ]);

    /* ---------------------------------------------------------------------- */
    /* FILTERED FEATURED                                                      */
    /* ---------------------------------------------------------------------- */

    const featuredEvents = useMemo(() => {
        return events
            .filter(
                (event) =>
                    event?.displaySection ===
                    "featured"
            )
            .slice(0, MAX_FEATURED);
    }, [events]);

    /* ---------------------------------------------------------------------- */
    /* GROUP EVENTS BY CATEGORY                                               */
    /* ---------------------------------------------------------------------- */

    const groupedEvents = useMemo(() => {
        const groups = {};
        filteredEvents.forEach(
            (event) => {
                const key = getCategoryKey(event);

                if (!groups[key]) {
                    groups[key] = [];
                }

                groups[key].push(
                    event
                );
            }
        );

        return groups;
    }, [filteredEvents]);

    /* ---------------------------------------------------------------------- */
    /* FILTER STATE                                                            */
    /* ---------------------------------------------------------------------- */

    const filtersActive =
        Boolean(searchTerm) ||
        activeCategory !== "all" ||
        dateFilter !== "all" ||
        Boolean(customFromDate) ||
        Boolean(customToDate);

    const resetFilters = () => {
        setSearchTerm("");
        setActiveCategory("all");
        setDateFilter("all");
        setCustomFromDate("");
        setCustomToDate("");
    };

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <main
            style={FONT_STYLE}
            className="relative min-h-screen overflow-hidden bg-[#FFF9E8] text-[#3A3326]"
        >
            <style>{FONT_IMPORT}</style>

            {/* Decorative blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[-150px] top-[180px] h-[350px] w-[350px] rounded-full bg-[#FEDF24]/10 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[-180px] top-[850px] h-[350px] w-[350px] rounded-full bg-[#B8860B]/8 blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-1 sm:px-7 sm:pt-16 lg:px-10">
                {/* ================================================================== */}
                {/* FEATURED                                                             */}
                {/* ================================================================== */}

                {featuredEvents.length > 0 && (
                    <FeaturedEvents
                        events={featuredEvents}
                        onOpen={openEvent}
                        interestedEvents={interestedEvents}
                        onToggle={toggleInterested}
                    />
                )}


                {/* ================================================================== */}
                {/* HEADER                                                               */}
                {/* ================================================================== */}

                <header className="mb-6">
                    <div className="flex mt-4 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="rounded-md text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-black sm:text-6xl">
                                Explore
                                <span className="ml-2 relative inline-block">
                                    events.
                                    <span className="absolute bottom-[-4px] left-0 h-2 w-full -rotate-1 rounded-full bg-[#FEDF24]" />
                                </span>
                            </h1>
                        </div>
                    </div>
                </header>

                {/* ================================================================== */}
                {/* FILTER AREA                                                         */}
                {/* ================================================================== */}

                <section className="overflow-hidden rounded-md border border-[#B8860B]/25 bg-[#fffdf6] shadow-[0_12px_35px_rgba(184,134,11,0.10)]">
                    <div className="p-3 sm:p-4">
                        {/* Search */}
                        <div className="group flex items-center rounded-md border border-[#E8D9AE] bg-[#FFF8DC] px-3 py-1.5 transition focus-within:border-[#B8860B] focus-within:ring-4 focus-within:ring-[#B8860B]/10">
                            <Search size={18} className="shrink-0 text-[#C18B2C]" />

                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by event name, category or venue..."
                                aria-label="Search events by name, category or venue"
                                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs font-semibold text-[#3A3326] outline-none placeholder:text-[#3A3326]/35"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear search"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#3A3326]/40 transition hover:bg-[#D9A441]/5 hover:text-[#3A3326]"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {/* Quick date filters + custom range */}
                        <div className="mt-3 flex flex-col gap-2">

                            {/* From + To */}
                            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">

                                {/* From */}
                                <label
                                    className={`relative flex h-8 min-w-0 items-center rounded-md border px-3 transition sm:min-w-[150px] ${customFromDate
                                        ? "border-[#B8860B] bg-[#B8860B]/10"
                                        : "border-[#E8D9AE] bg-[#FFF8DC]"
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none absolute left-3 transition-all ${customFromDate
                                            ? "-top-2 bg-[#fffdf6] px-1.5 text-[9px] font-black uppercase tracking-wide text-[#C18B2C]"
                                            : "top-1/2 -translate-y-1/2 text-xs font-bold text-[#3A3326]/45"
                                            }`}
                                    >
                                        From
                                    </span>

                                    <input
                                        type="date"
                                        value={customFromDate}
                                        onChange={(e) => {
                                            setCustomFromDate(e.target.value);
                                            setDateFilter("all");
                                        }}
                                        className={`w-full min-w-0 bg-transparent text-xs font-bold text-[#3A3326] outline-none ${customFromDate ? "pt-1" : "text-transparent"
                                            }`}
                                        aria-label="From date"
                                    />
                                </label>

                                {/* To */}
                                <label
                                    className={`relative flex h-8 min-w-0 items-center rounded-md border px-3 transition sm:min-w-[150px] ${customToDate
                                        ? "border-[#B8860B] bg-[#B8860B]/10"
                                        : "border-[#E8D9AE] bg-[#FFF8DC]"
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none absolute left-3 transition-all ${customToDate
                                            ? "-top-2 bg-[#fffdf6] px-1.5 text-[9px] font-black uppercase tracking-wide text-[#C18B2C]"
                                            : "top-1/2 -translate-y-1/2 text-xs font-bold text-[#3A3326]/45"
                                            }`}
                                    >
                                        To
                                    </span>

                                    <input
                                        type="date"
                                        value={customToDate}
                                        min={customFromDate || undefined}
                                        onChange={(e) => {
                                            setCustomToDate(e.target.value);
                                            setDateFilter("all");
                                        }}
                                        className={`w-full min-w-0 bg-transparent text-xs font-bold text-[#3A3326] outline-none ${customToDate ? "pt-1" : "text-transparent"
                                            }`}
                                        aria-label="To date"
                                    />
                                </label>

                            </div>

                            {/* Quick date filters */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">

                                {DATE_FILTERS.map((option) => {
                                    const active =
                                        !customFromDate &&
                                        !customToDate &&
                                        dateFilter === option.key;

                                    return (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => {
                                                setDateFilter(option.key);
                                                setCustomFromDate("");
                                                setCustomToDate("");
                                            }}
                                            className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold transition ${active
                                                ? "border-[#182322] bg-[#D9A441] text-white shadow-sm"
                                                : "border-[#E8D9AE] bg-[#FFF8DC] text-[#3A3326]/55 hover:border-[#B8860B]/50 hover:text-[#C18B2C]"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}

                            </div>
                        </div>

                        {/* Bottom controls */}
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#B8860B]/15 pt-3">
                            <button
                                type="button"
                                onClick={() => setShowCategories((current) => !current)}
                                aria-expanded={showCategories}
                                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11px] font-black transition ${showCategories || activeCategory !== "all"
                                    ? "border-[#B8860B] bg-[#B8860B]/10 text-[#C18B2C]"
                                    : "border-[#E8D9AE] bg-[#FFF8DC] text-[#3A3326]/70 hover:border-[#B8860B]/50 hover:text-[#C18B2C]"
                                    }`}
                            >
                                <LayoutGrid size={14} />

                                <span>Categories</span>

                                <span className="rounded-full bg-[#D9A441]/5 px-1.5 py-0.5 text-[9px] font-black">
                                    {categoryList.length}
                                </span>

                                <ChevronRight
                                    size={13}
                                    className={`transition-transform duration-200 ${showCategories ? "rotate-90" : ""
                                        }`}
                                />
                            </button>

                            {filtersActive && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black text-[#C18B2C] transition hover:bg-[#B8860B]/10"
                                >
                                    <X size={12} />
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        {showCategories && (
                            <div className="mt-3 border-t border-[#B8860B]/15 pt-3">
                                <div className={`flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-x-visible ${hideScrollbar}`}>
                                    {/* ALL */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory("all")}
                                        aria-pressed={activeCategory === "all"}
                                        className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 transition-all ${activeCategory === "all"
                                            ? "border-[#182322] bg-[#D9A441] text-white shadow-[3px_3px_0_#FEDF24]"
                                            : "border-[#E8D9AE] bg-[#FFF8DC] text-[#3A3326]/60 hover:border-[#B8860B]/40"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${activeCategory === "all"
                                                ? "bg-[#FEDF24] text-[#3A3326]"
                                                : "bg-[#B8860B]/10 text-[#C18B2C]"
                                                }`}
                                        >
                                            <LayoutGrid size={16} />
                                        </span>

                                        <span>
                                            <span className="block text-xs font-extrabold">
                                                All
                                            </span>

                                            <span className="block text-[10px] font-semibold opacity-50">
                                                {events.length} events
                                            </span>
                                        </span>
                                    </button>

                                    {categoryList.map((category) => (
                                        <CategoryFilter
                                            key={category.key}
                                            category={category}
                                            count={category.count}
                                            active={activeCategory === category.key}
                                            onClick={() =>
                                                setActiveCategory(
                                                    activeCategory === category.key
                                                        ? "all"
                                                        : category.key
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ================================================================== */}
                {/* RESULTS STATUS                                                      */}
                {/* ================================================================== */}

                {filtersActive && (
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-[#3A3326]/45">
                                Showing
                            </span>

                            <span className="rounded-full bg-[#FEDF24] px-3 py-1 text-xs font-black">
                                {
                                    filteredEvents.length
                                }{" "}
                                events
                            </span>

                            {activeCategory !==
                                "all" && (
                                    <span className="rounded-full bg-[#B8860B] px-3 py-1 text-xs font-bold text-white">
                                        {
                                            getCategoryConfig(
                                                activeCategory
                                            ).name
                                        }
                                    </span>
                                )}
                        </div>

                        <button
                            type="button"
                            onClick={
                                resetFilters
                            }
                            className="text-xs font-extrabold text-[#C18B2C]"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                {/* ================================================================== */}
                {/* CATEGORY SECTIONS                                                   */}
                {/* ================================================================== */}

                <div className="mt-10">
                    {categoryList.map((category) => {
                        const categoryEvents = groupedEvents[category.key] || [];

                        return (
                            <div key={category.key} id={`category-${category.key}`}>
                                <CategorySection
                                    category={category}
                                    events={categoryEvents}
                                    onOpen={openEvent}
                                    interestedEvents={interestedEvents}
                                    onToggle={toggleInterested}
                                    onSeeAll={() => setActiveCategory(category.key)}
                                />
                            </div>
                        );
                    })}
                </div>
                {/* ================================================================== */}
                {/* EMPTY STATE                                                         */}
                {/* ================================================================== */}

                {filteredEvents.length ===
                    0 && (
                        <div className="mt-12 flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#B8860B]/25 bg-[#FFFDF5]/70 px-6 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FEDF24]">
                                <Ticket
                                    size={36}
                                />
                            </div>

                            <h2 className="mt-6 text-2xl font-extrabold">
                                No events found
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#3A3326]/55">
                                Try changing your
                                search, category,
                                or date filter to
                                discover more
                                events.
                            </p>

                            {filtersActive && (
                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="mt-6 rounded-full bg-[#D9A441] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#B8860B]"
                                >
                                    Show all events
                                </button>
                            )}
                        </div>
                    )}
            </div>
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
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF2D55]">
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
        </main>
    );
};

export default EventsPage;