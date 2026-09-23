import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

const TEST_COMPANY_ID = import.meta.env.VITE_TEST_COMPANY_ID;

const getPrice = (tiers = []) => {
    if (!tiers.length) return "Free";

    const prices = tiers
        .map((tier) => Number(tier.price))
        .filter((price) => Number.isFinite(price));

    if (!prices.length) return "Free";

    return `₹${Math.min(...prices)}`;
};

const mapFirebaseEvent = (id, data, subdomain) => {
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

        registrationMode: data.registrationMode || "tickets",

        tiers: data.tiers || [],

        companyId: TEST_COMPANY_ID,

        // Event slug
        slug: data.slug || null,

        // Company's custom subdomain
        subdomain: subdomain || null,

        isPrivate: Boolean(data.isPrivate),

        status: data.status,
    };
};

export function useOutsoldEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subdomain, setSubdomain] = useState(null);

    useEffect(() => {
        if (!TEST_COMPANY_ID) {
            setError("VITE_TEST_COMPANY_ID is missing");
            setLoading(false);
            return;
        }

        let unsubscribeEvents;

        const loadData = async () => {
            try {
                // -----------------------------------------
                // 1. Get company's custom subdomain
                // -----------------------------------------
                const companyRef = doc(
                    db,
                    "companies",
                    TEST_COMPANY_ID
                );

                const companySnap = await getDoc(companyRef);

                let companySubdomain = null;

                if (companySnap.exists()) {
                    const companyData = companySnap.data();

                    companySubdomain =
                        companyData.subdomain || null;

                    setSubdomain(companySubdomain);
                }

                // -----------------------------------------
                // 2. Get published events
                // -----------------------------------------
                const eventsRef = collection(
                    db,
                    "companies",
                    TEST_COMPANY_ID,
                    "events"
                );

                const eventsQuery = query(
                    eventsRef,
                    where("status", "==", "published")
                );

                unsubscribeEvents = onSnapshot(
                    eventsQuery,
                    (snapshot) => {
                        const mappedEvents = snapshot.docs
                            .map((doc) =>
                                mapFirebaseEvent(
                                    doc.id,
                                    doc.data(),
                                    companySubdomain
                                )
                            )
                            .filter(
                                (event) => !event.isPrivate
                            );

                        setEvents(mappedEvents);
                        setLoading(false);
                        setError(null);
                    },
                    (firebaseError) => {
                        console.error(
                            "Failed to fetch Outsold events:",
                            firebaseError
                        );

                        setError(firebaseError.message);
                        setLoading(false);
                    }
                );
            } catch (firebaseError) {
                console.error(
                    "Failed to load Outsold data:",
                    firebaseError
                );

                setError(firebaseError.message);
                setLoading(false);
            }
        };

        loadData();

        return () => {
            if (unsubscribeEvents) {
                unsubscribeEvents();
            }
        };
    }, []);

    return {
        events,
        loading,
        error,
        subdomain,
    };
}