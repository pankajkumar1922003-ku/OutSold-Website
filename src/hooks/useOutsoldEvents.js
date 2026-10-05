import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

const getPrice = (tiers = []) => {
    if (!tiers.length) return "Free";

    const prices = tiers
        .map((tier) => Number(tier.price))
        .filter((price) => Number.isFinite(price));

    if (!prices.length) return "Free";

    return `₹${Math.min(...prices)}`;
};

/* -------------------------------------------------------------------------- */
/* COMPANY EVENT                                                              */
/* -------------------------------------------------------------------------- */

const mapCompanyEvent = (id, data, companyId, companyData = {}) => {
    return {
        id,
        title: data.title || "Untitled Event",
        category: data.category || "Other",
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
        displaySection: data.displaySection || (data.featured ? "featured" : "events_youll_love"),
        isOnline: Boolean(data.isOnline),

        registrationMode:
            data.registrationMode || "tickets",

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
/* LIST YOUR EVENT                                                            */
/* -------------------------------------------------------------------------- */

const mapSubmittedEvent = (id, data) => {
    return {
        id: `submission_${id}`,
        title:
            data.eventName ||
            data.title ||
            "Untitled Event",

        category: data.category || "Other",
        description: data.description || "",
        otherCategory:
            data.otherCategory ||
            data.customCategory ||
            data.categoryName ||
            "",

        date:
            data.startDate ||
            data.date ||
            "",

        startDate:
            data.startDate ||
            data.date ||
            "",

        endDate:
            data.endDate ||
            data.startDate ||
            data.date ||
            "",

        time: data.time || "",

        location:
            data.venue ||
            data.location ||
            "",

        venue:
            data.venue ||
            data.location ||
            "",

        price:
            data.pricing ||
            "Free",

        image:
            data.coverImageDesktop ||
            data.coverImageMobile ||
            data.coverImage ||
            data.coverImageUrl ||
            data.coverImageUrls?.[0],

        featured:
            data.displaySection === "featured",

        displaySection:
            data.displaySection || "all",

        isOnline: Boolean(data.isOnline),

        registrationMode:
            data.registrationMode ||
            "tickets",

        tiers:
            data.tiers || [],

        companyId:
            data.companyId ||
            null,

        slug:
            data.slug ||
            null,

        subdomain:
            data.subdomain ||
            null,

        isPrivate:
            Boolean(data.isPrivate),

        status:
            data.status || "published",

        bookingUrl:
            data.bookingUrl ||
            data.ticketBookingUrl ||
            null,

        source: "event_submission",

        createdAt:
            data.createdAt || null,

        updatedAt:
            data.updatedAt || null,
    };
};

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useOutsoldEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribers = [];
        let isActive = true;

        /*
         * We keep events from BOTH sources here:
         *
         * 1. companies/{companyId}/events
         * 2. event_submissions
         */
        const allEvents = new Map();

        const updateEvents = () => {
            if (!isActive) return;

            const mergedEvents = Array.from(
                allEvents.values()
            ).filter(
                (event) =>
                    event &&
                    !event.isPrivate &&
                    event.status === "published"
            );

            setEvents(mergedEvents);
            setLoading(false);
        };

        const loadEvents = async () => {
            try {
                setLoading(true);
                setError(null);

                /* ========================================================== */
                /* 1. GET ALL COMPANIES                                       */
                /* ========================================================== */

                const companiesSnapshot = await getDocs(
                    collection(db, "companies")
                );

                if (!isActive) return;

                /* ========================================================== */
                /* 2. EXISTING COMPANY EVENTS                                */
                /* ========================================================== */

                companiesSnapshot.docs.forEach(
                    (companyDoc) => {
                        const companyId =
                            companyDoc.id;

                        const companyData =
                            companyDoc.data();

                        const eventsRef =
                            collection(
                                db,
                                "companies",
                                companyId,
                                "events"
                            );

                        const eventsQuery =
                            query(
                                eventsRef,
                                where(
                                    "status",
                                    "==",
                                    "published"
                                )
                            );

                        const unsubscribe =
                            onSnapshot(
                                eventsQuery,
                                (snapshot) => {
                                    /*
                                     * Remove previous events
                                     * belonging to this company.
                                     */
                                    for (const [
                                        key,
                                        event,
                                    ] of allEvents) {
                                        if (
                                            event.source ===
                                            "company" &&
                                            event.companyId ===
                                            companyId
                                        ) {
                                            allEvents.delete(
                                                key
                                            );
                                        }
                                    }

                                    /*
                                     * Add latest company events.
                                     */
                                    snapshot.docs.forEach(
                                        (eventDoc) => {
                                            const data =
                                                eventDoc.data();

                                            const event =
                                                mapCompanyEvent(
                                                    eventDoc.id,
                                                    data,
                                                    companyId,
                                                    companyData
                                                );

                                            allEvents.set(
                                                `company_${companyId}_${eventDoc.id}`,
                                                event
                                            );
                                        }
                                    );

                                    updateEvents();
                                },
                                (firebaseError) => {
                                    console.error(
                                        `Failed to fetch events for company ${companyId}:`,
                                        firebaseError
                                    );

                                    if (isActive) {
                                        setError(
                                            firebaseError.message
                                        );
                                        setLoading(false);
                                    }
                                }
                            );

                        unsubscribers.push(
                            unsubscribe
                        );
                    }
                );

                /* ========================================================== */
                /* 3. LIST YOUR EVENT / EVENT SUBMISSIONS                   */
                /* ========================================================== */

                const submissionsRef =
                    collection(
                        db,
                        "event_submissions"
                    );

                const submissionsQuery =
                    query(
                        submissionsRef,
                        where(
                            "status",
                            "==",
                            "published"
                        )
                    );

                const unsubscribeSubmissions =
                    onSnapshot(
                        submissionsQuery,
                        (snapshot) => {
                            /*
                             * Remove previous submission events.
                             */
                            for (const [
                                key,
                                event,
                            ] of allEvents) {
                                if (
                                    event.source ===
                                    "event_submission"
                                ) {
                                    allEvents.delete(
                                        key
                                    );
                                }
                            }

                            /*
                             * Add newly published
                             * List Your Event events.
                             */
                            snapshot.docs.forEach(
                                (eventDoc) => {
                                    const data =
                                        eventDoc.data();

                                    const event =
                                        mapSubmittedEvent(
                                            eventDoc.id,
                                            data
                                        );

                                    allEvents.set(
                                        `submission_${eventDoc.id}`,
                                        event
                                    );
                                }
                            );

                            updateEvents();
                        },
                        (firebaseError) => {
                            console.error(
                                "Failed to fetch event submissions:",
                                firebaseError
                            );

                            if (isActive) {
                                setError(
                                    firebaseError.message
                                );
                                setLoading(false);
                            }
                        }
                    );

                unsubscribers.push(
                    unsubscribeSubmissions
                );

                /*
                 * If there are no companies, submissions
                 * listener can still provide events.
                 */
                if (
                    companiesSnapshot.empty &&
                    isActive
                ) {
                    /*
                     * Don't set loading false here.
                     * event_submissions listener still needs
                     * to finish its first snapshot.
                     */
                }
            } catch (firebaseError) {
                console.error(
                    "Failed to load companies/events:",
                    firebaseError
                );

                if (isActive) {
                    setError(
                        firebaseError.message
                    );
                    setLoading(false);
                }
            }
        };

        loadEvents();

        return () => {
            isActive = false;

            unsubscribers.forEach(
                (unsubscribe) =>
                    unsubscribe()
            );
        };
    }, []);

    return {
        events,
        loading,
        error,
    };
}