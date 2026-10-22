
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

/* -------------------------------------------------------------------------- */
/* CACHE                                                                      */
/* -------------------------------------------------------------------------- */

const CACHE_KEY = "outsold_public_events_cache_v1";

const readCachedEvents = () => {
    try {
        if (typeof window === "undefined") return [];

        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return [];

        const parsed = JSON.parse(cached);

        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (event) =>
                event &&
                !event.isPrivate &&
                event.status === "published" && (event.source !== "company" || event.isWebsite === true)
        );
    } catch (error) {
        console.warn("Could not read cached events:", error);
        return [];
    }
};

/* Convert Firestore Timestamps to serializable values for localStorage. */
const normalizeForCache = (value) => {
    if (value && typeof value.toDate === "function") {
        return value.toDate().toISOString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map(normalizeForCache);
    }

    if (value && typeof value === "object") {
        const normalized = {};

        Object.entries(value).forEach(([key, item]) => {
            normalized[key] = normalizeForCache(item);
        });

        return normalized;
    }

    return value;
};

const writeCachedEvents = (events) => {
    try {
        if (typeof window === "undefined") return;

        const safeEvents = events
            .filter(
                (event) =>
                    event &&
                    !event.isPrivate &&
                    event.status === "published" &&
                    (event.source !== "company" || event.isWebsite === true)
            )
            .map(normalizeForCache);

        localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(safeEvents)
        );
    } catch (error) {
        // Storage can be unavailable or full. Live events still work.
        console.warn("Could not cache events:", error);
    }
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const getPrice = (tiers = []) => {
    if (!Array.isArray(tiers) || !tiers.length) return "Free";

    const prices = tiers
        .map((tier) => Number(tier.price))
        .filter((price) => Number.isFinite(price));

    if (!prices.length) return "Free";

    return `₹${Math.min(...prices)}`;
};

