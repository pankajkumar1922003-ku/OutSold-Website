import { useEffect, useRef, useState } from "react";
import {
    MapPin,
    Navigation,
    ArrowRight,
    Loader2,
    Sparkles,
    Search,
    CheckCircle2,
} from "lucide-react";

const STORAGE_KEY = "outsold_user_profile";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

const extractCityName = (item) => {
    const a = item?.address || {};

    return (
        a.city ||
        a.town ||
        a.municipality ||
        a.village ||
        a.suburb ||
        a.city_district ||
        item?.display_name?.split(",")?.[0] ||
        ""
    );
};

const getSavedProfile = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return null;

        const profile = JSON.parse(saved);

        if (!profile || typeof profile !== "object") {
            return null;
        }

        return profile;
    } catch {
        return null;
    }
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */

const LocationOnboarding = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [locationInput, setLocationInput] = useState("");
    const [coordinates, setCoordinates] = useState(null);

    const [locationSource, setLocationSource] = useState(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    const [suggestions, setSuggestions] = useState([]);

    const [isDetecting, setIsDetecting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [locationError, setLocationError] = useState("");
    const [permissionIssue, setPermissionIssue] = useState(false);

    const [saving, setSaving] = useState(false);

    /* -------------------------------------------------------
       Refs
    ------------------------------------------------------- */

    const detectReqId = useRef(0);
    const searchReqId = useRef(0);
    const searchTimer = useRef(null);

    /*
      Prevent automatic GPS detection from starting again
      after manual location input.
    */
    const autoDetectTriedRef = useRef(false);

    /*
      Tracks whether user manually edited the location
      during the current popup session.
    */
    const manualEditRef = useRef(false);

    /*
      Tracks latest saved location.
    */
    const latestSavedLocationRef = useRef("");

    /* -------------------------------------------------------
       Load saved location
    ------------------------------------------------------- */

    const loadProfileIntoState = () => {
        const profile = getSavedProfile();

        if (!profile) {
            setLocationInput("");
            setCoordinates(null);
            setLocationSource(null);
            setSelectedSuggestion(null);

            latestSavedLocationRef.current = "";

            return false;
        }

        const savedLocation = profile?.location || "";

        setLocationInput(savedLocation);
        setCoordinates(profile?.coordinates || null);
        setLocationSource(profile?.locationSource || "manual");

        setSelectedSuggestion(
            savedLocation
                ? {
                      display_name: savedLocation,
                      lat: profile?.coordinates?.latitude,
                      lon: profile?.coordinates?.longitude,
                  }
                : null
        );

        latestSavedLocationRef.current = savedLocation;

        return !!profile?.completed;
    };

    /* -------------------------------------------------------
       Initial mount
    ------------------------------------------------------- */

    useEffect(() => {
        const profile = getSavedProfile();

        if (profile?.completed) {
            const savedLocation = profile?.location || "";

            setLocationInput(savedLocation);
            setCoordinates(profile?.coordinates || null);
            setLocationSource(profile?.locationSource || "manual");

            setSelectedSuggestion(
                savedLocation
                    ? {
                          display_name: savedLocation,
                          lat: profile?.coordinates?.latitude,
                          lon: profile?.coordinates?.longitude,
                      }
                    : null
            );

            latestSavedLocationRef.current = savedLocation;

            setIsOpen(false);
        } else {
            setLocationInput("");
            setCoordinates(null);
            setLocationSource(null);
            setSelectedSuggestion(null);

            latestSavedLocationRef.current = "";

            setIsOpen(true);

            autoDetectTriedRef.current = false;
            manualEditRef.current = false;
        }
    }, []);

    /* -------------------------------------------------------
       Navbar trigger
    ------------------------------------------------------- */

    useEffect(() => {
        const openFromNavbar = () => {
            loadProfileIntoState();

            setLocationError("");
            setPermissionIssue(false);

            setSuggestions([]);
            setIsSearching(false);
            setSaving(false);

            /*
              Navbar opening should NOT automatically replace
              saved location with GPS.
            */
            autoDetectTriedRef.current = true;
            manualEditRef.current = false;

            setIsOpen(true);
        };

        window.addEventListener(
            "openLocationOnboarding",
            openFromNavbar
        );

        return () => {
            window.removeEventListener(
                "openLocationOnboarding",
                openFromNavbar
            );
        };
    }, []);

    /* -------------------------------------------------------
       Auto detect
    ------------------------------------------------------- */

    useEffect(() => {
        if (!isOpen) return;

        if (autoDetectTriedRef.current) return;

        if (manualEditRef.current) return;

        if (locationInput.trim()) return;

        autoDetectTriedRef.current = true;

        const timer = setTimeout(() => {
            detectLocation();
        }, 300);

        return () => clearTimeout(timer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    /* -------------------------------------------------------
       Reverse geocode
    ------------------------------------------------------- */

    const getCityFromCoordinates = async (
        latitude,
        longitude
    ) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Reverse geocode failed");
            }

            const data = await res.json();

            return extractCityName({
                address: data?.address,
                display_name: "",
            });
        } catch {
            return "";
        }
    };

    /* -------------------------------------------------------
       Forward geocode
    ------------------------------------------------------- */

    const geocodeCity = async (query) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=in&q=${encodeURIComponent(
                    query
                )}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!res.ok) {
                return null;
            }

            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                return null;
            }

            const normalizedQuery = query
                .trim()
                .toLowerCase();

            const matchingCity = data.find((item) => {
                const city = extractCityName(item)
                    .trim()
                    .toLowerCase();

                return (
                    city === normalizedQuery ||
                    city.includes(normalizedQuery) ||
                    normalizedQuery.includes(city)
                );
            });

            const item = matchingCity || data[0];

            if (!item?.lat || !item?.lon) {
                return null;
            }

            return {
                latitude: Number(item.lat),
                longitude: Number(item.lon),
            };
        } catch {
            return null;
        }
    };

    /* -------------------------------------------------------
       GPS detect
    ------------------------------------------------------- */

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setPermissionIssue(true);

            setLocationError(
                "Location is not supported on this device. Please enter your city manually."
            );

            return;
        }

        const reqId = ++detectReqId.current;

        setIsDetecting(true);
        setLocationError("");
        setPermissionIssue(false);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                /*
                  If user started typing while GPS was running,
                  completely ignore GPS response.
                */
                if (
                    reqId !== detectReqId.current ||
                    manualEditRef.current
                ) {
                    return;
                }

                const {
                    latitude,
                    longitude,
                } = position.coords;

                const city =
                    await getCityFromCoordinates(
                        latitude,
                        longitude
                    );

                /*
                  User may have typed while reverse geocoding
                  was happening.
                */
                if (
                    reqId !== detectReqId.current ||
                    manualEditRef.current
                ) {
                    return;
                }

                setIsDetecting(false);

                if (!city) {
                    setLocationError(
                        "Your location was detected, but we couldn't find your city name. Please select your city manually."
                    );

                    return;
                }

                setCoordinates({
                    latitude,
                    longitude,
                });

                setLocationInput(city);

                setSelectedSuggestion({
                    display_name: city,
                });

                setLocationSource("detected");
            },

            (error) => {
                if (
                    reqId !== detectReqId.current ||
                    manualEditRef.current
                ) {
                    return;
                }

                setIsDetecting(false);
                setPermissionIssue(true);

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError(
                            "Please allow location access for OutSold to automatically find events near you."
                        );
                        break;

                    case error.POSITION_UNAVAILABLE:
                        setLocationError(
                            "Your phone's Location Services are turned off or unavailable. You can select your city manually."
                        );
                        break;

                    case error.TIMEOUT:
                        setLocationError(
                            "Location detection took too long. Please select your city manually."
                        );
                        break;

                    default:
                        setLocationError(
                            "We couldn't detect your location. Please select your city manually."
                        );
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    /* -------------------------------------------------------
       Search suggestions
    ------------------------------------------------------- */

    const searchLocations = async (
        query,
        reqId
    ) => {
        try {
            setIsSearching(true);

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=in&q=${encodeURIComponent(
                    query
                )}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Search failed");
            }

            const data = await res.json();

            if (reqId !== searchReqId.current) {
                return;
            }

            const validResults = Array.isArray(data)
                ? data.filter(
                      (item) =>
                          item?.lat &&
                          item?.lon &&
                          item?.display_name
                  )
                : [];

            setSuggestions(validResults);
        } catch {
            if (reqId !== searchReqId.current) {
                return;
            }

            setSuggestions([]);
        } finally {
            if (reqId === searchReqId.current) {
                setIsSearching(false);
            }
        }
    };

    /* -------------------------------------------------------
       Manual typing
    ------------------------------------------------------- */

    const handleLocationInput = (value) => {
        /*
          The moment user types anything, GPS is cancelled
          and saved location is no longer re-injected.
        */
        manualEditRef.current = true;

        detectReqId.current += 1;
        searchReqId.current += 1;

        autoDetectTriedRef.current = true;

        setLocationSource("manual");
        setLocationInput(value);

        setCoordinates(null);
        setSelectedSuggestion(null);

        setLocationError("");
        setPermissionIssue(false);
        setSuggestions([]);

        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
        }

        const trimmed = value.trim();

        if (trimmed.length < 2) {
            setIsSearching(false);
            return;
        }

        const reqId = ++searchReqId.current;

        searchTimer.current = setTimeout(() => {
            searchLocations(
                trimmed,
                reqId
            );
        }, 350);
    };

    /* -------------------------------------------------------
       Select suggestion
    ------------------------------------------------------- */

    const handleSelectSuggestion = (item) => {
        manualEditRef.current = true;

        detectReqId.current += 1;
        searchReqId.current += 1;

        autoDetectTriedRef.current = true;

        const cityName = extractCityName(item);

        if (!cityName) {
            setLocationError(
                "Please select a valid location from the suggestions."
            );

            return;
        }

        setLocationInput(cityName);

        setCoordinates({
            latitude: Number(item.lat),
            longitude: Number(item.lon),
        });

        setSelectedSuggestion(item);

        setSuggestions([]);
        setIsSearching(false);
        setLocationError("");
        setPermissionIssue(false);

        setLocationSource("manual");
    };

    /* -------------------------------------------------------
       Detect button
    ------------------------------------------------------- */

    const handleDetectClick = () => {
        manualEditRef.current = false;

        detectReqId.current += 1;

        setLocationError("");
        setPermissionIssue(false);

        setLocationSource(null);
        setCoordinates(null);
        setSelectedSuggestion(null);

        setLocationInput("");
        setSuggestions([]);

        autoDetectTriedRef.current = true;

        detectLocation();
    };

    /* -------------------------------------------------------
       Scroll to events
    ------------------------------------------------------- */

    const scrollToEventsHome = () => {
        let attempts = 0;

        const maxAttempts = 30;

        const tryScroll = () => {
            const eventsHome =
                document.getElementById(
                    "eventsHome"
                );

            if (eventsHome) {
                eventsHome.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                return;
            }

            attempts += 1;

            if (attempts < maxAttempts) {
                setTimeout(
                    tryScroll,
                    100
                );
            }
        };

        tryScroll();
    };

    /* -------------------------------------------------------
       Save + continue
    ------------------------------------------------------- */

    const handleContinue = async () => {
        const trimmed = locationInput.trim();

        if (!trimmed) {
            setLocationError(
                "Please select your city or detect your location."
            );

            return;
        }

        setSaving(true);
        setLocationError("");

        /*
          Only location data is stored.
          No name.
          No phone.
        */
        let finalCoordinates = coordinates;

        /*
          If user manually typed a city but did not select
          a suggestion, try to get its coordinates.
        */
        if (!finalCoordinates) {
            finalCoordinates = await geocodeCity(trimmed);
        }

        const profile = {
            location: trimmed,
            coordinates: finalCoordinates || null,
            locationSource:
                locationSource || "manual",
            completed: true,
            updatedAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(profile)
            );

            latestSavedLocationRef.current = trimmed;

            window.dispatchEvent(
                new CustomEvent(
                    "locationChanged",
                    {
                        detail: profile,
                    }
                )
            );
        } catch {
            setSaving(false);

            setLocationError(
                "Something went wrong while saving your location. Please try again."
            );

            return;
        }

        setCoordinates(finalCoordinates || null);
        setSelectedSuggestion({
            display_name: trimmed,
            lat: finalCoordinates?.latitude,
            lon: finalCoordinates?.longitude,
        });

        setSuggestions([]);
        setLocationError("");
        setPermissionIssue(false);
        setSaving(false);

        manualEditRef.current = false;
        autoDetectTriedRef.current = true;

        setIsOpen(false);

        const currentPath = window.location.pathname;

        if (currentPath !== "/") {
            window.history.pushState({}, "", "/");
            window.dispatchEvent(
                new PopStateEvent("popstate")
            );
        }
    };

    /* -------------------------------------------------------
       Skip
    ------------------------------------------------------- */

    const handleSkip = () => {
        setIsOpen(false);

        setSuggestions([]);
        setLocationError("");
        setPermissionIssue(false);

        setSaving(false);

        manualEditRef.current = false;

        /*
          Keep existing saved location intact.
        */
        const saved = getSavedProfile();

        if (saved?.location) {
            setLocationInput(saved.location);

            setCoordinates(
                saved.coordinates || null
            );

            setLocationSource(
                saved.locationSource || "manual"
            );

            setSelectedSuggestion({
                display_name: saved.location,
                lat: saved.coordinates?.latitude,
                lon: saved.coordinates?.longitude,
            });
        }
    };

    /* -------------------------------------------------------
       Cleanup
    ------------------------------------------------------- */

    useEffect(() => {
        return () => {
            if (searchTimer.current) {
                clearTimeout(
                    searchTimer.current
                );
            }

            searchReqId.current += 1;
            detectReqId.current += 1;
        };
    }, []);

    /* -------------------------------------------------------
       Modal hidden
    ------------------------------------------------------- */

    if (!isOpen) {
        return null;
    }

    /* -------------------------------------------------------
       UI
    ------------------------------------------------------- */

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-3 py-1.5 backdrop-blur-md sm:px-6 sm:py-4">
            <div className="relative w-[86vw] max-w-[430px] rounded-[20px] border border-white/60 bg-[#fffdf5] shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:w-[70vw] sm:max-w-[440px] sm:rounded-[24px]">

                {/* Top decorative background */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden rounded-t-[24px]">
                    <div className="absolute -right-10 -top-20 h-44 w-44 rounded-full bg-[#FEDF24]/25 blur-3xl" />

                    <div className="absolute -left-12 -top-16 h-36 w-36 rounded-full bg-[#44807F]/20 blur-3xl" />
                </div>

                <div className="relative px-4 pb-4 pt-2 sm:px-7 sm:pb-6 sm:pt-7">

                    {/* Icon */}
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#44807F] text-white shadow-[0_10px_30px_rgba(68,128,127,0.25)]">
                        <Sparkles
                            size={18}
                            strokeWidth={2.2}
                        />
                    </div>

                    {/* Heading */}
                    <div>
                        <h2 className="text-[23px] font-black leading-[1.05] tracking-[-0.04em] text-[#182322] sm:text-3xl">
                            Find what's

                            <span className="block bg-gradient-to-r from-[#44807F] to-[#6ba58f] bg-clip-text text-transparent">
                                happening near you.
                            </span>
                        </h2>

                        <p className="mt-1.5 max-w-sm text-[12px] leading-4 text-[#182322]/60 sm:mt-2 sm:text-sm sm:leading-5">
                            Tell us where you are and discover events happening around you.
                        </p>
                    </div>

                    {/* Location */}
                    <div className="mt-3 sm:mt-4">

                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-bold text-[#182322]">
                                Your location
                            </label>

                            <button
                                type="button"
                                onClick={
                                    handleDetectClick
                                }
                                disabled={isDetecting}
                                className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#44807F] transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDetecting ? (
                                    <>
                                        <Loader2
                                            size={13}
                                            className="animate-spin"
                                        />

                                        Detecting...
                                    </>
                                ) : (
                                    <>
                                        <Navigation
                                            size={13}
                                        />

                                        Detect location
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Input */}
                        <div className="relative">

                            <MapPin
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#44807F]"
                            />

                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) =>
                                    handleLocationInput(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your city"
                                autoComplete="off"
                                className="h-11 w-full rounded-xl border border-[#182322]/10 bg-white pl-11 pr-10 text-sm font-medium text-[#182322] outline-none transition placeholder:text-[#182322]/35 focus:border-[#44807F]/50 focus:ring-4 focus:ring-[#44807F]/10"
                            />

                            {isSearching && (
                                <Loader2
                                    size={16}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#44807F]"
                                />
                            )}

                            {!isSearching &&
                                selectedSuggestion && (
                                    <CheckCircle2
                                        size={17}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#44807F]"
                                    />
                                )}
                        </div>

                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="mt-2 overflow-hidden rounded-xl border border-[#182322]/10 bg-white shadow-[0_15px_35px_rgba(24,35,34,0.12)]">

                                <div className="border-b border-[#182322]/5 px-3 py-2">
                                    <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#182322]/35">
                                        Select a location
                                    </p>
                                </div>

                                {suggestions.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const address =
                                            item?.address ||
                                            {};

                                        const city =
                                            extractCityName(
                                                item
                                            );

                                        const state =
                                            address.state ||
                                            "";

                                        return (
                                            <button
                                                key={`${item.place_id}-${index}`}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectSuggestion(
                                                        item
                                                    )
                                                }
                                                className="flex w-full cursor-pointer items-start gap-3 border-b border-[#182322]/5 px-3 py-3 text-left transition last:border-b-0 hover:bg-[#44807F]/5"
                                            >
                                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#44807F]/10">
                                                    <MapPin
                                                        size={14}
                                                        className="text-[#44807F]"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-xs font-bold text-[#182322]">
                                                        {city}
                                                    </p>

                                                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-[#182322]/45">
                                                        {state
                                                            ? `${city}, ${state}`
                                                            : item.display_name}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        {/* No results */}
                        {!isSearching &&
                            locationInput
                                .trim()
                                .length >= 2 &&
                            suggestions.length === 0 &&
                            !selectedSuggestion && (
                                <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#182322]/5 px-3 py-2.5">
                                    <Search
                                        size={14}
                                        className="shrink-0 text-[#182322]/35"
                                    />

                                    <p className="text-[10px] text-[#182322]/50">
                                        No matching location found. Please try another city.
                                    </p>
                                </div>
                            )}

                        {/* Error */}
                        {locationError && (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">

                                <div className="flex items-start gap-2.5">

                                    <MapPin
                                        size={17}
                                        className="mt-0.5 shrink-0 text-amber-600"
                                    />

                                    <div className="flex-1">

                                        <p className="text-xs font-bold text-[#182322]">
                                            Location access needed
                                        </p>

                                        <p className="mt-1 text-[11px] leading-4 text-[#182322]/60">
                                            {locationError}
                                        </p>

                                        {permissionIssue && (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleDetectClick
                                                }
                                                disabled={
                                                    isDetecting
                                                }
                                                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-bold text-[#44807F] transition hover:opacity-70 disabled:opacity-50"
                                            >
                                                {isDetecting ? (
                                                    <>
                                                        <Loader2
                                                            size={12}
                                                            className="animate-spin"
                                                        />

                                                        Detecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Navigation
                                                            size={12}
                                                        />

                                                        Try Again
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Valid selected location */}
                        {!locationError &&
                            locationInput &&
                            selectedSuggestion && (
                                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#44807F]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#44807F]" />

                                    {coordinates
                                        ? "Valid location selected"
                                        : "Location selected"}
                                </div>
                            )}
                    </div>

                    {/* Continue */}
                    <div className="mt-4 sm:mt-5">

                        <button
                            type="button"
                            onClick={
                                handleContinue
                            }
                            disabled={saving}
                            className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#182322] px-5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(24,35,34,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#44807F] hover:shadow-[0_16px_35px_rgba(68,128,127,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    Show Events

                                    <ArrowRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </>
                            )}
                        </button>

                        <p className="mt-1.5 text-center text-[10px] leading-4 text-[#182322]/40">
                            You can change your location anytime.
                        </p>
                    </div>

                    {/* Skip */}
                    <button
                        type="button"
                        onClick={
                            handleSkip
                        }
                        className="mx-auto mt-1 block cursor-pointer text-[11px] font-semibold text-[#182322]/40 transition hover:text-[#182322]"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationOnboarding;

