import { useEffect, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
    X,
    CalendarDays,
    MapPin,
    ExternalLink,
    Tag,
    Download,
} from "lucide-react";
import html2canvas from "html2canvas";
import TicketDownloadTemplate from "./TicketDownloadTemplate";
import { useNavigate } from "react-router-dom";

/* =========================================================
   DATE HELPERS
========================================================= */

const toValidDate = (value) => {
    if (!value) return null;

    try {
        let date;

        if (typeof value?.toDate === "function") {
            date = value.toDate();
        } else if (
            typeof value === "object" &&
            typeof value.seconds === "number"
        ) {
            date = new Date(
                value.seconds * 1000 +
                (value.nanoseconds || 0) / 1_000_000
            );
        } else if (value instanceof Date) {
            date = value;
        } else if (typeof value === "number") {
            date = new Date(
                value < 100000000000
                    ? value * 1000
                    : value
            );
        } else if (typeof value === "string") {
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

        return Number.isNaN(date.getTime())
            ? null
            : date;
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


/* =========================================================
   DESCRIPTION CLEANER
========================================================= */

const cleanDescription = (value) => {
    if (!value) return "";

    if (typeof value !== "string") {
        return "";
    }

    if (
        !/<\/?[a-z][\s\S]*?>/i.test(value) &&
        !/&(?:amp|lt|gt|quot|#\d+|#x[\da-f]+);/i.test(value)
    ) {
        return value.trim();
    }

    try {
        const formattedHtml = value
            .replace(
                /<\s*br\s*\/?>/gi,
                "\n"
            )
            .replace(
                /<\/?\s*(p|div|li|h[1-6]|blockquote)\s*>/gi,
                "\n"
            )
            .replace(
                /<\s*li\b[^>]*>/gi,
                "• "
            );

        const parsed =
            new DOMParser().parseFromString(
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
        return value
            .replace(/<[^>]*>/g, "")
            .trim();
    }
};

const EventDetailsModal = ({
    event,
    isOpen,
    onClose,
}) => {

    const ticketDownloadRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, onClose]);


    if (!event) return null;


    /* =======================================================
       EVENT DATA
    ======================================================= */

    const startDate =
        event.startDate ||
        event.start_date ||
        event.eventStartDate ||
        event.date;

    const endDate =
        event.endDate ||
        event.end_date ||
        event.eventEndDate;

    const formattedStartDate =
        formatDate(startDate);

    const formattedEndDate =
        formatDate(endDate);

    const image =
        event.image ||
        event.coverImageDesktop ||
        event.coverImage ||
        event.coverImageUrl ||
        event.imageUrl;


    /* =======================================================
       BOOKING URL
    ======================================================= */

    const bookingUrl =
        event.bookingUrl ||
        event.ticketBookingUrl ||
        (
            event.source === "company" &&
                event.id
                ? (() => {
                    const title = String(
                        event.title || "event"
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
                            ""
                        );

                    const baseUrl =
                        event.subdomain
                            ? `https://${event.subdomain}.outsold.in`
                            : "https://app.outsold.in";

                    return `${baseUrl}/e/${slug || "event"
                        }--${event.id}`;
                })()
                : ""
        );


    const hasDifferentEndDate =
        formattedEndDate &&
        formattedStartDate &&
        formattedEndDate !==
        formattedStartDate;


    /* =======================================================
       BOOKING / TICKET DATA
    ======================================================= */

    const ticketId =
        event.ticketId ||
        event.ticketID ||
        event.ticketNumber ||
        event.id ||
        "TICKET";

    const tierName =
        event.tierName ||
        event.ticketTier ||
        event.ticketType ||
        event.categoryName ||
        "General";

    const attendeeName =
        event.attendeeName ||
        event.name ||
        event.userName ||
        event.customerName ||
        "Guest";

    const attendeeEmail =
        event.attendeeEmail ||
        event.email ||
        event.userEmail ||
        "";

    const attendeePhone =
        event.attendeePhone ||
        event.phone ||
        event.phoneNumber ||
        event.userPhone ||
        "";

    const ticketQuantity = Number(
        event.quantity ||
        event.ticketQuantity ||
        event.qty ||
        event.ticketsCount ||
        event.numberOfTickets ||
        1
    );

    const totalAmount =
        event.totalAmount ||
        event.totalPrice ||
        event.amountPaid ||
        event.paidAmount ||
        event.orderAmount ||
        event.price ||
        "";

    const paymentMethod =
        event.paymentMethod ||
        event.paymentMode ||
        event.paidVia ||
        "UPI";

    const bookingDate =
        event.bookedAt ||
        event.bookingDate ||
        event.createdAt ||
        event.purchasedAt ||
        new Date();

    const bookingDateText =
        formatDate(bookingDate);

    const accessCode =
        event.accessCode ||
        event.access_code ||
        "";

    const eventTime =
        event.startTime ||
        event.eventTime ||
        event.time ||
        formatTime(startDate);


    /* =======================================================
       DOWNLOAD HTML TICKET
    ======================================================= */

    const downloadTicket = async () => {
        const ticketElement =
            ticketDownloadRef.current;

        if (!ticketElement) {
            console.error(
                "Ticket download element not found."
            );
            return;
        }

        try {
            /*
             * Wait one frame so that QRCodeCanvas and
             * all HTML elements are completely rendered.
             */

            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });


            const canvas =
                await html2canvas(ticketElement, {
                    scale: 3,

                    useCORS: true,

                    allowTaint: false,

                    backgroundColor: "#F1F1EF",

                    logging: false,

                    imageTimeout: 15000,

                    width: ticketElement.scrollWidth,

                    height: ticketElement.scrollHeight,

                    windowWidth:
                        ticketElement.scrollWidth,

                    windowHeight:
                        ticketElement.scrollHeight,
                });


            const safeTitle = String(
                event.title ||
                event.eventName ||
                "event"
            )
                .replace(
                    /[^a-z0-9]+/gi,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    "");


            const safeTicketId =
                String(ticketId)
                    .replace(
                        /[^a-z0-9_-]+/gi,
                        "-"
                    )
                    .replace(
                        /^-+|-+$/g,
                        "");


            const link =
                document.createElement("a");

            link.href =
                canvas.toDataURL(
                    "image/jpeg",
                    0.96
                );

            link.download =
                `${safeTicketId}-${safeTitle}-ticket.jpg`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error(
                "Ticket download failed:",
                error
            );
        }
    };


    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <>
            {event?.isBooked && (
                <div
                    aria-hidden="true"
                    style={{
                        position: "fixed",
                        left: "-10000px",
                        top: "0",
                        width: "512px",
                        pointerEvents: "none",
                        zIndex: -1,
                    }}
                >
                    <TicketDownloadTemplate
                        ref={ticketDownloadRef}

                        ticketId={ticketId}

                        tierName={tierName}

                        attendeeName={attendeeName}

                        attendeeEmail={attendeeEmail}

                        attendeePhone={attendeePhone}

                        eventTitle={
                            event.title ||
                            event.eventName ||
                            "Event"
                        }

                        eventDate={startDate}

                        eventDay={
                            startDate
                                ? new Date(startDate).toLocaleDateString(
                                    "en-IN",
                                    {
                                        weekday: "long",
                                    }
                                )
                                : ""
                        }

                        eventTime={eventTime}

                        venue={
                            event.venue ||
                            event.location ||
                            ""
                        }

                        quantity={ticketQuantity}

                        totalAmount={totalAmount}

                        paymentMethod={paymentMethod}

                        bookingDate={bookingDateText}

                        eventImage={image}

                        generatedAt={
                            new Date().toLocaleString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                }
                            )
                        }
                    />
                </div>
            )}


            {/* ===================================================
          MODAL
      ==================================================== */}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#182322]/60 p-3 backdrop-blur-sm sm:p-5"
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onMouseDown={(e) => {
                            if (
                                e.target ===
                                e.currentTarget
                            ) {
                                onClose();
                            }
                        }}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${event.title || "Event"} details`}
                            initial={{
                                opacity: 0,
                                y: 18,
                                scale: 0.98,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: 12,
                                scale: 0.98,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="relative flex max-h-[85vh] w-full max-w-[600px] flex-col overflow-hidden rounded-md border border-[#182322]/10 bg-white shadow-2xl"
                        >
                            {/* =========================================
                  HEADER
              ========================================== */}

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


                            {/* =========================================
                  SCROLLABLE CONTENT
              ========================================== */}

                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {/* Event image */}

                                {image && (
                                    <div className="relative mx-4 mt-4 h-[180px] overflow-hidden rounded-md bg-[#f3f5f4] sm:mx-5 sm:h-[240px]">
                                        <img
                                            src={image}
                                            alt=""
                                            aria-hidden="true"
                                            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-70"
                                        />

                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <img
                                                src={image}
                                                alt={
                                                    event.title ||
                                                    "Event"
                                                }
                                                className="relative z-10 h-full w-full object-contain"
                                            />
                                        </div>

                                        {event.category && (
                                            <span className="absolute bottom-3 left-3 z-20 max-w-[85%] truncate rounded-md bg-[#FEDF24] px-3 py-1.5 text-[11px] font-extrabold text-[#182322]">
                                                {event.otherCategory ||
                                                    event.category}
                                            </span>
                                        )}
                                    </div>
                                )}


                                <div className="px-4 py-4 sm:px-5 sm:py-5">
                                    {/* Title */}

                                    <h2 className="break-words text-xl font-black leading-tight text-[#182322] sm:text-2xl">
                                        {event.title ||
                                            event.eventName ||
                                            "Untitled Event"}
                                    </h2>


                                    {/* Organized By */}

                                    {event.organizedBy && (
                                        <p className="mt-2 text-sm font-semibold text-[#182322]/55">
                                            Organized by{" "}
                                            <span className="font-extrabold text-[#44807F]">
                                                {event.organizedBy}
                                            </span>
                                        </p>
                                    )}


                                    {/* =====================================
                      EVENT INFO
                  ====================================== */}

                                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                        {/* Date */}

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

                                                    <p className="mt-1 break-words text-sm font-bold text-[#182322]">
                                                        {formattedStartDate}

                                                        {hasDifferentEndDate &&
                                                            ` – ${formattedEndDate}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}


                                        {/* Price */}

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
                                                        Starts from ₹
                                                        {String(
                                                            event.price
                                                        ).replace(
                                                            /^₹\s*/,
                                                            ""
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}


                                        {/* Location */}

                                        {(event.venue ||
                                            event.location) && (
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

                                    {event.isBooked && (
                                        <div className="mt-5 rounded-md border border-[#44807F]/15 bg-[#44807F]/5 p-4">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#182322]/45">
                                                Booking Details
                                            </p>

                                            <div className="mt-3 grid grid-cols-2 gap-3">
                                                {/* Ticket */}

                                                <div>
                                                    <p className="text-[10px] font-semibold text-[#182322]/45">
                                                        Ticket ID
                                                    </p>

                                                    <p className="mt-1 break-all text-xs font-black text-[#182322]">
                                                        {ticketId}
                                                    </p>
                                                </div>


                                                {/* Tier */}

                                                <div>
                                                    <p className="text-[10px] font-semibold text-[#182322]/45">
                                                        Ticket Type
                                                    </p>

                                                    <p className="mt-1 text-xs font-black text-[#182322]">
                                                        {tierName}
                                                    </p>
                                                </div>


                                                {/* Attendee */}

                                                {attendeeName && (
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-[#182322]/45">
                                                            Attendee
                                                        </p>

                                                        <p className="mt-1 break-words text-xs font-black text-[#182322]">
                                                            {attendeeName}
                                                        </p>
                                                    </div>
                                                )}


                                                {/* Quantity */}

                                                <div>
                                                    <p className="text-[10px] font-semibold text-[#182322]/45">
                                                        Tickets
                                                    </p>

                                                    <p className="mt-1 text-xs font-black text-[#182322]">
                                                        {ticketQuantity}
                                                    </p>
                                                </div>


                                                {/* Amount */}

                                                {totalAmount && (
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-[#182322]/45">
                                                            Amount Paid
                                                        </p>

                                                        <p className="mt-1 text-xs font-black text-[#182322]">
                                                            ₹
                                                            {String(
                                                                totalAmount
                                                            ).replace(
                                                                /^₹\s*/,
                                                                ""
                                                            )}
                                                        </p>
                                                    </div>
                                                )}


                                                {/* Payment */}

                                                {paymentMethod && (
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-[#182322]/45">
                                                            Payment
                                                        </p>

                                                        <p className="mt-1 text-xs font-black text-[#182322]">
                                                            {paymentMethod}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* =========================================
                  FOOTER
              ========================================== */}

                            <div className="flex shrink-0 flex-row gap-2 border-t border-[#182322]/10 bg-white p-3.5 sm:justify-end sm:px-5">
                                {/* Close */}

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 cursor-pointer rounded-md bg-[#182322]/10 px-5 py-3 text-sm font-bold text-black sm:flex-none"
                                >
                                    Close
                                </button>


                                {/* Download Ticket */}

                                {event.isBooked ? (
                                    <button
                                        type="button"
                                        onClick={downloadTicket}
                                        className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#FEDF24] px-5 py-3 text-sm font-black text-[#182322] transition duration-200 hover:bg-[#44807F] hover:text-white sm:flex-none"
                                    >
                                        <Download size={16} />

                                        Download Ticket
                                    </button>
                                ) : bookingUrl ? (
                                    <button
                                        type="button"
                                        target="_blank"
                                        onClick={() => {
                                            onClose();

                                            navigate(`/event/${event.id || event._id || "details"}`, {
                                                state: {
                                                    event,
                                                },
                                            });
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#FEDF24] px-5 py-3 text-sm font-black text-[#182322] transition duration-200 hover:bg-[#44807F] hover:text-white sm:flex-none"
                                    >
                                        View More

                                        <ExternalLink size={16} />
                                    </button>
                                ) : (
                                    /* Booking unavailable */

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
        </>
    );
};

export default EventDetailsModal;