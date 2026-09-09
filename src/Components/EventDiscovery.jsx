import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    CalendarDays,
    MapPin,
    ArrowUpRight,
    ArrowRight,
    SlidersHorizontal,
    X,
    Ticket,
    Music,
    Laugh,
    BriefcaseBusiness,
    PartyPopper,
    Wrench,
    Trophy,
    LayoutGrid,
    Check,
} from "lucide-react";

const events = [
    {
        id: 1,
        title: "Sunburn Arena",
        category: "Music",
        date: "Sep 14",
        location: "New Delhi",
        price: "₹999",
        image: "/event1.jpg",
        featured: true,
    },
    {
        id: 2,
        title: "Stand Up Comedy Night",
        category: "Comedy",
        date: "Sep 18",
        location: "Noida",
        price: "₹499",
        image: "/event2.jpg",
        featured: false,
    },
    {
        id: 3,
        title: "Startup & Innovation Summit",
        category: "Business",
        date: "Sep 22",
        location: "Gurugram",
        price: "₹1,499",
        image: "/event3.jpg",
        featured: true,
    },
    {
        id: 4,
        title: "Neon Nights Party",
        category: "Party",
        date: "Sep 27",
        location: "Delhi",
        price: "₹799",
        image: "/event4.jpg",
        featured: false,
    },
    {
        id: 5,
        title: "Design Thinking Workshop",
        category: "Workshop",
        date: "Oct 03",
        location: "New Delhi",
        price: "₹599",
        image: "/event5.jpg",
        featured: false,
    },
    {
        id: 6,
        title: "Championship Football Night",
        category: "Sports",
        date: "Oct 10",
        location: "Delhi",
        price: "₹1,299",
        image: "/event6.jpg",
        featured: true,
    },
];

const categories = [
    {
        name: "All",
        icon: LayoutGrid,
    },
    {
        name: "Music",
        icon: Music,
    },
    {
        name: "Comedy",
        icon: Laugh,
    },
    {
        name: "Business",
        icon: BriefcaseBusiness,
    },
    {
        name: "Party",
        icon: PartyPopper,
    },
    {
        name: "Workshop",
        icon: Wrench,
    },
    {
        name: "Sports",
        icon: Trophy,
    },
];

const dates = [
    "All Dates",
    "Today",
    "Tomorrow",
    "This Weekend",
    "This Month",
];

