import { AnimatePresence, motion } from "framer-motion";
import {
    Ticket,
    CalendarDays,
    ArrowRight,
    ArrowUpRight,
    Search,
    Heart,
    X,
    SlidersHorizontal,
    Check,
    MapPin,
    Sparkles,
    Music,
    Laugh,
    BriefcaseBusiness,
    PartyPopper,
    Wrench,
    Trophy,
    LayoutGrid,
} from "lucide-react";
import { useOutsoldEvents } from "../hooks/useOutsoldEvents";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
    { name: "All", icon: LayoutGrid, bg: "bg-slate-100", text: "text-slate-700", active: "bg-slate-900" },
    { name: "Music", icon: Music, bg: "bg-pink-100", text: "text-pink-600", active: "bg-pink-500" },
    { name: "Comedy", icon: Laugh, bg: "bg-amber-100", text: "text-amber-600", active: "bg-amber-500" },
    { name: "Business", icon: BriefcaseBusiness, bg: "bg-blue-100", text: "text-blue-600", active: "bg-blue-500" },
    { name: "Party", icon: PartyPopper, bg: "bg-orange-100", text: "text-orange-600", active: "bg-orange-500" },
    { name: "Workshop", icon: Wrench, bg: "bg-emerald-100", text: "text-emerald-600", active: "bg-emerald-500" },
    { name: "Sports", icon: Trophy, bg: "bg-cyan-100", text: "text-cyan-600", active: "bg-cyan-500" },
];

const dates = [
    { name: "All Dates", icon: LayoutGrid },
    { name: "Today", icon: CalendarDays },
    { name: "Tomorrow", icon: CalendarDays },
    { name: "This Weekend", icon: PartyPopper },
    { name: "This Month", icon: CalendarDays },
];

const formatEventDate = (value) => {
    if (!value) return "";

    const date = value?.toDate
        ? value.toDate()
        : value instanceof Date
            ? value
            : new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

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
    const startRaw = getEventStartDate(event);
    const endRaw = getEventEndDate(event);

    const start = formatEventDate(startRaw);
    const end = formatEventDate(endRaw);

    if (!start) return "Date TBA";
    if (!end || start === end) return start;

    return `${start} — ${end}`;
};

