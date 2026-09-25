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
    MapPin,
    Music,
    PartyPopper,
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

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "outsold_user_profile";
const SLIDE_INTERVAL = 5000;
const MAX_SLIDES = 5;

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85";

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap');";

const FONT_STYLE = {
    fontFamily: "'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, sans-serif",
};

const categories = [
    { name: "All", icon: LayoutGrid, text: "text-slate-700" },
    { name: "Music", icon: Music, text: "text-pink-600" },
    { name: "Comedy", icon: Laugh, text: "text-amber-600" },
    { name: "Business", icon: BriefcaseBusiness, text: "text-blue-600" },
    { name: "Party", icon: PartyPopper, text: "text-orange-600" },
    { name: "Workshop", icon: Wrench, text: "text-emerald-600" },
    { name: "Sports", icon: Trophy, text: "text-cyan-600" },
];

const dates = [
    "All Dates",
    "Today",
    "Tomorrow",
    "This Weekend",
    "This Month",
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

const getEventDateRange = (event) => {
    const start = formatEventDate(getEventStartDate(event));
    const end = formatEventDate(getEventEndDate(event));

    if (!start) return "Date TBA";
    if (!end || start === end) return start;

    return `${start} — ${end}`;
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

const getImage = (event) =>
    event?.image || FALLBACK_IMAGE;

const handleImageError = (e) => {
    if (e.currentTarget.src !== FALLBACK_IMAGE) {
        e.currentTarget.src = FALLBACK_IMAGE;
    }
};

const hideScrollbar =
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/* -------------------------------------------------------------------------- */
/*  Ticket pieces                                                             */
/* -------------------------------------------------------------------------- */

const Notch = ({
    tone = "plain",
    className = "",
}) => {
    const tones = {
        plain: "bg-[#fffdf5]",
        bordered: "bg-[#fffdf5] border border-[#44807F]/15",
        dark: "bg-[#182322]",
        page: "bg-[#fffdf5]",
    };
    return (
        <span
            aria-hidden="true"
            className={`absolute h-5 w-5 rounded-full ${tones[tone]} ${className}`}
        />
    );
};

const DateBlock = ({
    event,
    className = "",
}) => {
    const parts = getDateParts(event);

    return (
        <div
            className={`min-w-[3rem] text-center leading-none ${className}`}
        >
            {parts ? (
                <>
                    <p className="text-3xl font-extrabold tabular-nums text-[#44807F]">
                        {parts.day}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#182322]/70">
                        {parts.month}
                    </p>
                </>
            ) : (
                <p className="text-sm font-bold text-[#182322]/60">
                    Date TBA
                </p>
            )}
        </div>
    );
};

const SectionHeader = ({
    title,
    note,
    action,
    tone = "light",
}) => {
    const dark = tone === "dark";

    return (
        <div className="mb-6 flex items-end justify-between gap-4">
            <div className="min-w-0">
                <h3
                    className={`text-xl font-extrabold tracking-[-0.025em] sm:text-3xl ${dark
                        ? "text-[#fffdf5]"
                        : "text-[#182322]"
                        }`}
                >
                    {title}
                </h3>

                {note && (
                    <p
                        className={`mt-1 text-sm ${dark
                            ? "text-[#fffdf5]/60"
                            : "text-[#182322]/55"
                            }`}
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
            onKeyDown={(e) =>
                e.key === "Enter" &&
                onOpen(event)
            }
            aria-label={`View ${event.title || "event"
                }`}
            className={`group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl bg-[#fcf3cc] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(24,35,34,0.10)] focus-visible:ring-4 focus-visible:ring-[#FEDF24]`}
        >
            {/* IMAGE */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#e9ece7]">
                <img
                    src={getImage(event)}
                    alt={
                        event.title ||
                        "Event"
                    }
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={
                        handleImageError
                    }
                />

                {/* CATEGORY */}
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-[#182322] shadow-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs">
                    <CategoryIcon
                        size={11}
                        className={
                            style.text
                        }
                    />

                    {event.category ||
                        "Event"}
                </span>
            </div>

            {/* CARD CONTENT */}
            <div className="relative flex flex-col border-t-2 border-dashed border-[#182322]/15 p-2.5 sm:p-4">
                <Notch
                    tone="plain"
                    className="-left-2.5 -top-2.5"
                />

                <Notch
                    tone="plain"
                    className="-right-2.5 -top-2.5"
                />

                {/* DATE + TITLE */}
                <div className="flex items-start gap-2.5 sm:gap-4">
                    <DateBlock
                        event={event}
                        className="shrink-0 border-r border-[#182322]/10 pr-2.5 sm:pr-4 [&>p:first-child]:text-2xl sm:[&>p:first-child]:text-3xl [&>p:nth-child(2)]:mt-0.5 [&>p:nth-child(2)]:text-xs sm:[&>p:nth-child(2)]:text-sm"
                    />

                    <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-bold leading-snug tracking-[-0.01em] text-[#182322] sm:text-lg">
                            {event.title ||
                                "Untitled Event"}
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
                        <span>
                            Explore
                        </span>

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
                            onToggle?.(
                                event.id
                            );
                        }}
                        whileTap={{
                            scale: 0.88,
                        }}
                        aria-label={
                            interested
                                ? "Remove from interested"
                                : "Add to interested"
                        }
                        aria-pressed={
                            interested
                        }
                        className={`flex h-[34px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition duration-200 sm:h-[42px] sm:w-[46px] ${interested
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-[#182322]/20 bg-white text-[#182322] hover:border-red-400 hover:text-red-500"
                            }`}
                    >
                        <Heart
                            size={16}
                            fill={
                                interested
                                    ? "currentColor"
                                    : "none"
                            }
                            strokeWidth={
                                2.5
                            }
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
    const navigate =
        useNavigate();

    const reduceMotion =
        useReducedMotion();

    const [userName, setUserName] =
        useState("");

    const [
        selectedCategory,
        setSelectedCategory,
    ] = useState("All");

    const [
        selectedDate,
        setSelectedDate,
    ] = useState("All Dates");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        showFilters,
        setShowFilters,
    ] = useState(false);

    const [
        slideIndex,
        setSlideIndex,
    ] = useState(0);

    const [paused, setPaused] =
        useState(false);

    const [
        interestedEvents,
        setInterestedEvents,
    ] = useState([]);

    const {
        events: fetchedEvents = [],
    } = useOutsoldEvents();

    const events = useMemo(
        () =>
            Array.isArray(
                fetchedEvents
            )
                ? fetchedEvents.filter(
                    (event) =>
                        event &&
                        typeof event ===
                        "object"
                )
                : [],
        [fetchedEvents]
    );

    /* ---------------------------- user name --------------------------- */

    useEffect(() => {
        const readUserProfile =
            () => {
                try {
                    const savedProfile =
                        localStorage.getItem(
                            STORAGE_KEY
                        );

                    if (!savedProfile) {
                        setUserName("");
                        return;
                    }

                    const profile =
                        JSON.parse(
                            savedProfile
                        );

                    setUserName(
                        profile?.name?.trim() ||
                        ""
                    );
                } catch (error) {
                    console.error(
                        "User profile read error:",
                        error
                    );

                    setUserName("");
                }
            };

        readUserProfile();

        window.addEventListener(
            "locationChanged",
            readUserProfile
        );

        return () =>
            window.removeEventListener(
                "locationChanged",
                readUserProfile
            );
    }, []);

    /* ------------------------------- filtering ------------------------------- */

    const filteredEvents = useMemo(() => {
        const query =
            searchTerm
                .trim()
                .toLowerCase();

        const now = new Date();

        const todayOnly =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

        const tomorrow =
            new Date(todayOnly);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        const dayOfWeek =
            todayOnly.getDay();

        const weekendStart =
            new Date(todayOnly);

        weekendStart.setDate(
            weekendStart.getDate() +
            (dayOfWeek === 0
                ? 0
                : 6 - dayOfWeek)
        );

        const weekendEnd =
            new Date(
                weekendStart
            );

        if (dayOfWeek !== 0) {
            weekendEnd.setDate(
                weekendEnd.getDate() +
                1
            );
        }

        const monthStart =
            new Date(
                todayOnly.getFullYear(),
                todayOnly.getMonth(),
                1
            );

        const monthEnd =
            new Date(
                todayOnly.getFullYear(),
                todayOnly.getMonth() +
                1,
                0
            );

        const overlaps = (
            start,
            end,
            rangeStart,
            rangeEnd
        ) =>
            !!start &&
            !!end &&
            start <= rangeEnd &&
            end >= rangeStart;

        return events.filter(
            (event) => {
                const title =
                    String(
                        event.title || ""
                    ).toLowerCase();

                const category =
                    String(
                        event.category ||
                        ""
                    ).toLowerCase();

                const matchesSearch =
                    !query ||
                    title.includes(
                        query
                    ) ||
                    category.includes(
                        query
                    );

                const matchesCategory =
                    selectedCategory ===
                    "All" ||
                    category ===
                    selectedCategory.toLowerCase();

                const startDate =
                    toDateOnly(
                        getEventStartDate(
                            event
                        )
                    );

                const endDate =
                    toDateOnly(
                        getEventEndDate(
                            event
                        ) ||
                        startDate
                    );

                let matchesDate =
                    true;

                if (
                    selectedDate ===
                    "Today"
                )
                    matchesDate =
                        overlaps(
                            startDate,
                            endDate,
                            todayOnly,
                            todayOnly
                        );

                if (
                    selectedDate ===
                    "Tomorrow"
                )
                    matchesDate =
                        overlaps(
                            startDate,
                            endDate,
                            tomorrow,
                            tomorrow
                        );

                if (
                    selectedDate ===
                    "This Weekend"
                )
                    matchesDate =
                        overlaps(
                            startDate,
                            endDate,
                            weekendStart,
                            weekendEnd
                        );

                if (
                    selectedDate ===
                    "This Month"
                )
                    matchesDate =
                        overlaps(
                            startDate,
                            endDate,
                            monthStart,
                            monthEnd
                        );

                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesDate
                );
            }
        );
    }, [
        events,
        selectedCategory,
        selectedDate,
        searchTerm,
    ]);

    const isSearching =
        searchTerm.trim().length >
        0;

    const hasActiveFilters =
        selectedCategory !==
        "All" ||
        selectedDate !==
        "All Dates" ||
        searchTerm.length > 0;

    /* --------------------- slides / grid / interested ------------------- */

    const {
        slides,
        gridEvents,
        interestEvents,
    } = useMemo(() => {
        const featured = events.filter(
            (event) => event.featured
        );

        const slides = (
            featured.length
                ? featured
                : events
        ).slice(0, MAX_SLIDES);

        const slideIds = new Set(
            slides.map((event) => event.id)
        );

        const gridSource = hasActiveFilters
            ? filteredEvents
            : filteredEvents.filter(
                (event) => !slideIds.has(event.id)
            );

        const gridEvents = hasActiveFilters
            ? gridSource
            : gridSource.slice(0, 6);

        const gridIds = new Set(
            gridEvents.map(
                (event) => event.id
            )
        );

        const source = filteredEvents.length
            ? filteredEvents
            : events;

        const interestEvents = hasActiveFilters
            ? []
            : [
                ...source.filter(
                    (event) =>
                        !slideIds.has(event.id) &&
                        !gridIds.has(event.id)
                ),

                ...source.filter(
                    (event) =>
                        !slideIds.has(event.id) &&
                        gridIds.has(event.id)
                ),

                ...source.filter(
                    (event) =>
                        slideIds.has(event.id)
                ),
            ].slice(0, 2);

        return {
            slides,
            gridEvents,
            interestEvents,
        };
    }, [
        events,
        filteredEvents,
        hasActiveFilters,
    ]);

    /* -------------------------------- slideshow ------------------------------- */

    useEffect(() => {
        setSlideIndex(0);
    }, [
        selectedCategory,
        selectedDate,
        searchTerm,
    ]);

    const activeIndex =
        slides.length
            ? slideIndex %
            slides.length
            : 0;

    const currentSlide =
        slides[activeIndex];

    const currentParts =
        currentSlide
            ? getDateParts(
                currentSlide
            )
            : null;

    const autoplay =
        slides.length > 1 &&
        !paused &&
        !reduceMotion;

    useEffect(() => {
        if (!autoplay) return;

        const timer =
            setTimeout(() => {
                setSlideIndex(
                    (activeIndex + 1) %
                    slides.length
                );
            }, SLIDE_INTERVAL);

        return () =>
            clearTimeout(timer);
    }, [
        autoplay,
        activeIndex,
        slides.length,
    ]);

    const goToSlide = (
        index
    ) =>
        setSlideIndex(
            (index +
                slides.length) %
            slides.length
        );

    /* --------------------------------- actions -------------------------------- */

    const openEvent = (
        event
    ) => {
        const baseUrl =
            event?.subdomain
                ? `https://${event.subdomain}.outsold.in`
                : "https://app.outsold.in";

        const title = String(
            event?.title ||
            "event"
        );

        const eventId =
            String(
                event?.id || ""
            );

        const slug = title
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                "");

        window.location.href = `${baseUrl}/e/${slug || "event"
            }--${eventId}`;
    };

    const toggleInterested = (
        eventId
    ) => {
        setInterestedEvents(
            (current) =>
                current.includes(
                    eventId
                )
                    ? current.filter(
                        (id) =>
                            id !==
                            eventId
                    )
                    : [
                        ...current,
                        eventId,
                    ]
        );
    };

    const clearFilters =
        () => {
            setSelectedCategory(
                "All"
            );

            setSelectedDate(
                "All Dates"
            );

            setSearchTerm("");
        };

    /* ---------------------------------- render -------------------------------- */

    return (
        <section
            id="home"
            style={FONT_STYLE}
            className="relative overflow-hidden bg-[#fffdf5] pt-28 text-[#182322] sm:pt-32"
        >
            <style>
                {FONT_IMPORT}
            </style>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

            {/* MAIN CONTENT PARENT */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* HERO HEADING */}
                <h1 className="mx-auto flex max-w-full items-center justify-center gap-3 whitespace-nowrap text-center text-[30px] font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                    <span className="min-w-0 truncate">
                        Hey!{" "}
                        {userName ||
                            "Explorer"}
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
                                    rotate: [
                                        0,
                                        14,
                                        -8,
                                        14,
                                        -4,
                                        10,
                                        0,
                                    ],
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
                <div className="mx-auto mt-7 max-w-3xl sm:mt-9">
                    <div className="flex items-center gap-2 rounded-full border-2 border-[#182322] bg-white py-1.5 pl-5 pr-1.5 shadow-[5px_5px_0_#FEDF24]">
                        <Search
                            size={20}
                            className="shrink-0 text-[#44807F]"
                        />

                        <input
                            value={
                                searchTerm
                            }
                            onChange={(
                                e
                            ) =>
                                setSearchTerm(
                                    e
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search events or categories"
                            aria-label="Search events"
                            className="min-w-0 flex-1 bg-transparent py-2 text-base font-medium text-[#182322] outline-none placeholder:text-[#182322]/40"
                        />

                        {searchTerm && (
                            <button
                                onClick={() =>
                                    setSearchTerm(
                                        ""
                                    )
                                }
                                className="rounded-full p-2 text-[#182322]/50 transition hover:bg-[#182322]/5 hover:text-[#182322]"
                                aria-label="Clear search"
                            >
                                <X
                                    size={
                                        16
                                    }
                                />
                            </button>
                        )}

                        <button
                            onClick={() =>
                                setShowFilters(
                                    (
                                        value
                                    ) =>
                                        !value
                                )
                            }
                            aria-expanded={
                                showFilters
                            }
                            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${showFilters ||
                                selectedCategory !==
                                "All"
                                ? "bg-[#44807F] text-white"
                                : "bg-[#182322] text-white hover:bg-[#44807F]"
                                }`}
                        >
                            <SlidersHorizontal
                                size={
                                    15
                                }
                            />

                            {selectedCategory ===
                                "All"
                                ? "Category"
                                : selectedCategory}
                        </button>
                    </div>

                    {/* CATEGORY PANEL */}
                    <AnimatePresence
                        initial={false}
                    >
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
                                    {categories.map(
                                        (
                                            category
                                        ) => {
                                            const Icon =
                                                category.icon;

                                            const selected =
                                                selectedCategory ===
                                                category.name;

                                            return (
                                                <button
                                                    key={
                                                        category.name
                                                    }
                                                    onClick={() =>
                                                        setSelectedCategory(
                                                            category.name
                                                        )
                                                    }
                                                    aria-pressed={
                                                        selected
                                                    }
                                                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${selected
                                                        ? "border-[#182322] bg-[#182322] text-white"
                                                        : "border-[#182322]/15 bg-white text-[#182322]/75 hover:border-[#182322]/40"
                                                        }`}
                                                >
                                                    <Icon
                                                        size={
                                                            15
                                                        }
                                                        className={
                                                            selected
                                                                ? "text-[#FEDF24]"
                                                                : category.text
                                                        }
                                                    />

                                                    {
                                                        category.name
                                                    }
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DATE TABS */}
                    <div
                        className={`mt-5 flex items-center gap-1.5 overflow-x-auto sm:justify-center ${hideScrollbar}`}
                    >
                        {dates.map(
                            (date) => {
                                const selected =
                                    selectedDate ===
                                    date;

                                return (
                                    <button
                                        key={
                                            date
                                        }
                                        onClick={() =>
                                            setSelectedDate(
                                                date
                                            )
                                        }
                                        aria-pressed={
                                            selected
                                        }
                                        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${selected
                                            ? "bg-[#182322] text-white"
                                            : "text-[#182322]/60 hover:bg-[#182322]/5 hover:text-[#182322]"
                                            }`}
                                    >
                                        {
                                            date
                                        }
                                    </button>
                                );
                            }
                        )}

                        {hasActiveFilters && (
                            <button
                                onClick={
                                    clearFilters
                                }
                                className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-[#44807F] transition hover:bg-[#44807F]/10"
                            >
                                <X
                                    size={
                                        14
                                    }
                                />
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* EVENTS AREA */}
                <div
                    id="events"
                    className="scroll-mt-24"
                >

                    {/* FEATURED SLIDESHOW */}
                    {!hasActiveFilters &&
                        currentSlide && (
                            <div
                                className="mt-9 sm:mt-11"
                                onPointerEnter={(
                                    e
                                ) =>
                                    e.pointerType ===
                                    "mouse" &&
                                    setPaused(
                                        true
                                    )
                                }
                                onPointerLeave={(
                                    e
                                ) =>
                                    e.pointerType ===
                                    "mouse" &&
                                    setPaused(
                                        false
                                    )
                                }
                            >
                                <div className="relative grid min-h-[280px] grid-cols-[55%_45%] border-none overflow-hidden rounded-3xl bg-[#182322] shadow-[0_24px_60px_rgba(24,35,34,0.14)] sm:min-h-[420px] lg:min-h-[500px] lg:grid-cols-[minmax(0,1fr)_400px]">

                                    {/* IMAGE */}
                                    <div
                                        onClick={() =>
                                            openEvent(
                                                currentSlide
                                            )
                                        }
                                        className="relative h-full min-h-[280px] cursor-pointer overflow-hidden sm:min-h-[420px] lg:h-auto"
                                    >
                                        <AnimatePresence
                                            initial={
                                                false
                                            }
                                        >
                                            <motion.img
                                                key={
                                                    currentSlide.id ??
                                                    activeIndex
                                                }
                                                src={getImage(
                                                    currentSlide
                                                )}
                                                alt={
                                                    currentSlide.title ||
                                                    "Featured event"
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    scale:
                                                        reduceMotion
                                                            ? 1
                                                            : 1.08,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    opacity: {
                                                        duration:
                                                            reduceMotion
                                                                ? 0
                                                                : 0.7,
                                                    },
                                                    scale: {
                                                        duration: 7,
                                                        ease: "linear",
                                                    },
                                                }}
                                                className="absolute inset-0 h-full w-full object-cover"
                                                onError={
                                                    handleImageError
                                                }
                                            />
                                        </AnimatePresence>

                                        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#182322]/85 px-2.5 py-1 text-xs font-bold text-[#FEDF24] backdrop-blur-md sm:left-6 sm:top-6 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm">
                                            <Sparkles
                                                size={
                                                    13
                                                }
                                            />
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
                                            className="-right-2.5 -top-2.5 lg:left-[-10px] lg:right-auto lg:top-auto lg:-bottom-2.5"
                                        />

                                        {/* CONTROLS */}
                                        {slides.length >
                                            1 && (
                                                <div className="absolute right-3 top-5 z-10 flex items-center gap-1 sm:right-8 sm:top-8 sm:gap-2">
                                                    <button
                                                        onClick={() =>
                                                            goToSlide(
                                                                activeIndex -
                                                                1
                                                            )
                                                        }
                                                        aria-label="Previous event"
                                                        className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-[#182322] transition hover:bg-[#182322] hover:text-[#FEDF24] sm:h-9 sm:w-9"
                                                    >
                                                        <ChevronLeft
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <span className="min-w-[2rem] text-center text-[10px] font-bold tabular-nums sm:min-w-[2.5rem] sm:text-sm">
                                                        {activeIndex +
                                                            1}
                                                        /
                                                        {
                                                            slides.length
                                                        }
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            goToSlide(
                                                                activeIndex +
                                                                1
                                                            )
                                                        }
                                                        aria-label="Next event"
                                                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#182322] transition hover:bg-[#182322] hover:text-[#FEDF24] sm:h-9 sm:w-9"
                                                    >
                                                        <ChevronRight
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            )}

                                        <AnimatePresence
                                            mode="wait"
                                            initial={
                                                false
                                            }
                                        >
                                            <motion.div
                                                key={
                                                    currentSlide.id ??
                                                    activeIndex
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    y: reduceMotion
                                                        ? 0
                                                        : 14,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: reduceMotion
                                                        ? 0
                                                        : -8,
                                                }}
                                                transition={{
                                                    duration:
                                                        reduceMotion
                                                            ? 0
                                                            : 0.25,
                                                }}
                                                className="flex flex-1 flex-col"
                                            >
                                                <span className="inline-flex w-fit items-center rounded-full border-2 border-[#182322] px-2.5 py-0.5 text-[10px] font-bold sm:px-3 sm:py-1 sm:text-sm">
                                                    {currentSlide.category ||
                                                        "Event"}
                                                </span>

                                                {/* DATE */}
                                                <div className="mt-4 flex items-end gap-2 sm:mt-7 sm:gap-4">
                                                    {currentParts ? (
                                                        <>
                                                            <p className="text-5xl font-extrabold leading-[0.85] tracking-[-0.05em] tabular-nums sm:text-8xl">
                                                                {
                                                                    currentParts.day
                                                                }
                                                            </p>

                                                            <div className="pb-1 leading-tight">
                                                                <p className="text-sm font-bold sm:text-xl">
                                                                    {
                                                                        currentParts.month
                                                                    }
                                                                </p>

                                                                <p className="text-[9px] font-medium text-[#182322]/70 sm:text-sm">
                                                                    {
                                                                        currentParts.weekday
                                                                    }

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

                                                {currentSlide.location && (
                                                    <p className="mt-2 flex items-start gap-1.5 text-[10px] font-medium leading-snug sm:mt-3 sm:gap-2 sm:text-sm">
                                                        <MapPin
                                                            size={
                                                                13
                                                            }
                                                            className="mt-0.5 shrink-0 sm:h-4 sm:w-4"
                                                        />

                                                        <span className="min-w-0 break-words whitespace-normal">
                                                            {
                                                                currentSlide.location
                                                            }
                                                        </span>
                                                    </p>
                                                )}

                                                <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-7">
                                                    <div>
                                                        <p className="text-[9px] font-medium text-[#182322]/65 sm:text-xs">
                                                            Starting
                                                            from
                                                        </p>

                                                        <p className="text-sm font-extrabold sm:text-xl">
                                                            {currentSlide.price ||
                                                                "Free"}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 sm:gap-2.5">
                                                        {/* EXPLORE BUTTON */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEvent(currentSlide);
                                                            }}
                                                            className="flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#182322] px-3 py-2 text-[11px] font-bold text-[#FEDF24] transition duration-200 hover:bg-[#44807F] hover:text-white sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-sm"
                                                        >
                                                            <span>
                                                                Explore
                                                            </span>

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
                                                            whileTap={{
                                                                scale: 0.88,
                                                            }}
                                                            aria-label={
                                                                interestedEvents.includes(currentSlide.id)
                                                                    ? "Remove from interested"
                                                                    : "Add to interested"
                                                            }
                                                            aria-pressed={interestedEvents.includes(
                                                                currentSlide.id
                                                            )}
                                                            className={`flex h-[34px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-md border transition duration-200 sm:h-[42px] sm:w-[46px] ${interestedEvents.includes(currentSlide.id)
                                                                ? "border-red-500 bg-red-500 text-white"
                                                                : "border-[#182322] bg-transparent text-[#182322] hover:border-red-400 hover:text-red-500"
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

                                {/* UP NEXT */}
                                {slides.length >
                                    1 && (
                                        <div
                                            className={`mt-4 flex gap-3 overflow-x-auto pb-1 ${hideScrollbar}`}
                                        >
                                            {slides.map(
                                                (
                                                    slide,
                                                    i
                                                ) => {
                                                    const active =
                                                        i ===
                                                        activeIndex;

                                                    return (
                                                        <button
                                                            key={
                                                                slide.id ??
                                                                i
                                                            }
                                                            onClick={() =>
                                                                goToSlide(
                                                                    i
                                                                )
                                                            }
                                                            aria-label={`Show ${slide.title ||
                                                                "event"
                                                                }`}
                                                            aria-current={
                                                                active
                                                            }
                                                            className={`relative flex min-w-[200px] flex-1 items-center gap-3 overflow-hidden rounded-2xl border p-2.5 text-left transition-colors ${active
                                                                ? "border-[#182322] bg-white"
                                                                : "border-[#182322]/10 bg-white/50 hover:bg-white"
                                                                }`}
                                                        >
                                                            <img
                                                                src={getImage(
                                                                    slide
                                                                )}
                                                                alt=""
                                                                className="h-12 w-12 shrink-0 rounded-xl object-cover"
                                                                onError={
                                                                    handleImageError
                                                                }
                                                            />

                                                            <span className="min-w-0">
                                                                <span className="block truncate text-sm font-bold">
                                                                    {
                                                                        slide.title
                                                                    }
                                                                </span>

                                                                <span className="block truncate text-xs text-[#182322]/55">
                                                                    {getEventDateRange(
                                                                        slide
                                                                    )}
                                                                </span>
                                                            </span>

                                                            {active && (
                                                                <motion.span
                                                                    className="absolute bottom-0 left-0 h-1 w-full origin-left bg-[#44807F]"
                                                                    initial={{
                                                                        scaleX:
                                                                            reduceMotion
                                                                                ? 1
                                                                                : 0,
                                                                    }}
                                                                    animate={{
                                                                        scaleX:
                                                                            autoplay ||
                                                                                reduceMotion
                                                                                ? 1
                                                                                : 0,
                                                                    }}
                                                                    transition={{
                                                                        duration:
                                                                            autoplay
                                                                                ? SLIDE_INTERVAL /
                                                                                1000
                                                                                : 0.2,
                                                                        ease: "linear",
                                                                    }}
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}

                    {gridEvents.length >
                        0 && (
                            <div className="mt-10 sm:mt-20">
                                <SectionHeader
                                    title={
                                        isSearching
                                            ? `${filteredEvents.length} ${filteredEvents.length ===
                                                1
                                                ? "event"
                                                : "events"
                                            } found`
                                            : "Events you'll love"
                                    }
                                    action={
                                        !isSearching && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        "/all-events"
                                                    )
                                                }
                                                className="group flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-bold text-[#44807F] transition hover:text-[#182322] sm:text-base"
                                            >
                                                <span className="whitespace-nowrap">
                                                    Explore all events
                                                </span>

                                                <ArrowRight
                                                    size={
                                                        15
                                                    }
                                                    className="transition-transform group-hover:translate-x-1"
                                                />
                                            </button>
                                        )
                                    }
                                />

                                {/* DESKTOP: 6 = 3 + 3 | MOBILE: 4 = 2 + 2 */}
                                <div className="grid grid-cols-2 gap-1 sm:gap-6 lg:grid-cols-3">
                                    {gridEvents.map(
                                        (
                                            event,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    event.id ||
                                                    index
                                                }
                                                className={
                                                    index >=
                                                        4
                                                        ? "hidden lg:block"
                                                        : "block"
                                                }
                                            >
                                                <EventTicket
                                                    event={
                                                        event
                                                    }
                                                    onOpen={
                                                        openEvent
                                                    }
                                                    interested={interestedEvents.includes(
                                                        event.id
                                                    )}
                                                    onToggle={
                                                        toggleInterested
                                                    }

                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {/* OLD EXPLORE ALL EVENTS BUTTON - KEPT */}
                    {filteredEvents.length >
                        0 &&
                        !isSearching && (
                            <div className="mt-10 flex justify-center sm:mt-12">
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/all-events"
                                        )
                                    }
                                    className="group flex cursor-pointer items-center gap-3 rounded-md bg-[#182322] py-2 pl-7 pr-2 text-sm font-bold text-white transition hover:bg-[#44807F]"
                                >
                                    Explore all events

                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEDF24] text-[#182322] transition group-hover:translate-x-1">
                                        <ArrowRight
                                            size={
                                                16
                                            }
                                        />
                                    </span>
                                </button>
                            </div>
                        )}
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* YOU MIGHT BE INTO THIS                                            */}
            {/* ------------------------------------------------------------------ */}

            {!isSearching &&
                interestEvents.length >
                0 && (
                    <div className="relative mt-10 w-full bg-[#182322] px-5 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                        <div className="mx-auto w-full max-w-7xl">
                            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h3 className="text-2xl font-extrabold tracking-[-0.025em] text-[#fffdf5] sm:text-3xl">
                                        You might be into this
                                    </h3>

                                    <p className="mt-1 text-sm text-[#fffdf5]/60">
                                        Tap the heart to save the ones you like.
                                    </p>
                                </div>

                                <span className="w-fit rounded-full bg-[#FEDF24] px-3 py-1 text-xs font-bold text-[#182322] sm:hidden">
                                    Worth experiencing
                                </span>
                            </div>

                            {/* KEEPING THIS SECTION AT 2 CARDS */}
                            <div className="grid grid-cols-2 gap-1 sm:gap-5 lg:grid-cols-2">
                                {interestEvents.map(
                                    (
                                        event,
                                        index
                                    ) => (
                                        <EventTicket
                                            key={`interest-${event.id ||
                                                index
                                                }`}
                                            event={
                                                event
                                            }
                                            onOpen={
                                                openEvent
                                            }
                                            interested={interestedEvents.includes(
                                                event.id
                                            )}
                                            onToggle={
                                                toggleInterested
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

            {/* EMPTY STATE */}
            {filteredEvents.length ===
                0 && (
                    <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8 lg:px-10">
                        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#182322]/20 bg-white/60 px-6 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEDF24] text-[#182322]">
                                <Ticket
                                    size={
                                        30
                                    }
                                />
                            </div>

                            <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.02em]">
                                No events match these filters
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#182322]/60">
                                Try a different
                                search, date
                                or category.
                            </p>

                            <button
                                onClick={
                                    clearFilters
                                }
                                className="mt-6 rounded-full bg-[#182322] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#44807F]"
                            >
                                Reset filters
                            </button>
                        </div>
                    </div>
                )}
        </section>
    );
};

export default EventsHome;