const EventDiscovery = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDate, setSelectedDate] = useState("All Dates");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesCategory =
                selectedCategory === "All" ||
                event.category === selectedCategory;

            const matchesSearch =
                event.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                event.location
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchTerm]);

    const clearFilters = () => {
        setSelectedCategory("All");
        setSelectedDate("All Dates");
        setSearchTerm("");
    };

    return (
        <section
            id="events"
            className="relative overflow-hidden bg-[#F4FAFA] py-14 text-[#102B2A] sm:py-20"
        >
            {/* Background Effects */}
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#48D1CC]/15 blur-[140px]" />

            <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#007A78]/10 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
                >
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#007A78]/15 bg-[#007A78]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#007A78]">
                            <Ticket size={15} />
                            Discover Experiences
                        </div>

                        <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-[#102B2A] sm:text-5xl lg:text-6xl">
                            Find Your Next

                            <span className="block bg-gradient-to-r from-[#007A78] via-[#00918E] to-[#20B2AA] bg-clip-text text-transparent">
                                Unforgettable Experience.
                            </span>
                        </h2>
                    </div>

                    <p className="max-w-md text-base leading-relaxed text-[#102B2A]/60 sm:text-lg">
                        Explore concerts, workshops, comedy shows, parties,
                        sports, and much more happening around you.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-8 md:mt-10 overflow-hidden rounded-[28px] border border-[#007A78]/10 bg-white p-4 shadow-xl shadow-[#007A78]/5 sm:p-6"
                >
                    {/* Top Search Row */}
                    <div className="flex flex-col gap-4 lg:flex-row">

                        {/* Search */}
                        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#007A78]/10 bg-[#F4FAFA] px-5 py-4 transition focus-within:border-[#007A78]/30 focus-within:shadow-lg focus-within:shadow-[#007A78]/5">
                            <Search
                                size={20}
                                className="shrink-0 text-[#007A78]"
                            />

                            <input
                                type="text"
                                placeholder="Search events, artists or locations..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="w-full bg-transparent text-sm text-[#102B2A] outline-none placeholder:text-[#102B2A]/40 sm:text-base"
                            />

                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="text-[#102B2A]/40 transition hover:text-[#007A78]"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Mobile Filter */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-[#007A78]/10 bg-[#F4FAFA] px-6 py-4 font-medium text-[#102B2A] transition hover:bg-[#007A78]/10 lg:hidden"
                        >
                            <SlidersHorizontal size={18} />
                            {showFilters ? "Hide Filters" : "Filters"}
                        </button>

                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="hidden items-center justify-center gap-2 rounded-2xl border border-[#007A78]/10 px-6 py-4 text-sm font-medium text-[#102B2A]/65 transition hover:bg-[#007A78]/5 hover:text-[#007A78] lg:flex"
                        >
                            <X size={17} />
                            Clear Filters
                        </button>
                    </div>

                    {/* Filters */}
                    <div
                        className={`mt-5 border-t border-[#007A78]/10 pt-6 ${
                            showFilters ? "block" : "hidden lg:block"
                        }`}
                    >
                        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.5fr]">

                            {/* Date Filters */}
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007A78]/10 text-[#007A78]">
                                        <CalendarDays size={17} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#102B2A]">
                                            When?
                                        </p>

                                        <p className="text-xs text-[#102B2A]/45">
                                            Choose your preferred date
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {dates.map((date) => (
                                        <button
                                            key={date}
                                            onClick={() =>
                                                setSelectedDate(date)
                                            }
                                            className={`rounded-xl cursor-pointer px-4 py-2.5 text-sm font-medium transition ${
                                                selectedDate === date
                                                    ? "bg-[#007A78] text-white shadow-lg shadow-[#007A78]/20"
                                                    : "border border-[#007A78]/10 bg-[#F4FAFA] text-[#102B2A]/60 hover:border-[#007A78]/20 hover:bg-[#007A78]/5 hover:text-[#007A78]"
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {selectedDate === date && (
                                                    <Check size={14} />
                                                )}
                                                {date}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filters */}
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#20B2AA]/10 text-[#007A78]">
                                        <SlidersHorizontal size={17} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#102B2A]">
                                            Explore by Category
                                        </p>

                                        <p className="text-xs text-[#102B2A]/45">
                                            Find experiences you love
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {categories.map((category) => {
                                        const Icon = category.icon;
                                        const isSelected =
                                            selectedCategory === category.name;

                                        return (
                                            <button
                                                key={category.name}
                                                onClick={() =>
                                                    setSelectedCategory(
                                                        category.name
                                                    )
                                                }
                                                className={`group cursor-pointer flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                                    isSelected
                                                        ? "border-[#007A78] bg-[#007A78] text-white shadow-lg shadow-[#007A78]/20"
                                                        : "border-[#007A78]/10 bg-[#F4FAFA] text-[#102B2A]/65 hover:border-[#007A78]/25 hover:bg-[#007A78]/5 hover:text-[#007A78]"
                                                }`}
                                            >
                                                <div
                                                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                                                        isSelected
                                                            ? "bg-white/15 text-white"
                                                            : "bg-white text-[#007A78]"
                                                    }`}
                                                >
                                                    <Icon size={15} />
                                                </div>

                                                {category.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Clear */}
                        <button
                            onClick={clearFilters}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#007A78]/10 py-3 text-sm font-medium text-[#102B2A]/60 transition hover:bg-[#007A78]/5 hover:text-[#007A78] lg:hidden"
                        >
                            <X size={16} />
                            Clear All Filters
                        </button>
                    </div>
                </motion.div>

                {/* Results Header */}
                <div className="mt-10 flex items-center justify-between">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold text-[#102B2A] sm:text-3xl"
                    >
                        Events You'll Love
                    </motion.h3>

                    <span className="rounded-full bg-[#007A78]/5 px-3 py-1.5 text-xs font-medium text-[#007A78] sm:text-sm">
                        {filteredEvents.length} Events Found
                    </span>
                </div>

                {/* Event Cards */}
                <motion.div
                    layout
                    className="mt-4 grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event, index) => (
                            <motion.article
                                layout
                                key={event.id}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                }}
                                transition={{
                                    duration: 0.45,
                                    delay: index * 0.08,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#007A78]/10 bg-white shadow-lg shadow-[#007A78]/5 transition-shadow hover:shadow-2xl hover:shadow-[#007A78]/10"
                            >
                                {/* Image */}
                                <div className="relative h-36 shrink-0 overflow-hidden sm:h-60">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                    />

                                    {/* Image Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                    {/* Category */}
                                    <span className="absolute left-2 top-2 rounded-full border border-white/30 bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#102B2A] backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
                                        {event.category}
                                    </span>

                                    {/* Featured */}
                                    {event.featured && (
                                        <span className="absolute right-2 top-2 rounded-full bg-[#20B2AA] px-2 py-1 text-[9px] font-bold text-white shadow-lg sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-grow flex-col p-3 sm:p-6">

                                    {/* Main Content */}
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <h4 className="text-sm font-semibold leading-tight text-[#102B2A] transition group-hover:text-[#007A78] sm:text-xl">
                                                {event.title}
                                            </h4>

                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#007A78]/10 bg-[#F4FAFA] text-[#007A78] transition group-hover:bg-[#007A78] group-hover:text-white sm:h-10 sm:w-10">
                                                <ArrowUpRight
                                                    size={14}
                                                    className="sm:h-[19px] sm:w-[19px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-1.5 text-[11px] text-[#102B2A]/55 sm:mt-4 sm:space-y-2 sm:text-sm">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays
                                                    size={14}
                                                    className="shrink-0 text-[#007A78] sm:h-4 sm:w-4"
                                                />
                                                {event.date}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MapPin
                                                    size={14}
                                                    className="shrink-0 text-[#007A78] sm:h-4 sm:w-4"
                                                />
                                                <span className="truncate">
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer - Fixed Bottom Position */}
                                    <div className="mt-auto flex items-center justify-between border-t border-[#007A78]/10 pt-3 sm:pt-5">
                                        <div>
                                            <span className="block text-[9px] text-[#102B2A]/40 sm:text-xs">
                                                Starting from
                                            </span>

                                            <span className="text-sm font-bold text-[#007A78] sm:text-lg">
                                                {event.price}
                                            </span>
                                        </div>

                                        <button className="shrink-0 rounded-full bg-[#007A78] px-3 py-2 text-[10px] font-semibold text-white shadow-md shadow-[#007A78]/15 transition hover:scale-105 hover:bg-[#00918E] sm:px-5 sm:py-2.5 sm:text-sm cursor-pointer">
                                            View Event
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* No Events */}
                {filteredEvents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-20 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#007A78]/20 bg-white py-20 text-center"
                    >
                        <Ticket
                            size={42}
                            className="text-[#007A78]"
                        />

                        <h3 className="mt-5 text-xl font-semibold text-[#102B2A]">
                            No events found
                        </h3>

                        <p className="mt-2 text-[#102B2A]/50">
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-full bg-[#007A78] px-6 py-3 font-medium text-white transition hover:bg-[#00918E]"
                        >
                            Reset Filters
                        </button>
                    </motion.div>
                )}

                {/* View All */}
                {filteredEvents.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 flex justify-center"
                    >
                        <button className="group flex items-center gap-3 rounded-full border border-[#007A78]/15 bg-white px-7 py-4 font-semibold text-[#007A78] shadow-lg shadow-[#007A78]/5 transition hover:bg-[#007A78] hover:text-white cursor-pointer">
                            Explore All Events

                            <ArrowRight
                                className="transition-transform duration-300 group-hover:translate-x-1"
                                size={19}
                            />
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default EventDiscovery;

