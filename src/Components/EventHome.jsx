import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarDays,
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

/* Blurred copy of the image — fills the empty space around the full image
   with colors that match the image itself. */
const BlurBackdrop = ({ src, eager = false }) => (
    <>
        <img
            src={src}
            alt=""
            aria-hidden="true"
            loading={eager ? "eager" : "lazy"}
            draggable={false}
            onError={handleImageError}
            className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-90 blur-2xl"
        />
        <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white/10"
        />
    </>
);

const SectionHeader = ({ title, note, action }) => (
    <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
            <h3 className="text-xl font-extrabold tracking-[-0.025em] text-[#182322] sm:text-3xl">
                {title}
            </h3>

            {note && (
                <p className="mt-1 text-sm text-[#182322]/55">
                    {note}
                </p>
            )}
        </div>

        {action}
    </div>
);

/* -------------------------------------------------------------------------- */
/*  Event cards                                                               */
/* -------------------------------------------------------------------------- */

const EventCard = ({
    event,
    onOpen,
    interested = false,
    onToggle,
}) => {
    const start = toDate(getEventStartDate(event));
    const end = toDate(getEventEndDate(event));

    return (
        <article
            role="link"
            tabIndex={0}
            onClick={() => onOpen(event)}
            onKeyDown={(e) => e.key === "Enter" && onOpen(event)}
            aria-label={`View ${event.title || "event"}`}
            className="group flex h-full w-full min-w-0 cursor-pointer flex-col outline-none"
        >
            {/* IMAGE CARD */}
            <div
                className="
                    relative
                    aspect-[4/3]
                    overflow-hidden
                    rounded-lg
                    bg-[#e9ece7]
                    shadow-[0_10px_28px_rgba(24,35,34,0.07)]
                    transition
                    duration-300
                    group-hover:-translate-y-1
                    group-hover:shadow-[0_18px_38px_rgba(24,35,34,0.12)]
                "
            >
                <img
                    src={getImage(event)}
                    alt={event.title || "Event"}
                    loading="lazy"
                    draggable={false}
                    onError={handleImageError}
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-[1.03]
                    "
                />

                {/* WISHLIST HEART */}
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
                    className={`absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border bg-white/95 backdrop-blur-sm transition sm:right-4 sm:top-4 sm:h-10 sm:w-10 ${interested
                            ? "border-[#FF2D55] bg-[#FF2D55] text-white"
                            : "border-[#FF2D55]/25 text-[#FF2D55] hover:border-[#FF2D55] hover:bg-[#FFE8ED]"
                        }`}
                >
                    <Heart
                        size={16}
                        fill={interested ? "currentColor" : "none"}
                        strokeWidth={2.5}
                    />
                </motion.button>
            </div>

            {/* DETAILS */}
            <div className="px-1.5 pt-3.5 sm:px-2 sm:pt-4">

                {/* DATE */}
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#44807F] sm:text-[11px]">
                    {start ? formatEventDate(start) : "Date TBA"}
                    {end &&
                        start &&
                        end.toDateString() !== start.toDateString() && (
                            <>
                                {" - "}
                                {formatEventDate(end)}
                            </>
                        )}
                </div>

                {/* EVENT NAME */}
                <h4 className="line-clamp-2 text-sm font-extrabold leading-[1.15] tracking-[-0.02em] text-[#182322] sm:text-base">
                    {event.title || "Untitled Event"}
                </h4>

                {/* LOCATION / PRICE */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-[#182322]/60 sm:text-xs">
                    {event.location && (
                        <span className="truncate">
                            {event.location}
                        </span>
                    )}

                    {event.location && event.price && (
                        <span className="text-[#182322]/25">•</span>
                    )}

                    {event.price && (
                        <span className="text-[#182322]">
                            ₹{event.price}
                        </span>
                    )}
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
        const featured = events
            .filter(
                (event) =>
                    event?.displaySection === "featured" &&
                    !isEventExpired(event)
            )
            .slice(0, MAX_SLIDES);

        const fallbackFeatured = events
            .filter((event) => !isEventExpired(event))
            .slice(0, MAX_SLIDES);

        const slides = featured.length ? featured : fallbackFeatured;
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
            // 12 cards = 3 rows x 4 (desktop) / 3 rows x 4 (mobile)
            .slice(0, 12);

        const interestEvents = source
            .filter((event) => event?.displaySection === "recommended")
            .slice(0, 4);

        return {
            slides,
            gridEvents,
            interestEvents,
        };
    }, [events, filteredEvents, hasActiveFilters]);

    // Mobile rows: up to 3 rows, 4 cards each
    const mobileRows = useMemo(
        () =>
            Array.from(
                { length: Math.min(3, Math.ceil(gridEvents.length / 4)) },
                (_, rowIndex) =>
                    gridEvents.slice(rowIndex * 4, rowIndex * 4 + 4)
            ),
        [gridEvents]
    );

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
            className="relative overflow-hidden bg-white pt-28 text-[#182322] sm:pt-28"
        >
            <style>{FONT_IMPORT}</style>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

            {/* ================================================== */}
            {/* TOP: HEADING + DESKTOP SEARCH (padded container)     */}
            {/* ================================================== */}
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
            </div>

            {/* ================================================== */}
            {/* FEATURED EVENT — FULL WIDTH IMAGE CARD             */}
            {/* ================================================== */}
            <div
                id="events"
                className="relative z-10 mx-auto mt-5 w-full max-w-[1600px] scroll-mt-24 px-3 sm:mt-6 sm:px-6 lg:px-10"
            >
                {/* FEATURED LABEL */}
                <div className="mb-3 flex items-center gap-1.5 px-1 sm:mb-4 sm:px-2">
                    <Sparkles size={16} className="text-[#FEDF24]" />

                    <span className="text-sm font-extrabold tracking-tight text-[#182322] sm:text-base">
                        Featured
                    </span>
                </div>

                {currentSlide && (
                    <div
                        onPointerEnter={(e) =>
                            e.pointerType === "mouse" && setPaused(true)
                        }
                        onPointerLeave={(e) =>
                            e.pointerType === "mouse" && setPaused(false)
                        }
                        className="relative overflow-hidden rounded-lg bg-[#182322] shadow-[0_28px_70px_rgba(24,35,34,0.16)] sm:rounded-[32px]"
                    >
                        {/* ================================================== */}
                        {/* IMAGE / SLIDER                                    */}
                        {/* ================================================== */}
                        <motion.div
                            drag={slides.length > 1 ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.12}
                            style={{ touchAction: "pan-y" }}
                            onDragStart={() => setPaused(true)}
                            onDragEnd={(_, info) => {
                                setPaused(false);

                                if (info.offset.x < -60) {
                                    goToSlide(activeIndex + 1);
                                } else if (info.offset.x > 60) {
                                    goToSlide(activeIndex - 1);
                                }
                            }}
                            onTap={(e) => {
                                if (e.target.closest("button")) return;

                                openEvent(currentSlide);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    openEvent(currentSlide);
                                }
                            }}
                            aria-label={`Open ${currentSlide.title || "featured event"
                                }`}
                            className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-[#e9ece7] sm:aspect-[16/8] lg:aspect-[16/5]"
                        >
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={currentSlide.id ?? activeIndex}
                                    initial={{ opacity: 0, scale: 1.02 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.5,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0"
                                >
                                    <BlurBackdrop src={getImage(currentSlide)} eager />

                                    <img
                                        src={getImage(currentSlide)}
                                        alt={currentSlide.title || "Featured event"}
                                        loading="eager"
                                        decoding="async"
                                        draggable={false}
                                        onError={handleImageError}
                                        className="absolute inset-0 z-[1] h-full w-full object-contain"
                                    />

                                    <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                                </motion.div>
                            </AnimatePresence>

                            {/* ================================================== */}
                            {/* SLIDE COUNT                                        */}
                            {/* ================================================== */}
                            {slides.length > 1 && (
                                <span className="absolute right-4 top-4 z-20 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm sm:right-6 sm:top-6 sm:text-xs">
                                    {activeIndex + 1} / {slides.length}
                                </span>
                            )}

                            {/* ================================================== */}
                            {/* BOTTOM LEFT CONTENT                                */}
                            {/* ================================================== */}
                            <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white sm:p-7 lg:p-9">
                                <div className="max-w-3xl">

                                    {/* EVENT NAME */}
                                    <h2 className="line-clamp-2 text-xl font-black leading-[1.05] tracking-[-0.035em] sm:text-3xl lg:text-5xl">
                                        {currentSlide.title ||
                                            "An unforgettable experience"}
                                    </h2>

                                    {/* ================================================== */}
                                    {/* DATE + HEART                                      */}
                                    {/* ================================================== */}
                                    <div className="mt-2 flex items-center gap-2 sm:mt-3">

                                        {/* DATE */}
                                        <div className="flex items-center gap-2 text-xs font-semibold text-white/80 sm:text-sm">
                                            <CalendarDays
                                                size={15}
                                                className="shrink-0 text-[#FEDF24]"
                                            />

                                            {currentParts ? (
                                                <span>
                                                    {currentParts.day}{" "}
                                                    {currentParts.month}{" "}
                                                    {currentParts.weekday}

                                                    {currentParts.until &&
                                                        ` • till ${currentParts.until}`}
                                                </span>
                                            ) : (
                                                <span>Date TBA</span>
                                            )}
                                        </div>

                                        {/* HEART */}
                                        <motion.button
                                            type="button"
                                            onPointerDown={(e) =>
                                                e.stopPropagation()
                                            }
                                            onPointerUp={(e) =>
                                                e.stopPropagation()
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                toggleInterested(
                                                    currentSlide.id
                                                );
                                            }}
                                            whileTap={{ scale: 0.88 }}
                                            aria-label={
                                                interestedEvents.includes(
                                                    currentSlide.id
                                                )
                                                    ? "Remove from interested"
                                                    : "Add to interested"
                                            }
                                            aria-pressed={interestedEvents.includes(
                                                currentSlide.id
                                            )}
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition sm:h-9 sm:w-9 ${interestedEvents.includes(
                                                currentSlide.id
                                            )
                                                ? "border-[#FF2D55] bg-[#FF2D55] text-white"
                                                : "border-white/40 bg-black/30 text-white hover:border-[#FF2D55] hover:bg-[#FF2D55]"
                                                }`}
                                        >
                                            <Heart
                                                size={14}
                                                strokeWidth={2.5}
                                                fill={
                                                    interestedEvents.includes(
                                                        currentSlide.id
                                                    )
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                        </motion.button>
                                    </div>

                                    {/* ================================================== */}
                                    {/* DOTS — BOTTOM LEFT                              */}
                                    {/* ================================================== */}
                                    {slides.length > 1 && (
                                        <div className="mt-2 flex items-center gap-1.5">
                                            {slides.map((slide, index) => (
                                                <button
                                                    key={`featured-dot-${slide.id ?? index
                                                        }`}
                                                    type="button"
                                                    aria-label={`Go to featured event ${index + 1
                                                        }`}
                                                    onPointerDown={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onPointerUp={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        goToSlide(index);
                                                    }}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex
                                                        ? "w-7 bg-[#FEDF24]"
                                                        : "w-1.5 bg-white/40"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ================================================== */}
                            {/* LEFT / RIGHT ARROWS — ACTUAL BOTTOM RIGHT        */}
                            {/* ================================================== */}
                            {slides.length > 1 && (
                                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 sm:bottom-7 sm:right-7 lg:bottom-9 lg:right-9">

                                    {/* PREVIOUS */}
                                    <button
                                        type="button"
                                        onPointerDown={(e) =>
                                            e.stopPropagation()
                                        }
                                        onPointerUp={(e) =>
                                            e.stopPropagation()
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            goToSlide(activeIndex - 1);
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#182322] sm:h-10 sm:w-10"
                                        aria-label="Previous featured event"
                                    >
                                        <ChevronLeft size={17} />
                                    </button>

                                    {/* NEXT */}
                                    <button
                                        type="button"
                                        onPointerDown={(e) =>
                                            e.stopPropagation()
                                        }
                                        onPointerUp={(e) =>
                                            e.stopPropagation()
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            goToSlide(activeIndex + 1);
                                        }}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#182322] sm:h-10 sm:w-10"
                                        aria-label="Next featured event"
                                    >
                                        <ChevronRight size={17} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
            {/* ================================================== */}
            {/* SEARCH (mobile) + GRID (padded container)            */}
            {/* ================================================== */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

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

                        {/* MOBILE: 3 ROWS x 4 CARDS (+ explore card), HORIZONTAL SCROLL, ~1.5 VISIBLE */}
                        <div className="flex flex-col gap-5 sm:hidden">
                            {mobileRows.map((row, rowIndex) => (
                                <div
                                    key={`mobile-row-${rowIndex}`}
                                    className={`-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-5 px-5 pb-2 ${hideScrollbar}`}
                                >
                                    {row.map((event, index) => (
                                        <div
                                            key={event.id || `${rowIndex}-${index}`}
                                            className="flex w-[68%] min-w-[68%] shrink-0 snap-start"
                                        >
                                            <EventCard
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
                            ))}
                        </div>

                        {/* DESKTOP / TABLET: 12 CARDS = 3 ROWS x 4 */}
                        <div className="hidden grid-cols-2 gap-x-7 gap-y-9 sm:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10">
                            {gridEvents.map((event, index) => (
                                <div key={event.id || index} className="min-w-0">
                                    <EventCard
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

            </div>

            {/* EXPLORE ALL EVENTS — PAGE END */}
            <div className="mt-8 mb-8 flex w-full justify-center px-5">
                <button
                    type="button"
                    onClick={() => navigate("/all-events")}
                    className="group inline-flex items-center gap-2 rounded-full bg-[#182322] px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(24,35,34,0.12)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#44807F] hover:shadow-[0_14px_30px_rgba(24,35,34,0.18)] sm:px-8 sm:py-4 sm:text-base"
                >
                    <span>Explore all events</span>

                    <ArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                </button>
            </div>

            {/* ================================================== */}
            {/* WISHLIST / ORGANIZER CONNECTION */}
            {/* ================================================== */}

            <section className="relative mt-2 w-full overflow-hidden border-y border-[#44807F]/25 bg-[#071A16] px-4 py-8 text-[#F4F1E4] sm:mt-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">

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