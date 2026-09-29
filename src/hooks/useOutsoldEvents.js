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

const mapFirebaseEvent = (id, data, companyId) => {
    return {
        id,

        title: data.title || "Untitled Event",

        category: data.category || "Other",

        date: data.date || "",

        endDate: data.endDate || "",

        time: data.time || "",

        location: data.venue || "",

        venue: data.venue || "",

        price: getPrice(data.tiers),

        image:
            data.coverImageDesktop ||
            data.coverImageMobile ||
            data.coverImage ||
            data.coverImageUrls?.[0] ||
            data.coverImageUrl,

        featured: Boolean(data.featured),

        isOnline: Boolean(data.isOnline),

        registrationMode:
            data.registrationMode || "tickets",

        tiers: data.tiers || [],

        companyId: companyId || null,

        slug: data.slug || null,

        subdomain: data.subdomain || null,

        isPrivate: Boolean(data.isPrivate),

        status: data.status,
    };
};

export function useOutsoldEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribers = [];
        let isActive = true;

        const loadEvents = async () => {
            try {
                setLoading(true);
                setError(null);

                // -----------------------------------------
                // 1. Get ALL companies
                // -----------------------------------------

                const companiesSnapshot = await getDocs(
                    collection(db, "companies")
                );

                if (!isActive) return;

                // -----------------------------------------
                // 2. Listen to every company's events
                // -----------------------------------------

                const allEvents = new Map();

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
                        where("status", "==", "published")
                    );

                    const unsubscribe = onSnapshot(
                        eventsQuery,
                        (snapshot) => {
                            // Remove old events of this company
                            for (const [key, event] of allEvents) {
                                if (
                                    event.companyId ===
                                    companyId
                                ) {
                                    allEvents.delete(key);
                                }
                            }

                            // Add latest events
                            snapshot.docs.forEach((eventDoc) => {
                                const data =
                                    eventDoc.data();

                                allEvents.set(
                                    `${companyId}_${eventDoc.id}`,
                                    mapFirebaseEvent(
                                        eventDoc.id,
                                        {
                                            ...data,

                                            // If event doesn't contain
                                            // subdomain, use company subdomain
                                            subdomain:
                                                data.subdomain ||
                                                companyData.subdomain ||
                                                null,
                                        },
                                        companyId
                                    )
                                );
                            });

                            if (isActive) {
                                setEvents(
                                    Array.from(
                                        allEvents.values()
                                    ).filter(
                                        (event) =>
                                            !event.isPrivate
                                    )
                                );

                                setLoading(false);
                            }
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

                    unsubscribers.push(unsubscribe);
                });

                // Agar companies hi nahi hain
                if (
                    companiesSnapshot.empty &&
                    isActive
                ) {
                    setEvents([]);
                    setLoading(false);
                }
            } catch (firebaseError) {
                console.error(
                    "Failed to load companies/events:",
                    firebaseError
                );

                if (isActive) {
                    setError(firebaseError.message);
                    setLoading(false);
                }
            }
        };

        loadEvents();

        return () => {
            isActive = false;

            unsubscribers.forEach(
                (unsubscribe) => unsubscribe()
            );
        };
    }, []);

    return {
        events,
        loading,
        error,
    };
}