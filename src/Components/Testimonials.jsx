import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Quote,
    Star,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Building2,
} from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Rahul Sharma",
        role: "Event Organizer",
        company: "Pulse Events",
        image: "https://i.pravatar.cc/300?img=12",
        review:
            "This platform completely changed how we manage our events. From ticket sales to attendee management, everything is finally available in one place.",
    },
    {
        id: 2,
        name: "Priya Mehta",
        role: "Founder",
        company: "The Experience Co.",
        image: "https://i.pravatar.cc/300?img=47",
        review:
            "Managing registrations and tracking ticket sales used to require multiple tools. Now our entire event workflow is much simpler and more organized.",
    },
    {
        id: 3,
        name: "Arjun Malhotra",
        role: "Event Manager",
        company: "NextGen Experiences",
        image: "https://i.pravatar.cc/300?img=33",
        review:
            "The analytics and attendee management features give us complete visibility over our events. It saves our team a significant amount of time.",
    },
];

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextTestimonial = () => {
        setActiveIndex((prev) =>
            prev === testimonials.length - 1 ? 0 : prev + 1
        );
    };

    const previousTestimonial = () => {
        setActiveIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    const activeTestimonial = testimonials[activeIndex];

    return (
        <section
            id="testimonials"
            className="relative overflow-hidden bg-[#F7FAF9] py-14 sm:py-20"
        >
            {/* Background Decorations */}
            <div className="absolute -left-40 top-1/3 h-[450px] w-[450px] rounded-full bg-[#007A78]/10 blur-[150px]" />

            <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#20B2AA]/10 blur-[150px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#007A78]/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#007A78] shadow-sm">
                        <Sparkles size={15} />
                        Loved By Organizers
                    </div>

                    <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#16302E] sm:text-5xl lg:text-6xl">
                        Built For Events.

                        <span className="mt-2 block text-[#007A78]">
                            Loved By People.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#16302E]/60 sm:text-lg">
                        See what event organizers have to say about managing
                        their events with our platform.
                    </p>
                </motion.div>

                {/* Testimonial Card */}
                <div className="mx-auto mt-12 max-w-5xl">
                    <div className="relative overflow-hidden rounded-[36px] border border-[#007A78]/10 bg-white p-6 shadow-2xl shadow-[#007A78]/10 sm:p-10 lg:p-14">

                        {/* Decorative Green Area */}
                        <div className="absolute right-0 top-0 h-full w-[35%] bg-gradient-to-b from-[#007A78]/10 to-transparent" />

                        <div className="relative grid gap-10 lg:grid-cols-[0.8fr_2fr] lg:items-center">

                            {/* Profile Side */}
                            <motion.div
                                key={`profile-${activeTestimonial.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center text-center lg:items-start lg:text-left"
                            >
                                <div className="relative">
                                    <div className="absolute -inset-3 rounded-full bg-[#007A78]/10 blur-xl" />

                                    <img
                                        src={activeTestimonial.image}
                                        alt={activeTestimonial.name}
                                        className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl sm:h-32 sm:w-32"
                                    />
                                </div>

                                <h3 className="mt-6 text-xl font-bold text-[#16302E]">
                                    {activeTestimonial.name}
                                </h3>

                                <p className="mt-1 text-sm font-medium text-[#007A78]">
                                    {activeTestimonial.role}
                                </p>

                                <div className="mt-3 flex items-center gap-2 text-sm text-[#16302E]/50">
                                    <Building2 size={15} />
                                    {activeTestimonial.company}
                                </div>

                                {/* Stars */}
                                <div className="mt-5 flex gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <Star
                                            key={index}
                                            size={18}
                                            fill="#F5B301"
                                            className="text-[#F5B301]"
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Review */}
                            <div className="relative">

                                {/* Quote Icon */}
                                <Quote
                                    size={65}
                                    className="absolute -top-5 -left-2 text-[#007A78]/10 sm:-top-8"
                                />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTestimonial.id}
                                        initial={{
                                            opacity: 0,
                                            x: 30,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: -30,
                                        }}
                                        transition={{
                                            duration: 0.35,
                                        }}
                                    >
                                        <p className="relative text-xl font-medium leading-relaxed text-[#16302E] sm:text-2xl lg:text-3xl">
                                            “{activeTestimonial.review}”
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation */}
                                <div className="mt-10 flex items-center justify-between">

                                    {/* Dots */}
                                    <div className="flex gap-2">
                                        {testimonials.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setActiveIndex(index)
                                                }
                                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                                    activeIndex === index
                                                        ? "w-8 bg-[#007A78]"
                                                        : "w-2.5 bg-[#007A78]/15 hover:bg-[#007A78]/30"
                                                }`}
                                                aria-label={`Go to testimonial ${
                                                    index + 1
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Arrows */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={previousTestimonial}
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#007A78]/15 text-[#007A78] transition hover:bg-[#007A78] hover:text-white"
                                            aria-label="Previous testimonial"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <button
                                            onClick={nextTestimonial}
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#007A78] text-white shadow-lg shadow-[#007A78]/20 transition hover:bg-[#00918E]"
                                            aria-label="Next testimonial"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Points */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 text-sm font-medium text-[#16302E]/50"
                >
                    <span>✓ Easy to use</span>
                    <span>✓ Built for organizers</span>
                    <span>✓ Powerful event tools</span>
                    <span>✓ Everything in one place</span>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;

