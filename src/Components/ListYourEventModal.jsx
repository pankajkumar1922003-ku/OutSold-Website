import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarDays,
    CheckCircle2,
    ImagePlus,
    Link2,
    Loader2,
    MapPin,
    Ticket,
    Upload,
    X,
    Sparkles,
} from "lucide-react";

import {
    addDoc,
    collection,
    serverTimestamp,
    updateDoc,
    doc,
} from "firebase/firestore";

import {
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";

import { db, storage } from "../lib/firebase";

const initialForm = {
    eventName: "",
    category: "",
    organizedBy: "",
    otherCategory: "",
    startDate: "",
    endDate: "",
    venue: "",
    description: "",
    pricing: "",
    bookingUrl: "",
    displaySection: "",
};

const categoryOptions = [
    "Music",
    "Comedy",
    "Business",
    "Party",
    "Workshop",
    "Sports",
    "Other",
];

const placementOptions = [
    {
        value: "featured",
        title: "Featured Events",
        description:
            "Show your event in the main Featured section on the home page.",
        icon: Sparkles,
    },
    {
        value: "general",
        title: "General Events",
        description:
            "Show your event in the General Events section on the home page.",
        icon: CalendarDays,
    },
];

const ListYourEventModal = ({
    isOpen,
    onClose,
}) => {
    const [formData, setFormData] = useState(initialForm);
    const [coverImage, setCoverImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setSubmitError("Please select a valid image file.");
            return;
        }

        setSubmitError("");
        setCoverImage(file);

        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setCoverImage(null);
        setImagePreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!coverImage) {
            setSubmitError(
                "Please upload an event cover image."
            );
            return;
        }

        if (!formData.category) {
            setSubmitError("Please select an event category.");
            return;
        }

        if (
            formData.category === "other" &&
            !formData.otherCategory.trim()
        ) {
            setSubmitError("Please enter your event category.");
            return;
        }

        if (!formData.displaySection) {
            setSubmitError(
                "Please select where you want your event to appear."
            );
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError("");

            // -----------------------------------------
            // FINAL CATEGORY
            // -----------------------------------------

            const finalCategory = formData.category;

            const customCategory = formData.category === "other" ? formData.otherCategory.trim() : "";

            // -----------------------------------------
            // 1. CREATE EVENT DOCUMENT
            // -----------------------------------------

            const eventsRef = collection(
                db,
                "event_submissions"
            );

            const eventDoc = await addDoc(eventsRef, {
                eventName: formData.eventName.trim(),
                organizedBy: formData.organizedBy.trim(),
                startDate: formData.startDate,
                endDate: formData.endDate,
                time: formData.startDate
                    ? new Date(formData.startDate).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                    })
                    : "",
                category: finalCategory,
                otherCategory: customCategory,
                venue: formData.venue.trim(),
                description: formData.description.trim(),
                pricing: formData.pricing.trim(),
                bookingUrl: formData.bookingUrl.trim(),
                displaySection: formData.displaySection,
                status: "published",
                source: "outsold",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // -----------------------------------------
            // 2. UPLOAD COVER IMAGE
            // -----------------------------------------

            const imageRef = ref(
                storage,
                `event-submissions/${eventDoc.id}/${coverImage.name}`
            );

            await uploadBytes(
                imageRef,
                coverImage
            );

            // -----------------------------------------
            // 3. GET IMAGE URL
            // -----------------------------------------

            const imageUrl =
                await getDownloadURL(imageRef);

            // -----------------------------------------
            // 4. UPDATE DOCUMENT WITH IMAGE DATA
            // -----------------------------------------

            await updateDoc(
                doc(
                    db,
                    "event_submissions",
                    eventDoc.id
                ),
                {
                    coverImage: imageUrl,
                    coverImageUrl: imageUrl,
                    coverImageDesktop: imageUrl,
                    coverImageMobile: imageUrl,

                    updatedAt: serverTimestamp(),
                }
            );

            // -----------------------------------------
            // 5. SUCCESS
            // -----------------------------------------

            setIsSubmitted(true);
        } catch (error) {
            console.error(
                "Failed to submit event:",
                error
            );

            setSubmitError(
                error?.message ||
                "Something went wrong while submitting your event."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;

        setFormData(initialForm);
        setCoverImage(null);
        setImagePreview("");
        setIsSubmitted(false);
        setSubmitError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#182322]/45 p-3 backdrop-blur-sm sm:p-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            handleClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 20,
                            scale: 0.97,
                        }}
                        transition={{
                            duration: 0.25,
                            ease: "easeOut",
                        }}
                        className="relative flex h-[70vh] max-h-[70vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-[#182322]/10 bg-[#fffdf5] shadow-[0_30px_100px_rgba(24,35,34,0.25)] sm:h-auto sm:max-h-[94vh]"
                    >
                        {/* HEADER */}

                        <div className="flex shrink-0 items-center justify-between border-b border-[#182322]/10 bg-[#fffdf5] px-5 py-4 sm:px-7">
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-md bg-[#FEDF24]" />

                                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#44807F]">
                                        OutSold
                                    </span>
                                </div>

                                <h2 className="text-xl font-black tracking-tight text-[#182322] sm:text-2xl">
                                    List Your Event (free of cost)
                                </h2>

                                <p className="mt-0.5 text-xs text-[#182322]/55 sm:text-sm">
                                    Promote your event on OutSold and
                                    send users directly to your ticketing
                                    platform.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#182322]/5 text-[#182322]/60 transition-all hover:bg-[#182322] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* CONTENT */}

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {isSubmitted ? (
                                <div className="flex min-h-[500px] flex-col items-center justify-center px-6 py-12 text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FEDF24] text-[#182322]">
                                        <CheckCircle2
                                            size={42}
                                            strokeWidth={2.5}
                                        />
                                    </div>

                                    <h3 className="mt-6 text-2xl font-black text-[#182322]">
                                        Event Published!
                                    </h3>

                                    <p className="mt-2 max-w-md text-sm leading-6 text-[#182322]/60">
                                        Your event has been successfully
                                        published on OutSold. Users can
                                        discover your event in the section
                                        you selected.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="mt-7 rounded-md bg-[#182322] px-7 py-3 text-sm font-black text-[#FEDF24] transition-all hover:-translate-y-0.5 hover:bg-[#44807F]"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5 px-5 py-5 sm:px-7 sm:py-6"
                                >
                                    {/* ERROR */}

                                    {submitError && (
                                        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                                            {submitError}
                                        </div>
                                    )}

                                    {/* EVENT NAME + ORGANIZED BY */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* EVENT NAME */}
                                        <div>
                                            <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                                Event Name
                                            </label>

                                            <input
                                                type="text"
                                                name="eventName"
                                                value={formData.eventName}
                                                onChange={handleChange}
                                                placeholder="e.g. Sunset Music Festival"
                                                required
                                                disabled={isSubmitting}
                                                className="w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all placeholder:text-[#182322]/30 focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                            />
                                        </div>

                                        {/* ORGANIZED BY */}
                                        <div>
                                            <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                                Organized By
                                            </label>

                                            <input
                                                type="text"
                                                name="organizedBy"
                                                value={formData.organizedBy}
                                                onChange={handleChange}
                                                placeholder="e.g. OutSold Events"
                                                required
                                                disabled={isSubmitting}
                                                className="w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all placeholder:text-[#182322]/30 focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                            />
                                        </div>
                                    </div>

                                    {/* CATEGORY */}

                                    <div>
                                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                            Event Category
                                        </label>

                                        <div
                                            className={
                                                formData.category === "other"
                                                    ? "flex flex-col gap-3 sm:flex-row"
                                                    : "w-full"
                                            }
                                        >
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className={
                                                    formData.category === "other"
                                                        ? "w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60 sm:w-[42%]"
                                                        : "w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                                }
                                            >
                                                <option value="">
                                                    Select category
                                                </option>

                                                {categoryOptions.map(
                                                    (category) => (
                                                        <option
                                                            key={category}
                                                            value={category.toLowerCase()}
                                                        >
                                                            {category}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            {formData.category === "other" && (
                                                <input
                                                    type="text"
                                                    name="otherCategory"
                                                    value={formData.otherCategory}
                                                    onChange={handleChange}
                                                    placeholder="Enter your category"
                                                    required
                                                    disabled={isSubmitting}
                                                    autoFocus
                                                    className="w-full flex-1 rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all placeholder:text-[#182322]/30 focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* DATES */}
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">

                                        {/* START DATE */}
                                        <div>
                                            <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                                <CalendarDays size={14} />
                                                Start Date
                                            </label>

                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                            />
                                        </div>

                                        {/* END DATE */}
                                        <div>
                                            <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                                <CalendarDays size={14} />
                                                End Date
                                                <span className="text-[10px] font-semibold normal-case tracking-normal text-[#182322]/35">
                                                    (Optional)
                                                </span>
                                            </label>

                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                className="w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                            />
                                        </div>

                                    </div>

                                    {/* COVER IMAGE */}

                                    <div>
                                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                            Event Cover Image
                                        </label>

                                        {imagePreview ? (
                                            <div className="relative overflow-hidden rounded-md border border-[#182322]/10 bg-white">
                                                <img
                                                    src={imagePreview}
                                                    alt="Event cover preview"
                                                    className="h-48 w-full object-cover sm:h-56"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    disabled={isSubmitting}
                                                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#182322] text-white shadow-lg transition-all hover:bg-red-500 disabled:opacity-50"
                                                >
                                                    <X size={17} />
                                                </button>

                                                <div className="absolute bottom-3 left-3 max-w-[80%] truncate rounded-md bg-[#fffdf5]/90 px-3 py-1.5 text-[11px] font-bold text-[#182322] backdrop-blur">
                                                    {coverImage?.name}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                disabled={isSubmitting}
                                                className="group flex min-h-[170px] w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-[#182322]/15 bg-white px-5 text-center transition-all hover:border-[#FEDF24] hover:bg-[#FEDF24]/5 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#FEDF24] text-[#182322] transition-transform group-hover:scale-105">
                                                    <ImagePlus size={23} />
                                                </div>

                                                <span className="mt-3 text-sm font-black text-[#182322]">
                                                    Upload cover image
                                                </span>

                                                <span className="mt-1 text-xs text-[#182322]/45">
                                                    Recommended: 1600 × 1000 px (8:5) • JPG, PNG or WEBP
                                                </span>
                                            </button>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* VENUE */}

                                    <div>
                                        <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                            <MapPin size={14} />
                                            Event Venue
                                        </label>

                                        <input
                                            type="text"
                                            name="venue"
                                            value={formData.venue}
                                            onChange={handleChange}
                                            placeholder="e.g. NSIC Exhibition Complex, New Delhi"
                                            required
                                            disabled={isSubmitting}
                                            className="w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all placeholder:text-[#182322]/30 focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                        />
                                    </div>

                                    {/* DESCRIPTION */}
                                    <div>
                                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                            Event Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Tell people what makes your event worth attending..."
                                            rows={5}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full resize-none rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold leading-6 text-[#182322] outline-none transition-all placeholder:text-[#182322]/30 focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                        />
                                    </div>

                                    {/* PRICING */}
                                    <div className="-mt-2">
                                        <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                            <Ticket size={14} />
                                            Pricing
                                        </label>

                                        <input
                                            type="text"
                                            name="pricing"
                                            value={formData.pricing}
                                            onChange={handleChange}
                                            placeholder="e.g. ₹999 onwards / Free Entry"
                                            required
                                            disabled={isSubmitting}
                                            className="w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all placeholder:text-[#182322]/30 focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                        />
                                    </div>

                                    {/* BOOKING URL */}

                                    <div>
                                        <label className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                            <Link2 size={14} />
                                            Ticket Booking URL
                                        </label>

                                        <input
                                            type="url"
                                            name="bookingUrl"
                                            value={formData.bookingUrl}
                                            onChange={handleChange}
                                            placeholder="https://in.bookmyshow.com/..."
                                            required
                                            disabled={isSubmitting}
                                            className="w-full rounded-md border border-[#182322]/10 bg-white px-4 py-3 text-sm font-semibold text-[#182322] outline-none transition-all placeholder:text-[#182322]/30 focus:border-[#FEDF24] focus:ring-4 focus:ring-[#FEDF24]/15 disabled:opacity-60"
                                        />

                                        <div className="mt-2 flex items-start gap-2 rounded-md bg-[#44807F]/8 px-3 py-2.5">
                                            <Link2
                                                size={14}
                                                className="mt-0.5 shrink-0 text-[#44807F]"
                                            />

                                            <p className="text-[11px] leading-5 text-[#182322]/55">
                                                Users will be redirected to
                                                this link to book their
                                                tickets.
                                            </p>
                                        </div>
                                    </div>

                                    {/* EVENT PLACEMENT */}

                                    <div>
                                        <div className="mb-3">
                                            <label className="block text-xs font-black uppercase tracking-[0.08em] text-[#182322]/70">
                                                Where should your event appear?
                                            </label>

                                            <p className="mt-1 text-xs leading-5 text-[#182322]/50">
                                                Choose where your event will
                                                be displayed across OutSold.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {placementOptions.map(
                                                (option) => {
                                                    const Icon = option.icon;

                                                    const selected =
                                                        formData.displaySection ===
                                                        option.value;

                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    displaySection:
                                                                        prev.displaySection === option.value
                                                                            ? ""
                                                                            : option.value,
                                                                }))
                                                            }
                                                            disabled={
                                                                isSubmitting
                                                            }
                                                            className={`flex w-full items-start gap-3 rounded-md border-2 p-4 text-left transition-all ${selected
                                                                ? "border-[#44807F] bg-[#44807F]/8 shadow-[0_5px_20px_rgba(68,128,127,0.10)]"
                                                                : "border-[#182322]/10 bg-white hover:border-[#182322]/25"
                                                                } disabled:cursor-not-allowed disabled:opacity-60`}
                                                        >
                                                            <div
                                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${selected
                                                                    ? "bg-[#44807F] text-white"
                                                                    : "bg-[#FEDF24] text-[#182322]"
                                                                    }`}
                                                            >
                                                                <Icon
                                                                    size={19}
                                                                    strokeWidth={
                                                                        2.5
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center justify-between gap-3">
                                                                    <span className="text-sm font-black text-[#182322]">
                                                                        {
                                                                            option.title
                                                                        }
                                                                    </span>

                                                                    {selected && (
                                                                        <span className="shrink-0 rounded-full bg-[#44807F] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white">
                                                                            Selected
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="mt-1 text-xs leading-5 text-[#182322]/55">
                                                                    {
                                                                        option.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    {/* SUBMIT */}

                                    <div className="flex flex-col gap-3 border-t border-[#182322]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#182322]/45">
                                            <Upload size={14} />
                                            Your event will be published
                                            immediately.
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center justify-center gap-2 rounded-md bg-[#182322] px-7 py-3.5 text-sm font-black text-[#FEDF24] shadow-[0_10px_25px_rgba(24,35,34,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#44807F] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2
                                                        size={17}
                                                        className="animate-spin"
                                                    />
                                                    Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    Publish Event
                                                    <span className="text-lg">
                                                        →
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ListYourEventModal;