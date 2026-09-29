import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    Check,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Heart,
    Laugh,
    LayoutGrid,
    MapPin,
    Music,
    PartyPopper,
    Search,
    Ticket,
    Trophy,
    Wrench,
    X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useOutsoldEvents } from "../hooks/useOutsoldEvents";

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85";

const FONT_IMPORT =
    "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap');";

const FONT_STYLE = {
    fontFamily:
        "'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

const CATEGORIES = [
    {
        key: "music",
        name: "Music",
        icon: Music,
        bg: "#44807F",
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
        key: "party",
        name: "Party",
        icon: PartyPopper,
        bg: "#E85D75",
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

const getCategoryConfig = (category) => {
    const key = String(category || "other")
        .trim()
        .toLowerCase();

    return (
        CATEGORIES.find(
            (category) => category.key === key
        ) || {
            key,
            name:
                key.charAt(0).toUpperCase() +
                key.slice(1),
            icon: Ticket,
            bg: "#64748B",
            text: "#FFFFFF",
        }
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
        className={`absolute z-20 h-5 w-5 rounded-full bg-[#fffdf5] ${side === "left" ? "-left-2.5" : "-right-2.5"}`}
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
            className={`group flex shrink-0 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200 ${active ? "border-[#182322] -translate-y-0.5 shadow-[4px_4px_0_#FEDF24]" : "border-[#182322]/10 bg-white hover:-translate-y-0.5 hover:border-[#182322]/25"}`}
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
                    className={`block text-[11px] font-semibold ${active ? "opacity-80" : "text-[#182322]/45"}`}
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
            className="group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#44807F]/15 bg-white outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(24,35,34,0.10)] focus-visible:ring-4 focus-visible:ring-[#FEDF24]"
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#e9ece7]">
                <img src={getImage(event)} alt={event?.title || "Event"} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" onError={handleImageError} />

                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-[#182322] shadow-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs">
                    <CategoryIcon size={11} className={style.text || ""} />
                    {event?.category || "Event"}
                </span>
            </div>

            <div className="relative flex flex-col border-t-2 border-dashed border-[#182322]/15 p-2.5 sm:p-4">
                <TicketNotch side="left" />
                <TicketNotch side="right" />

                <div className="flex items-start gap-2.5 sm:gap-4">
                    <div className="shrink-0 border-r border-[#182322]/10 pr-2.5 text-center leading-none sm:pr-4">
                        {datePartsFor(event) ? (
                            <>
                                <p className="text-2xl font-extrabold tabular-nums text-[#44807F] sm:text-3xl">{datePartsFor(event).day}</p>
                                <p className="mt-0.5 text-xs font-semibold text-[#182322]/70 sm:text-sm">{datePartsFor(event).month}</p>
                            </>
                        ) : (
                            <p className="text-sm font-bold text-[#182322]/60">Date TBA</p>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-bold leading-snug tracking-[-0.01em] text-[#182322] sm:text-lg">{event?.title || "Untitled Event"}</h4>
                    </div>
                </div>

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
                        <span>Explore</span>
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
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-[#182322]/20 bg-white text-[#182322] hover:border-red-400 hover:text-red-500"
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

    const activeEvent = events[activeIndex];

    const goToSlide = (index) => {
        if (!events.length) return;

        const nextIndex = (index + events.length) % events.length;
        setActiveIndex(nextIndex);
    };

    const nextSlide = () => {
        goToSlide(activeIndex + 1);
    };

    const previousSlide = () => {
        goToSlide(activeIndex - 1);
    };

    useEffect(() => {
        if (events.length <= 1) return;

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % events.length);
        }, 4000);

        return () => window.clearInterval(timer);
    }, [events.length, activeIndex]);

    useEffect(() => {
        if (activeIndex >= events.length) {
            setActiveIndex(0);
        }
    }, [events.length, activeIndex]);

    if (!events.length || !activeEvent) return null;

    const categoryStyle = getCategoryConfig(activeEvent?.category);
    const CategoryIcon = categoryStyle.icon || Ticket;
    const isInterested = interestedEvents.includes(activeEvent?.id);

    return (
        <section className="relative -mx-4 mt-6 overflow-hidden md:rounded-3xl bg-[#182322] sm:-mx-7 lg:-mx-10">
            <div className="relative h-[350px] w-full overflow-hidden sm:h-[290px] lg:h-[500px]">
                <motion.img key={activeEvent?.id} src={getImage(activeEvent)} alt={activeEvent?.title || "Featured event"} onError={handleImageError} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="absolute inset-0 h-full w-full object-cover" />

                <div className="absolute inset-0 bg-gradient-to-r from-[#182322]/95 via-[#182322]/65 to-[#182322]/25" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#182322]/80 via-transparent to-transparent" />

                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-7 lg:px-10">
                    <motion.div key={`content-${activeEvent?.id}`} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="max-w-xl">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEDF24] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#182322]">
                                <CategoryIcon size={12} />
                                {activeEvent?.category || "Event"}
                            </span>
                        </div>

                        <h2 className="line-clamp-2 text-2xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                            {activeEvent?.title || "Featured Event"}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-white/75 sm:text-sm">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays size={14} />
                                {getDateRange(activeEvent)}
                            </span>

                            {activeEvent?.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    <span className="line-clamp-1 max-w-[220px]">{activeEvent.location}</span>
                                </span>
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-2.5">
                            <button type="button" onClick={() => onOpen(activeEvent)} className="flex items-center gap-1.5 rounded-lg bg-[#FEDF24] px-4 py-2.5 text-xs font-black text-[#182322] transition hover:bg-white sm:px-5 sm:py-3 sm:text-sm">
                                View event
                                <ArrowUpRight size={15} />
                            </button>

                            <motion.button type="button" onClick={() => onToggle?.(activeEvent?.id)} whileTap={{ scale: 0.96 }} aria-pressed={isInterested} className={`flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-xs font-black transition sm:px-5 sm:py-3 sm:text-sm ${isInterested ? "border-[#44807F] bg-[#44807F] text-white" : "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-[#182322]"}`}>
                                {isInterested ? <Check size={14} strokeWidth={3} /> : <Heart size={14} />}
                                {isInterested ? "Interested" : "I'm interested"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Featured label - top left */}
                <div className="absolute left-4 top-4 z-20 sm:left-7 sm:top-5 lg:left-10">
                    <span className="inline-flex items-center rounded-full border border-white/25 bg-[#182322]/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-md sm:px-5 sm:py-2.5 sm:text-sm">
                        Featured Event
                    </span>
                </div>

                {/* Featured Events Navigation */}
                {events.length > 1 && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-[200] flex justify-end px-4 pt-4 sm:px-7 sm:pt-5 lg:px-10">
                        <div className="pointer-events-auto flex items-center gap-2">
                            <button type="button" onClick={previousSlide} aria-label="Previous featured event" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/50 bg-[#182322]/90 text-white shadow-xl backdrop-blur-md transition hover:bg-[#FEDF24] hover:text-[#182322] sm:h-12 sm:w-12">
                                <ChevronLeft size={22} strokeWidth={2.7} />
                            </button>
                            <button type="button" onClick={nextSlide} aria-label="Next featured event" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/50 bg-[#182322]/90 text-white shadow-xl backdrop-blur-md transition hover:bg-[#FEDF24] hover:text-[#182322] sm:h-12 sm:w-12">
                                <ChevronRight size={22} strokeWidth={2.7} />
                            </button>
                        </div>
                    </div>
                )}

                {events.length > 1 && (
                    <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 sm:right-7">
                        {events.map((event, index) => (
                            <button key={event?.id || index} type="button" onClick={() => goToSlide(index)} aria-label={`Show featured event ${index + 1}`} className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-7 bg-[#FEDF24]" : "w-1.5 bg-white/50 hover:bg-white"}`} />
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

const CategorySection = ({ category, events, onOpen, onSeeAll, interestedEvents, onToggle }) => {
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
        <section className="mt-12 sm:mt-16">
            {/* Category heading */}
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
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

                            <span className="rounded-full bg-[#182322]/5 px-2 py-0.5 text-[10px] font-black text-[#182322]/45">
                                {events.length}
                            </span>
                        </div>

                        <p className="hidden text-xs text-[#182322]/45 sm:block">
                            More {category.name.toLowerCase()} events
                            to explore
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {events.length > PREVIEW_PER_CATEGORY && (
                        <button type="button" onClick={onSeeAll} className="flex items-center gap-1 text-xs font-extrabold text-[#44807F] transition hover:gap-2">
                            See all
                            <ArrowRight size={14} />
                        </button>
                    )}
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

                <span className="h-px flex-1 bg-[#182322]/8" />
            </div>

            {/* Cards + navigation */}
            <div className="relative px-0 sm:px-14">
                {events.length > 1 && (
                    <>
                        <button type="button" onClick={() => scroll("left")} aria-label={`Previous ${category.name} events`} className="absolute left-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 sm:flex items-center justify-center rounded-full border-2 border-[#182322]/15 bg-white text-[#182322] shadow-lg transition hover:border-[#182322] hover:bg-[#182322] hover:text-[#FEDF24] sm:h-11 sm:w-11">
                            <ChevronLeft size={18} strokeWidth={2.5} />
                        </button>

                        <button type="button" onClick={() => scroll("right")} aria-label={`Next ${category.name} events`} className="absolute right-0 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 sm:flex items-center justify-center rounded-full border-2 border-[#182322]/15 bg-white text-[#182322] shadow-lg transition hover:border-[#182322] hover:bg-[#182322] hover:text-[#FEDF24] sm:h-11 sm:w-11">
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
                            <div key={event?.id || `${category.key}-${index}`} className="w-[72%] min-w-[72%] shrink-0 snap-start sm:w-[43%] sm:min-w-[43%] md:w-[31.5%] md:min-w-[31.5%] lg:w-[23.5%] lg:min-w-[23.5%] xl:w-[21.5%] xl:min-w-[21.5%]">
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
    const [searchTerm, setSearchTerm] =
        useState("");

    const [activeCategory, setActiveCategory] =
        useState("all");

    const [dateFilter, setDateFilter] =
        useState("all");

    const [customFromDate, setCustomFromDate] = useState("");
    const [customToDate, setCustomToDate] = useState("");
    const [showCategories, setShowCategories] = useState(false);

    const [interestedEvents, setInterestedEvents] = useState([]);

    const { events: fetchedEvents = [] } =
        useOutsoldEvents();

    const events = useMemo(() => {
        if (!Array.isArray(fetchedEvents)) {
            return [];
        }

        const validEvents = fetchedEvents.filter(
            (event) =>
                event &&
                typeof event === "object"
        );

        // Remove duplicate records coming from the event source.
        // Prefer the event id; if an id is missing, use a stable
        // combination of title + category + date + location.
        const seen = new Set();

        return validEvents.filter((event) => {
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
    }, [fetchedEvents]);

    /* ---------------------------------------------------------------------- */
    /* Scroll reset                                                           */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* OPEN EVENT                                                              */
    /* ---------------------------------------------------------------------- */

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
            .replace(
                /^-+|-+$/g,
                ""
            );

        window.location.href =
            `${baseUrl}/e/${slug || "event"}--${eventId}`;
    };

    const toggleInterested = (eventId) => {
        setInterestedEvents((current) =>
            current.includes(eventId)
                ? current.filter((id) => id !== eventId)
                : [...current, eventId]
        );
    };

    /* ---------------------------------------------------------------------- */
    /* CATEGORY COUNTS                                                        */
    /* ---------------------------------------------------------------------- */

    const categoryList = useMemo(() => {
        const counts = {};

        events.forEach((event) => {
            const key = String(
                event?.category ||
                "other"
            )
                .trim()
                .toLowerCase();

            counts[key] =
                (counts[key] || 0) + 1;
        });

        const known =
            CATEGORIES.map(
                (category) => ({
                    ...category,
                    count:
                        counts[
                        category.key
                        ] || 0,
                })
            );

        const extras =
            Object.keys(counts)
                .filter(
                    (key) =>
                        !CATEGORIES.some(
                            (category) =>
                                category.key ===
                                key
                        )
                )
                .map((key) => ({
                    key,
                    name:
                        key
                            .charAt(0)
                            .toUpperCase() +
                        key.slice(1),
                    icon: Ticket,
                    count:
                        counts[key],
                    bg: "#64748B",
                    text: "#FFFFFF",
                }));

        return [
            ...known,
            ...extras,
        ];
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
        const query =
            searchTerm
                .trim()
                .toLowerCase();

        return events.filter(
            (event) => {
                const title =
                    String(
                        event?.title ||
                        ""
                    ).toLowerCase();

                const category =
                    String(
                        event?.category ||
                        "other"
                    )
                        .trim()
                        .toLowerCase();

                const location =
                    String(
                        event?.location ||
                        ""
                    ).toLowerCase();

                const matchesQuery =
                    !query ||
                    title.includes(
                        query
                    ) ||
                    category.includes(
                        query
                    ) ||
                    location.includes(
                        query
                    );

                const matchesCategory =
                    activeCategory ===
                    "all" ||
                    category ===
                    activeCategory;

                return (
                    matchesQuery &&
                    matchesCategory &&
                    matchesDate(event)
                );
            }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const featuredEvents =
        useMemo(() => {
            const flagged =
                events.filter(
                    (event) =>
                        event?.featured
                );

            return flagged.slice(
                0,
                MAX_FEATURED
            );
        }, [events]);

    /* ---------------------------------------------------------------------- */
    /* GROUP EVENTS BY CATEGORY                                               */
    /* ---------------------------------------------------------------------- */

    const groupedEvents =
        useMemo(() => {
            const groups = {};

            filteredEvents.forEach(
                (event) => {
                    const key =
                        String(
                            event?.category ||
                            "other"
                        )
                            .trim()
                            .toLowerCase();

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
    /* CATEGORY SEE ALL                                                       */
    /* ---------------------------------------------------------------------- */

    const selectCategory = (
        categoryKey
    ) => {
        setActiveCategory(
            categoryKey
        );

        window.setTimeout(() => {
            const section =
                document.getElementById(
                    `category-${categoryKey}`
                );

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 80);
    };

    /* ---------------------------------------------------------------------- */
    /* RENDER                                                                  */
    /* ---------------------------------------------------------------------- */

    return (
        <main
            style={FONT_STYLE}
            className="relative min-h-screen overflow-hidden bg-[#fffdf5] text-[#182322]"
        >
            <style>{FONT_IMPORT}</style>

            {/* Decorative blobs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[-150px] top-[180px] h-[350px] w-[350px] rounded-full bg-[#FEDF24]/15 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[-180px] top-[850px] h-[350px] w-[350px] rounded-full bg-[#44807F]/10 blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-1 sm:px-7 sm:pt-16 lg:px-10">
                {/* ================================================================== */}
                {/* FEATURED                                                             */}
                {/* ================================================================== */}

                {!searchTerm.trim() &&
                    activeCategory === "all" &&
                    dateFilter === "all" &&
                    !customFromDate &&
                    !customToDate &&
                    featuredEvents.length > 0 && (
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

                <header className="mb-8">
                    <div className="flex mt-4 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#182322]/10 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#44807F]">
                                <Ticket size={13} />
                                All events
                            </div>

                            <h1 className="rounded-2xl bg-[#44807F] px-5 py-3 text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] text-black sm:px-7 sm:py-4 sm:text-6xl">
                                Explore
                                <span className="ml-2 relative inline-block">
                                    events.
                                    <span className="absolute bottom-[-4px] left-0 h-2 w-full -rotate-1 rounded-full bg-[#FEDF24]" />
                                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#182322]/55 sm:text-base">
                                Everything happening
                                in one place. Find a
                                ticket, pick a date,
                                and make plans.
                            </p>
                        </div>
                    </div>
                </header>

                {/* ================================================================== */}
                {/* FILTER AREA                                                         */}
                {/* ================================================================== */}

                <section className="overflow-hidden rounded-[24px] border border-[#182322]/10 bg-white shadow-[0_12px_35px_rgba(24,35,34,0.06)]">
                    <div className="p-3 sm:p-4">
                        {/* Search */}
                        <div className="group flex items-center rounded-2xl border border-[#182322]/10 bg-[#fffdf5] px-3 py-1.5 transition focus-within:border-[#44807F] focus-within:ring-4 focus-within:ring-[#44807F]/10">
                            <Search size={18} className="shrink-0 text-[#44807F]" />

                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by event name, category or venue..."
                                aria-label="Search events by name, category or venue"
                                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-[#182322] outline-none placeholder:text-[#182322]/35"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                    aria-label="Clear search"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#182322]/40 transition hover:bg-[#182322]/5 hover:text-[#182322]"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {/* Quick date filters + custom range */}
                        <div className="mt-3 flex items-center gap-2 flex-wrap overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                            {DATE_FILTERS.map((option) => {
                                const active = !customFromDate && !customToDate && dateFilter === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() => {
                                            setDateFilter(option.key);
                                            setCustomFromDate("");
                                            setCustomToDate("");
                                        }}
                                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${active
                                            ? "border-[#182322] bg-[#182322] text-white shadow-sm"
                                            : "border-[#182322]/10 bg-[#fffdf5] text-[#182322]/55 hover:border-[#44807F]/40 hover:text-[#44807F]"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}

                            {/* From */}
                            <label
                                className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 transition ${customFromDate || customToDate
                                    ? "border-[#44807F] bg-[#44807F]/10"
                                    : "border-[#182322]/10 bg-[#fffdf5]"
                                    }`}
                            >
                                <span className="text-[9px] font-black uppercase tracking-wide text-[#182322]/45">
                                    From
                                </span>

                                <input
                                    type="date"
                                    value={customFromDate}
                                    onChange={(e) => {
                                        setCustomFromDate(e.target.value);
                                        setDateFilter("all");
                                    }}
                                    className="w-[40px] bg-transparent text-[10px] font-bold text-[#182322] outline-none"
                                    aria-label="From date"
                                />
                            </label>

                            {/* To */}
                            <label
                                className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 transition ${customFromDate || customToDate
                                    ? "border-[#44807F] bg-[#44807F]/10"
                                    : "border-[#182322]/10 bg-[#fffdf5]"
                                    }`}
                            >
                                <span className="text-[9px] font-black uppercase tracking-wide text-[#182322]/45">
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
                                    className="w-[40px] bg-transparent text-[10px] font-bold text-[#182322] outline-none"
                                    aria-label="To date"
                                />
                            </label>
                        </div>

                        {/* Bottom controls */}
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#182322]/6 pt-3">
                            <button
                                type="button"
                                onClick={() => setShowCategories((current) => !current)}
                                aria-expanded={showCategories}
                                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-black transition ${showCategories || activeCategory !== "all"
                                    ? "border-[#44807F] bg-[#44807F]/10 text-[#44807F]"
                                    : "border-[#182322]/10 bg-[#fffdf5] text-[#182322]/70 hover:border-[#44807F]/40 hover:text-[#44807F]"
                                    }`}
                            >
                                <LayoutGrid size={14} />

                                <span>Categories</span>

                                <span className="rounded-full bg-[#182322]/5 px-1.5 py-0.5 text-[9px] font-black">
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
                                    className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black text-[#44807F] transition hover:bg-[#44807F]/10"
                                >
                                    <X size={12} />
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        {showCategories && (
                            <div className="mt-3 border-t border-[#182322]/6 pt-3">
                                <div className={`flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-x-visible ${hideScrollbar}`}>
                                    {/* ALL */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategory("all")}
                                        aria-pressed={activeCategory === "all"}
                                        className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 transition-all ${activeCategory === "all"
                                            ? "border-[#182322] bg-[#182322] text-white shadow-[3px_3px_0_#FEDF24]"
                                            : "border-[#182322]/10 bg-[#fffdf5] text-[#182322]/60 hover:border-[#44807F]/30"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${activeCategory === "all"
                                                ? "bg-[#FEDF24] text-[#182322]"
                                                : "bg-[#44807F]/10 text-[#44807F]"
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
                            <span className="text-sm font-bold text-[#182322]/45">
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
                                    <span className="rounded-full bg-[#44807F] px-3 py-1 text-xs font-bold text-white">
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
                            className="text-xs font-extrabold text-[#44807F]"
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
                        <div className="mt-12 flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#182322]/15 bg-white/70 px-6 text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FEDF24]">
                                <Ticket
                                    size={36}
                                />
                            </div>

                            <h2 className="mt-6 text-2xl font-extrabold">
                                No events found
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#182322]/55">
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
                                    className="mt-6 rounded-full bg-[#182322] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#44807F]"
                                >
                                    Show all events
                                </button>
                            )}
                        </div>
                    )}
            </div>
        </main>
    );
};

export default EventsPage;