const EventDiscovery = () => {
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDate, setSelectedDate] = useState("All Dates");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [interestedEvents, setInterestedEvents] = useState([]);

    const AllEvents = () => {
        navigate('/all-events')
    }

    const { events: fetchedEvents = [] } = useOutsoldEvents();
    const events = Array.isArray(fetchedEvents)
        ? fetchedEvents.filter((event) => event && typeof event === "object")
        : [];

    const openEvent = (event) => {
        const baseUrl = event?.subdomain
            ? `https://${event.subdomain}.outsold.in`
            : "https://app.outsold.in";

        const title = String(event?.title || "event");
        const eventId = String(event?.id || "");

        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        window.location.href = `${baseUrl}/e/${slug || "event"}--${eventId}`;
    };

    const filteredEvents = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const getDateOnly = (value) => {
            if (!value) return null;

            const date = value?.toDate
                ? value.toDate()
                : value instanceof Date
                    ? value
                    : new Date(value);

            if (Number.isNaN(date.getTime())) return null;

            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
        };

        const today = new Date();
        const todayOnly = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const tomorrow = new Date(todayOnly);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekendEnd = new Date(todayOnly);
        const day = todayOnly.getDay();
        const daysUntilSunday = day === 0 ? 0 : 7 - day;
        weekendEnd.setDate(weekendEnd.getDate() + daysUntilSunday);

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

        return events.filter((event) => {
            const title = String(event.title || "").toLowerCase();
            const category = String(event.category || "").toLowerCase();

            const matchesSearch =
                !query ||
                title.includes(query) ||
                category.includes(query);

            const matchesCategory =
                selectedCategory === "All" ||
                category === selectedCategory.toLowerCase();

            const startDate = getDateOnly(getEventStartDate(event));
            const endDate =
                getDateOnly(getEventEndDate(event)) || startDate;

            let matchesDate = true;

            if (selectedDate === "Today") {
                matchesDate =
                    !!startDate &&
                    !!endDate &&
                    todayOnly >= startDate &&
                    todayOnly <= endDate;
            }

            if (selectedDate === "Tomorrow") {
                matchesDate =
                    !!startDate &&
                    !!endDate &&
                    tomorrow >= startDate &&
                    tomorrow <= endDate;
            }

            if (selectedDate === "This Weekend") {
                matchesDate =
                    !!startDate &&
                    !!endDate &&
                    startDate <= weekendEnd &&
                    endDate >= todayOnly;
            }

            if (selectedDate === "This Month") {
                matchesDate =
                    !!startDate &&
                    !!endDate &&
                    startDate <= monthEnd &&
                    endDate >= monthStart;
            }

            return matchesSearch && matchesCategory && matchesDate;
        });
    }, [events, selectedCategory, selectedDate, searchTerm]);

    const isSearching = searchTerm.trim().length > 0;

    const featuredEvent = isSearching
        ? null
        : filteredEvents.find((event) => event.featured) ||
        filteredEvents[0] ||
        null;

    const featuredId = featuredEvent?.id;

    const standardEvents = isSearching
        ? filteredEvents.slice(0, 6)
        : filteredEvents
            .filter((event) => event.id !== featuredId)
            .slice(0, 6);

    const fallbackInterestEvents = useMemo(() => {
        if (isSearching) return [];

        const source = filteredEvents.length
            ? filteredEvents
            : events;

        const withoutFeatured = source.filter(
            (event) => event.id !== featuredId
        );

        return withoutFeatured.slice(0, 2);
    }, [filteredEvents, events, featuredId, isSearching]);

    const toggleInterested = (eventId) => {
        setInterestedEvents((current) =>
            current.includes(eventId)
                ? current.filter((id) => id !== eventId)
                : [...current, eventId]
        );
    };

    const clearFilters = () => {
        setSelectedCategory("All");
        setSelectedDate("All Dates");
        setSearchTerm("");
    };

    const getCategoryStyle = (categoryName) =>
        categories.find(
            (category) =>
                category.name.toLowerCase() ===
                String(categoryName || "").toLowerCase()
        ) || categories[0];

    const getImage = (event) =>
        event?.image ||
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85";

    return (
        <section
            id="events"
            className="relative overflow-hidden bg-[#fffdf5] py-16 text-[#182322] sm:py-24"
        >
            {/* Soft logo-inspired background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-44 top-20 h-[520px] w-[520px] rounded-md bg-[#FEDF24]/25 blur-[130px]" />
                <div className="absolute right-[-180px] top-[22%] h-[560px] w-[560px] rounded-md bg-[#44807F]/12 blur-[150px]" />
                <div className="absolute bottom-[-220px] left-[28%] h-[520px] w-[520px] rounded-md bg-[#FEDF24]/18 blur-[140px]" />
                <div className="absolute left-[45%] top-[38%] h-[260px] w-[260px] rounded-md bg-white/90 blur-[80px]" />
            </div>

            {/* Smooth White Bottom Transition */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent sm:h-52" />
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65 }}
                    className="mx-auto max-w-4xl text-center"
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#44807F]/15 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#44807F] shadow-lg shadow-black/5 backdrop-blur">
                        <Ticket size={14} />
                        Discover Experiences
                    </div>

                    <h2 className="text-4xl font-black leading-[1.28] tracking-[-0.04em] text-[#161d1c] sm:text-5xl md:text-7xl">
                        Discover What's
                        <span className="block bg-gradient-to-r from-[#171d1c] via-[#44807F] to-[#44807F] bg-clip-text text-transparent">
                            Happening.
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#182322]/55 sm:text-base md:text-lg">
                        Find experiences worth remembering, from live
                        performances and celebrations to workshops, sports and
                        everything in between.
                    </p>
                </motion.div>

                {/* SEARCH + FILTER BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mx-auto mt-9 max-w-6xl"
                >
                    <div className="rounded-md border border-[#44807F]/15 bg-white/90 p-2 shadow-[0_15px_45px_rgba(30,50,45,0.08)] backdrop-blur-xl">
                        <div className="flex flex-col gap-2 lg:flex-row">
                            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md bg-gradient-to-r from-[#f8faf7] to-[#fffbea] px-4 py-3.5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEDF24] text-[#182322]">
                                    <Search size={19} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#44807F]">
                                        Search
                                    </p>
                                    <input
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Search events or categories..."
                                        className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#182322] outline-none placeholder:text-[#182322]/35"
                                    />
                                </div>

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="rounded-md bg-white p-2 text-[#182322]/40 shadow-sm transition hover:bg-[#FEDF24]/30 hover:text-[#44807F]"
                                        aria-label="Clear search"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center gap-2">
                                {dates.map((date) => {
                                    const Icon = date.icon;
                                    const selected =
                                        selectedDate === date.name;

                                    return (
                                        <button
                                            key={date.name}
                                            onClick={() =>
                                                setSelectedDate(date.name)
                                            }
                                            className={`flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${selected
                                                ? "border-[#44807F] bg-[#44807F] text-white shadow-md shadow-[#44807F]/20"
                                                : "border-[#44807F]/10 bg-white text-[#182322]/60 hover:border-[#FEDF24]/50 hover:bg-[#fffbea] hover:text-[#44807F]"
                                                }`}
                                        >
                                            <Icon size={15} />
                                            {date.name}
                                            {selected && <Check size={13} />}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setShowFilters((value) => !value)}
                                className={`flex shrink-0 items-center justify-center gap-2 rounded-md border px-5 py-2.5 text-xs font-black transition-all duration-200 ${showFilters
                                    ? "border-[#FEDF24] bg-[#FEDF24] text-[#182322]"
                                    : "border-[#182322] bg-[#182322] text-white hover:border-[#44807F] hover:bg-[#44807F]"
                                    }`}
                            >
                                <SlidersHorizontal size={16} />
                                Category
                            </button>
                        </div>

                        <AnimatePresence initial={false}>
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-2 border-t border-black/[0.05] rounded-md px-2 pt-3">
                                        <div className="flex flex-wrap justify-center gap-3 pb-1">
                                            {categories.map((category) => {
                                                const Icon = category.icon;
                                                const selected =
                                                    selectedCategory ===
                                                    category.name;

                                                return (
                                                    <button
                                                        key={category.name}
                                                        onClick={() =>
                                                            setSelectedCategory(
                                                                category.name
                                                            )
                                                        }
                                                        className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${selected
                                                            ? `${category.active} border-transparent text-white shadow-md`
                                                            : `border-black/[0.06] bg-white text-[#182322]/65 hover:-translate-y-0.5 hover:border-[#44807F]/20 hover:shadow-sm`
                                                            }`}
                                                    >
                                                        <span
                                                            className={`flex h-8 w-8 items-center justify-center rounded-md ${selected
                                                                ? "bg-white/20"
                                                                : `${category.bg} ${category.text}`
                                                                }`}
                                                        >
                                                            <Icon size={17} />
                                                        </span>
                                                        {category.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* ACTIVE FILTER */}
                {(selectedCategory !== "All" ||
                    selectedDate !== "All Dates" ||
                    searchTerm) && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex justify-center"
                        >
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 rounded-md border border-black/[0.06] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#44807F] shadow-sm transition hover:bg-[#FEDF24]/30"
                            >
                                <X size={13} />
                                Clear filters
                            </button>
                        </motion.div>
                    )}

                {/* FEATURED */}
                {featuredEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative left-1/2 mt-12 w-[100vw] -translate-x-1/2 sm:mt-16"
                    >
                        <div className="mb-5 flex justify-between gap-4 px-5 sm:px-8 lg:px-16">
                            <div>
                                <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#44807F]">
                                    <Sparkles size={13} />
                                    Featured
                                </div>
                                <h3 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
                                    The one to watch
                                </h3>
                            </div>

                            <span className="rounded-md bg-[#FEDF24] px-1 py-4 text-xs font-black sm:block">
                                {filteredEvents.length} experiences
                            </span>
                        </div>

                        <article
                            onClick={() => openEvent(featuredEvent)}
                            className="group relative min-h-[430px] cursor-pointer overflow-hidden bg-[#182322] shadow-[0_30px_80px_rgba(30,50,45,0.18)] sm:min-h-[500px] lg:min-h-[570px]"
                        >
                            <img
                                src={getImage(featuredEvent)}
                                alt={featuredEvent.title || "Featured event"}
                                className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-[1.04]"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=85";
                                }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                            <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-7 sm:top-7">
                                <span className="rounded-md bg-[#FEDF24] px-3 py-2 text-[9px] font-black uppercase tracking-wider text-[#182322]">
                                    Featured Event
                                </span>

                                {featuredEvent.category && (
                                    <span className="rounded-md border border-white/20 bg-black/20 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                                        {featuredEvent.category}
                                    </span>
                                )}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9 lg:max-w-3xl lg:p-12">
                                <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/75 sm:text-sm">
                                    {(featuredEvent.date ||
                                        featuredEvent.startDate ||
                                        featuredEvent.start_date) && (
                                            <span className="flex items-center gap-2">
                                                <CalendarDays size={15} />
                                                {getEventDateRange(featuredEvent)}
                                            </span>
                                        )}
                                    {featuredEvent.location && (
                                        <span className="flex items-center gap-2">
                                            <MapPin size={15} />
                                            {featuredEvent.location}
                                        </span>
                                    )}
                                </div>

                                <h4 className="max-w-3xl text-3xl font-black leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                                    {featuredEvent.title ||
                                        "An unforgettable experience"}
                                </h4>

                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    {featuredEvent.price && (
                                        <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
                                            <p className="text-[8px] font-bold uppercase tracking-wider text-white/50">
                                                Starting from
                                            </p>
                                            <p className="text-base font-black text-[#FEDF24]">
                                                {featuredEvent.price}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEvent(featuredEvent);
                                        }}
                                        className="flex items-center gap-2 rounded-2xl bg-[#FEDF24] px-5 py-3.5 text-xs font-black text-[#182322] shadow-xl transition hover:-translate-y-1 hover:bg-white sm:px-6"
                                    >
                                        View Event
                                        <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    </motion.div>
                )}

                {/* CURATED EVENTS */}
                {standardEvents.length > 0 && (
                    <section className="mt-14 sm:mt-20">
                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div>
                                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#44807F]">
                                    {isSearching ? "Search results" : "Curated for you"}
                                </p>
                                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                                    {isSearching
                                        ? `${filteredEvents.length} ${filteredEvents.length === 1 ? "Event" : "Events"} Found`
                                        : "Events You'll Love"}
                                </h3>
                            </div>

                            <button
                                onClick={() => navigate("/events")}
                                className="group flex items-center gap-2 rounded-md border border-black/[0.07] bg-white px-4 py-2.5 text-xs font-black text-[#182322] shadow-sm transition hover:border-[#44807F]/20 hover:bg-[#FEDF24]"
                            >
                                Explore All
                                <ArrowRight
                                    size={14}
                                    className="transition group-hover:translate-x-1"
                                />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 cursor-pointer">
                            {standardEvents.map((event, index) => {
                                const categoryStyle = getCategoryStyle(event.category);
                                const CategoryIcon = categoryStyle.icon;

                                return (
                                    <motion.article
                                        key={event.id || index}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.45,
                                            delay: index * 0.05,
                                        }}
                                        whileHover={{ y: -5 }}
                                        className="group min-w-0 overflow-hidden rounded-md border border-[#44807F]/10 bg-gradient-to-br from-[#fffbea] via-[#f9f8df] to-[#edf5ee] shadow-[0_10px_30px_rgba(68,128,127,0.08)]"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => openEvent(event)}
                                            className="relative block h-52 w-full overflow-hidden rounded-md bg-[#e9ece7] text-left outline-none sm:h-64 lg:h-72"
                                            aria-label={`View ${event.title || "event"}`}
                                        >
                                            <img
                                                src={getImage(event)}
                                                alt={event.title || "Event"}
                                                className="h-full cursor-pointer w-full object-cover transition duration-700 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80";
                                                }}
                                            />

                                            <span
                                                className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[9px] font-black text-white shadow-lg ${categoryStyle.active}`}
                                            >
                                                <CategoryIcon size={11} />
                                                {event.category || "Event"}
                                            </span>
                                        </button>

                                        <div className="px-1.5 pb-1.5 pt-4 text-[#182322]">
                                            <div className="flex items-start gap-2 text-[10px] font-bold uppercase leading-snug tracking-[0.06em] text-[#44807F] sm:text-xs">
                                                <CalendarDays
                                                    size={14}
                                                    className="mt-0.5 shrink-0"
                                                />
                                                <span className="min-w-0 break-words">
                                                    {getEventDateRange(event)}
                                                </span>
                                            </div>

                                            <h4 className="mt-2 line-clamp-2 text-base font-black leading-tight tracking-[-0.02em] text-[#182322] sm:text-xl">
                                                {event.title || "Untitled Event"}
                                            </h4>

                                            <div className="mt-3 flex items-start justify-between gap-2">
                                                <div className="flex min-w-0 items-start gap-2 text-[11px] leading-snug text-[#182322]/60 sm:text-sm">
                                                    <MapPin
                                                        size={14}
                                                        className="mt-0.5 shrink-0 text-[#44807F]"
                                                    />
                                                    <span className="min-w-0 break-words">
                                                        {event.location || "Location TBA"}
                                                    </span>
                                                </div>

                                                <span className="shrink-0 md:text-[18px] text-[14px] font-black text-[#44807F]">
                                                    {event.price || "Free"}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* I'M INTERESTED */}
                {fallbackInterestEvents.length > 0 && (
                    <section className="mt-16 sm:mt-24 cursor-pointer">
                        <div className="mb-7 flex items-end justify-between gap-4">
                            <div>
                                <p className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#44807F]">
                                    <Heart size={13} />
                                    Save your pick
                                </p>
                                <h3 className="text-2xl font-black tracking-tight text-[#182322] sm:text-3xl md:text-4xl">
                                    You Might Be Into This
                                </h3>
                            </div>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                            {fallbackInterestEvents.map((event, index) => {
                                const interested = interestedEvents.includes(
                                    event.id
                                );

                                return (
                                    <motion.article
                                        key={`interest-${event.id || index}`}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.08,
                                        }}
                                        className="group min-w-0"
                                    >
                                        {/* IMAGE CARD ONLY */}
                                        <button
                                            type="button"
                                            onClick={() => openEvent(event)}
                                            className="relative block h-[250px] w-full overflow-hidden rounded-md bg-[#e9ece7] text-left shadow-[0_18px_45px_rgba(30,50,45,0.09)] outline-none sm:h-[330px] lg:h-[380px] cursor-pointer"
                                            aria-label={`View ${event.title || "event"}`}
                                        >
                                            <img
                                                src={getImage(event)}
                                                alt={event.title || "Event"}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85";
                                                }}
                                            />

                                            <span className="absolute left-4 top-4 rounded-md bg-[#FEDF24] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#182322] shadow-sm">
                                                Worth experiencing
                                            </span>

                                            <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-white/90 text-[#182322] shadow-sm backdrop-blur-sm transition group-hover:bg-[#FEDF24]">
                                                <ArrowUpRight size={16} />
                                            </span>
                                        </button>

                                        {/* TEXT OUTSIDE IMAGE */}
                                        <div className="pt-4 text-[#182322]">
                                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#44807F] sm:text-xs">
                                                <CalendarDays
                                                    size={14}
                                                    className="shrink-0"
                                                />
                                                <span className="truncate">
                                                    {getEventDateRange(event)}
                                                </span>
                                            </div>

                                            <h4 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.02em] text-[#182322] sm:text-2xl">
                                                {event.title ||
                                                    "Something worth checking out"}
                                            </h4>

                                            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                                <div className="flex min-w-0 items-center gap-2 text-sm text-[#182322]/55">
                                                    <MapPin
                                                        size={15}
                                                        className="shrink-0 text-[#44807F]"
                                                    />
                                                    <span className="truncate">
                                                        {event.location ||
                                                            "Location TBA"}
                                                    </span>
                                                </div>

                                                <span className="shrink-0 text-lg font-black text-[#44807F]">
                                                    {event.price || "Free"}
                                                </span>
                                            </div>

                                            <div className="mt-5">
                                                <motion.button
                                                    type="button"
                                                    onClick={() => toggleInterested(event.id)}
                                                    whileTap={{ scale: 0.96 }}
                                                    className={`group/interest relative cursor-pointer inline-flex items-center gap-2 overflow-hidden rounded-md border px-5 py-2.5 text-xs font-black transition-all duration-300 ${interested
                                                        ? "border-[#44807F] bg-gradient-to-r from-[#44807F] to-[#65a58f] text-white shadow-[0_8px_20px_rgba(68,128,127,0.25)]"
                                                        : "border-[#FEDF24]/60 bg-gradient-to-r from-[#fff4a8] via-[#FEDF24] to-[#b8dca8] text-[#182322] shadow-sm hover:shadow-[0_8px_20px_rgba(68,128,127,0.15)]"
                                                        }`}
                                                >
                                                    <AnimatePresence mode="wait" initial={false}>
                                                        {interested ? (
                                                            <motion.span
                                                                key="check"
                                                                initial={{ scale: 0, rotate: -45 }}
                                                                animate={{ scale: 1, rotate: 0 }}
                                                                exit={{ scale: 0, rotate: 45 }}
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 500,
                                                                    damping: 20,
                                                                }}
                                                                className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20"
                                                            >
                                                                <Check size={12} strokeWidth={3} />
                                                            </motion.span>
                                                        ) : (
                                                            <motion.span
                                                                key="heart"
                                                                initial={{ scale: 0.8, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                exit={{ scale: 0.8, opacity: 0 }}
                                                            >
                                                                <Heart size={14} />
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>

                                                    <motion.span
                                                        key={interested ? "interested" : "default"}
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {interested ? "Interested" : "I'm Interested"}
                                                    </motion.span>

                                                    {!interested && (
                                                        <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover/interest:translate-x-full" />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* EMPTY STATE */}
                {!featuredEvent && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-12 flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-black/[0.06] bg-white/80 px-6 text-center shadow-xl"
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FEDF24]/50 text-[#44807F]">
                            <Ticket size={36} />
                        </div>

                        <h3 className="mt-6 text-2xl font-black">
                            No experiences found
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#182322]/50">
                            Try another search, date or category to discover
                            something new.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-md bg-[#182322] px-6 py-3 text-xs font-black text-white transition hover:bg-[#44807F]"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                )}

                {/* FINAL CTA */}
                {filteredEvents.length > 0 && !isSearching && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 flex justify-center sm:mt-20"
                    >
                        <button
                            onClick={AllEvents}
                            className="group flex cursor-pointer items-center gap-3 rounded-md bg-gradient-to-r from-[#44807F] to-[#65a58f] px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(68,128,127,0.20)] transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(68,128,127,0.30)] sm:px-9 sm:py-4.5"
                        >
                            Explore All Events
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FEDF24] text-[#182322] transition group-hover:translate-x-1">
                                <ArrowRight size={16} />
                            </span>
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default EventDiscovery;
