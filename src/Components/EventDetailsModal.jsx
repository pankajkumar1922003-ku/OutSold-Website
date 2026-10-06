import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    CalendarDays,
    Clock3,
    MapPin,
    ExternalLink,
    Tag,
} from "lucide-react";


const toValidDate = (value) => {
    if (!value) return null;

    try {
        let date;

        if (typeof value?.toDate === "function") {
            // Firebase Timestamp
            date = value.toDate();
        } else if (
            typeof value === "object" &&
            typeof value.seconds === "number"
        ) {
            // Timestamp object: { seconds, nanoseconds }
            date = new Date(
                value.seconds * 1000 +
                (value.nanoseconds || 0) / 1_000_000
            );
        } else if (value instanceof Date) {
            date = value;
        } else if (typeof value === "number") {
            // Unix seconds or milliseconds
            date = new Date(
                value < 100000000000 ? value * 1000 : value
            );
        } else if (typeof value === "string") {
            // Agar string mein Timestamp representation aa rahi ho
            const timestampMatch = value.match(
                /seconds\s*=\s*(\d+)/
            );

            if (timestampMatch) {
                date = new Date(
                    Number(timestampMatch[1]) * 1000
                );
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

/* --------------------------------------------------
   DESCRIPTION HELPER
-------------------------------------------------- */

const cleanDescription = (value) => {
    if (!value) return "";

    if (typeof value !== "string") return "";

    // Normal text ho toh as-is return karo
    if (!/<\/?[a-z][\s\S]*?>/i.test(value) && !/&(?:amp|lt|gt|quot|#\d+|#x[\da-f]+);/i.test(value)) {
        return value.trim();
    }

    try {
        // HTML formatting ko readable line breaks mein convert karo
        const formattedHtml = value
            .replace(/<\s*br\s*\/?>/gi, "\n")
            .replace(/<\/\s*(p|div|li|h[1-6]|blockquote)\s*>/gi, "\n")
            .replace(/<\s*li\b[^>]*>/gi, "• ");

        // Tags ko render kiye bina plain text nikalo
        const parsed = new DOMParser().parseFromString(
            formattedHtml,
            "text/html"
        );

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

/* --------------------------------------------------
   EVENT DETAILS MODAL
-------------------------------------------------- */

const EventDetailsModal = ({ event, isOpen, onClose }) => {
    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!event) return null;

    const startDate =
        event.startDate ||
        event.start_date ||
        event.eventStartDate ||
        event.date;

    const endDate =
        event.endDate ||
        event.end_date ||
        event.eventEndDate;

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const description = cleanDescription(event.description);

    const image =
        event.image ||
        event.coverImageDesktop ||
        event.coverImage ||
        event.coverImageUrl;

    const bookingUrl =
        event.bookingUrl ||
        event.ticketBookingUrl ||
        (event.source === "company" && event.id
            ? (() => {
                const title = String(event.title || "event");

                const slug = title
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                const baseUrl = event.subdomain
                    ? `https://${event.subdomain}.outsold.in`
                    : "https://app.outsold.in";

                return `${baseUrl}/e/${slug || "event"}--${event.id}`;
            })()
            : "");

    const hasDifferentEndDate =
        formattedEndDate &&
        formattedStartDate &&
        formattedEndDate !== formattedStartDate;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-[#182322]/60 p-3 backdrop-blur-sm sm:p-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${event.title || "Event"} details`}
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="relative flex max-h-[85vh] w-full max-w-[600px] flex-col overflow-hidden rounded-md border border-[#182322]/10 bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex shrink-0 items-center justify-between border-b border-[#182322]/10 px-4 py-3 sm:px-5">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#FEDF24]" />
                                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#44807F]">
                                    Event Details
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close event details"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#182322]/5 text-[#182322] transition hover:bg-[#182322] hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {image && (
                                <div className="relative mx-4 mt-4 h-[180px] overflow-hidden rounded-md bg-[#f3f5f4] sm:mx-5 sm:h-[240px]">
                                    {/* Blurred background fills the extra space */}
                                    <img
                                        src={image}
                                        alt=""
                                        aria-hidden="true"
                                        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-70"
                                    />

                                    {/* Full image visible without cropping */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img
                                            src={image}
                                            alt={event.title || "Event"}
                                            className="relative z-10 h-full w-full object-contain"
                                        />
                                    </div>

                                    {event.category && (
                                        <span className="absolute bottom-3 left-3 z-20 max-w-[85%] truncate rounded-md bg-[#FEDF24] px-3 py-1.5 text-[11px] font-extrabold text-[#182322]">
                                            {event.otherCategory || event.category}
                                        </span>
                                    )}
                                </div>
                            )}
                            <div className="px-4 py-4 sm:px-5 sm:py-5">
                                <h2 className="break-words text-xl font-black leading-tight text-[#182322] sm:text-2xl">
                                    {event.title || event.eventName || "Untitled Event"}
                                </h2>

                                {event.organizedBy && (
                                    <p className="mt-2 text-sm font-semibold text-[#182322]/55">
                                        Organized by{" "}
                                        <span className="font-extrabold text-[#44807F]">
                                            {event.organizedBy}
                                        </span>
                                    </p>
                                )}

                                {/* Event Information */}
                                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                    {formattedStartDate && (
                                        <div className="flex min-w-0 items-start gap-2.5 rounded-md border border-[#182322]/8 bg-[#f8faf9] p-3">
                                            <CalendarDays
                                                size={17}
                                                className="mt-0.5 shrink-0 text-[#44807F]"
                                            />

                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#182322]/45">
                                                    {hasDifferentEndDate
                                                        ? "Event Dates"
                                                        : "Event Date"}
                                                </p>

                                                <p className="mt-1 wrap-break-word text-sm font-bold text-[#182322]">
                                                    {formattedStartDate}

                                                    {hasDifferentEndDate &&
                                                        ` – ${formattedEndDate}`}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {event.price && (
                                        <div className="flex min-w-0 items-start gap-2.5 rounded-md border border-[#182322]/8 bg-[#f8faf9] p-3">
                                            <Tag
                                                size={17}
                                                className="mt-0.5 shrink-0 text-[#44807F]"
                                            />

                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#182322]/45">
                                                    Price
                                                </p>

                                                <p className="mt-1 break-words text-sm font-bold text-[#182322]">
                                                    Starts from ₹{String(event.price).replace(/^₹\s*/, "")}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {(event.venue || event.location) && (
                                        <div className="flex min-w-0 items-start gap-2.5 rounded-md border border-[#182322]/8 bg-[#f8faf9] p-3 sm:col-span-2">
                                            <MapPin
                                                size={17}
                                                className="mt-0.5 shrink-0 text-[#44807F]"
                                            />

                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#182322]/45">
                                                    Location
                                                </p>

                                                <p className="mt-1 break-words text-sm font-bold text-[#182322]">
                                                    {event.venue ||
                                                        event.location}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Clean Description */}
                                {description && (
                                    <div className="mt-5">
                                        <h3 className="flex items-center gap-2 text-sm font-black text-[#182322]">
                                            <Tag
                                                size={16}
                                                className="text-[#44807F]"
                                            />
                                            About this event
                                        </h3>

                                        <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-[#182322]/65">
                                            {description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex shrink-0 flex-row gap-2 border-t border-[#182322]/10 bg-white p-3.5 sm:justify-end sm:px-5">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 cursor-pointer rounded-md bg-[#182322]/10 px-5 py-3 text-sm font-bold text-black sm:flex-none"
                            >
                                Close
                            </button>

                            {bookingUrl ? (
                                <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#FEDF24] px-5 py-3 text-sm font-black text-[#182322] transition duration-200 hover:bg-[#44807F] hover:text-white sm:flex-none"
                                >
                                    Book Tickets
                                    <ExternalLink size={16} />
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="cursor-not-allowed rounded-md bg-[#182322]/10 px-5 py-3 text-sm font-bold text-[#182322]/40"
                                >
                                    Booking Unavailable
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EventDetailsModal;