const cleanEventTitle = (value) => {
    if (!value) return "";

    return String(value)
        .replace(/&nbsp;/gi, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

/* -------------------------------------------------------------------------- */
/* COMPANY EVENTS                                                             */
/* -------------------------------------------------------------------------- */

const mapCompanyEvent = (id, data, companyId, companyData = {}) => {
    return {
        id,
        title: cleanEventTitle(data.title || "Untitled Event"),
        category: data.category || "Other",
        isPrivate: Boolean(data.isPrivate),
        isWebsite: data.isWebsite === true || data.isWebsite === "true",
        status: data.status,

        otherCategory:
            data.otherCategory ||
            data.customCategory ||
            data.categoryName ||
            "",

        description: data.description || "",

        date: data.date || data.startDate || "",

        startDate:
            data.startDate ||
            data.start_date ||
            data.eventStartDate ||
            data.date ||
            "",

        endDate:
            data.endDate ||
            data.end_date ||
            data.eventEndDate ||
            data.startDate ||
            data.date ||
            "",

        time: data.time || "",

        location: data.venue || data.location || "",
        venue: data.venue || "",

        price: data.pricing || getPrice(data.tiers),

        image:
            data.coverImageDesktop ||
            data.coverImageMobile ||
            data.coverImage ||
            data.coverImageUrls?.[0] ||
            data.coverImageUrl,

        featured: Boolean(data.featured),

        displaySection:
            data.displaySection ||
            (data.featured ? "featured" : "events_youll_love"),

        isOnline: Boolean(data.isOnline),

        registrationMode: data.registrationMode || "tickets",

        tiers: data.tiers || [],

        companyId: companyId || null,

        slug: data.slug || null,

        subdomain:
            data.subdomain ||
            companyData.subdomain ||
            null,

        isPrivate: Boolean(data.isPrivate),

        status: data.status,

        bookingUrl:
            data.bookingUrl ||
            data.ticketBookingUrl ||
            null,

        source: "company",
    };
};

/* -------------------------------------------------------------------------- */
/* EVENT SUBMISSIONS                                                          */
/* -------------------------------------------------------------------------- */

const mapSubmittedEvent = (id, data) => {
    return {
        id: `submission_${id}`,

        title: cleanEventTitle(
            data.eventName ||
            data.title ||
            "Untitled Event"
        ),

        category: data.category || "Other",
        organizedBy: data.organizedBy || "",
        description: data.description || "",

        otherCategory:
            data.otherCategory ||
            data.customCategory ||
            data.categoryName ||
            "",

        date: data.startDate || data.date || "",

        startDate: data.startDate || data.date || "",

        endDate:
            data.endDate ||
            data.startDate ||
            data.date ||
            "",

        time: data.time || "",

        location: data.venue || data.location || "",
        venue: data.venue || data.location || "",

        price: data.pricing || "Free",

        image:
            data.coverImageDesktop ||
            data.coverImageMobile ||
            data.coverImage ||
            data.coverImageUrl ||
            data.coverImageUrls?.[0],

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

        bookingUrl:
            data.bookingUrl ||
            data.ticketBookingUrl ||
            null,

        source: "event_submission",

        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
    };
};

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useOutsoldEvents() {
    const [events, setEvents] = useState(() => readCachedEvents());

    const [loading, setLoading] = useState(
        () => readCachedEvents().length === 0
    );

    const [error, setError] = useState(null);

    useEffect(() => {
        let isActive = true;

        const unsubscribers = [];

        // Start with cached events so returning visitors see them immediately.
        const allEvents = new Map();

        const getEventKey = (event) => {
            if (event.source === "company") {
                return `company_${event.companyId}_${event.id}`;
            }

            return `submission_${event.id.replace(/^submission_/, "")}`;
        };

        readCachedEvents().forEach((event) => {
            allEvents.set(getEventKey(event), event);
        });

        let companyCount = null;
        let companyInitialSettled = 0;
        let submissionsInitialReceived = false;
        let hasSourceError = false;

        const companyInitialStatus = new Map();

        const initialLoadingFinished = () => {
            return (
                companyCount !== null &&
                companyInitialSettled >= companyCount &&
                submissionsInitialReceived
            );
        };

        const updateEvents = () => {
            if (!isActive) return;

            const mergedEvents = Array.from(allEvents.values()).filter(
                (event) =>
                    event &&
                    !event.isPrivate &&
                    event.status === "published" &&
                    (event.source !== "company" || event.isWebsite === true)
            );

            setEvents(mergedEvents);
            setLoading(false);

            if (
                initialLoadingFinished() &&
                !hasSourceError
            ) {
                writeCachedEvents(mergedEvents);
            }
        };

        const markCompanyInitialSettled = (companyId) => {
            if (companyInitialStatus.get(companyId)) return;

            companyInitialStatus.set(companyId, true);
            companyInitialSettled += 1;
        };

        /* ------------------------------------------------------------------ */
        /* 1. Start event_submissions immediately                              */
        /* ------------------------------------------------------------------ */

        const submissionsQuery = query(
            collection(db, "event_submissions"),
            where("status", "==", "published")
        );

        const unsubscribeSubmissions = onSnapshot(
            submissionsQuery,
            (snapshot) => {
                if (!isActive) return;

                // Remove cached/previous submissions before adding
                // the current Firestore results.
                for (const [key, event] of allEvents) {
                    if (event.source === "event_submission") {
                        allEvents.delete(key);
                    }
                }

                snapshot.docs.forEach((eventDoc) => {
                    const event = mapSubmittedEvent(
                        eventDoc.id,
                        eventDoc.data()
                    );

                    allEvents.set(
                        `submission_${eventDoc.id}`,
                        event
                    );
                });

                submissionsInitialReceived = true;

                updateEvents();
            },
            (firebaseError) => {
                if (!isActive) return;

                console.error(
                    "Failed to fetch event submissions:",
                    firebaseError
                );

                hasSourceError = true;
                submissionsInitialReceived = true;

                setError(firebaseError.message);
                updateEvents();
            }
        );

        unsubscribers.push(unsubscribeSubmissions);

        /* ------------------------------------------------------------------ */
        /* 2. Fetch companies and subscribe to their events                   */
        /* ------------------------------------------------------------------ */

        const loadCompanyEvents = async () => {
            try {
                const companiesSnapshot = await getDocs(
                    collection(db, "companies")
                );

                if (!isActive) return;

                const companyIds = new Set(
                    companiesSnapshot.docs.map((companyDoc) => companyDoc.id)
                );

                companyCount = companiesSnapshot.docs.length;

                for (const [key, event] of allEvents) {
                    if (
                        event.source === "company" &&
                        !companyIds.has(event.companyId)
                    ) {
                        allEvents.delete(key);
                    }
                }

                updateEvents();

                companiesSnapshot.docs.forEach((companyDoc) => {
                    const companyId = companyDoc.id;
                    const companyData = companyDoc.data();

                    const eventsRef = collection(
                        db,
                        "companies",
                        companyId,
                        "events"
                    );

                    const eventsQuery = query(
                        eventsRef,
                        where("status", "==", "published"),
                        where("isWebsite", "in", [true, "true"])
                    );

                    const unsubscribe = onSnapshot(
                        eventsQuery,
                        (snapshot) => {
                            if (!isActive) return;

                            for (const [key, event] of allEvents) {
                                if (
                                    event.source === "company" &&
                                    event.companyId === companyId
                                ) {
                                    allEvents.delete(key);
                                }
                            }

                            snapshot.docs.forEach((eventDoc) => {
                                const event = mapCompanyEvent(
                                    eventDoc.id,
                                    eventDoc.data(),
                                    companyId,
                                    companyData
                                );

                                allEvents.set(
                                    `company_${companyId}_${eventDoc.id}`,
                                    event
                                );
                            });

                            markCompanyInitialSettled(companyId);

                            updateEvents();
                        },
                        (firebaseError) => {
                            if (!isActive) return;

                            console.error(
                                `Failed to fetch events for company ${companyId}:`,
                                firebaseError
                            );

                            hasSourceError = true;

                            markCompanyInitialSettled(companyId);

                            setError(firebaseError.message);
                            updateEvents();
                        }
                    );

                    unsubscribers.push(unsubscribe);
                });

                // No companies? The submissions listener can still provide
                // events, and the cache can be refreshed after its snapshot.
                if (companyCount === 0) {
                    updateEvents();
                }
            } catch (firebaseError) {
                if (!isActive) return;

                console.error(
                    "Failed to load companies/events:",
                    firebaseError
                );

                hasSourceError = true;

                setError(firebaseError.message);
                setLoading(false);
            }
        };

        loadCompanyEvents();

        /* ------------------------------------------------------------------ */
        /* CLEANUP                                                            */
        /* ------------------------------------------------------------------ */

        return () => {
            isActive = false;

            unsubscribers.forEach((unsubscribe) => {
                unsubscribe();
            });
        };
    }, []);

    return {
        events,
        loading,
        error,
    };
}
