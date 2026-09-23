import { motion } from "framer-motion";
import {
    Quote,
    Sparkles,
    Users,
    MessageCircle,
    Heart,
} from "lucide-react";

const testimonialPreview = [
    {
        icon: Users,
        title: "Organizer Stories",
        text: "Real experiences from people creating unforgettable events.",
    },
    {
        icon: MessageCircle,
        title: "Honest Feedback",
        text: "See what organizers and attendees have to say about OutSold.",
    },
    {
        icon: Heart,
        title: "Built Together",
        text: "Every story helps us build a better event experience.",
    },
];

const Testimonials = () => {
    return (
        <section
            id="testimonials"
            className="relative overflow-hidden bg-[#D5E7E4] py-20 text-[#17302E] sm:py-28 lg:py-32"
        >
            {/* ================= BACKGROUND ATMOSPHERE ================= */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                {/* Main Teal Glow */}
                <div className="absolute -left-56 top-[-120px] h-[560px] w-[560px] rounded-full bg-[#2F7775]/12 blur-[160px]" />

                {/* Yellow Glow */}
                <div className="absolute -right-52 top-[15%] h-[520px] w-[520px] rounded-full bg-[#FEDF24]/18 blur-[150px]" />

                {/* Bottom Teal Glow */}
                <div className="absolute bottom-[-250px] left-[25%] h-[520px] w-[520px] rounded-full bg-[#2F7775]/10 blur-[150px]" />

                {/* Small Yellow Center Glow */}
                <div className="absolute left-[45%] top-[40%] h-[280px] w-[280px] rounded-full bg-[#FEDF24]/8 blur-[120px]" />
            </div>

            {/* ================= DECORATIVE RINGS ================= */}
            <div className="pointer-events-none absolute -left-24 top-1/2 h-48 w-48 rounded-full border border-[#2F7775]/15 sm:h-72 sm:w-72" />

            <div className="pointer-events-none absolute -right-24 top-1/3 h-56 w-56 rounded-full border border-[#FEDF24]/20 sm:h-80 sm:w-80" />

            {/* ================= TOP ACCENT ================= */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#FEDF24]/70 to-transparent" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

                {/* ================= HEADER ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#2F7775]/25 bg-[#F2F8F6]/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#246765] shadow-sm backdrop-blur-md sm:text-xs">
                        <Sparkles
                            size={14}
                            className="text-[#b69d00]"
                        />
                        Voices From The Community
                    </div>

                    {/* Heading */}
                    <h2 className="mt-7 text-4xl font-black leading-[1.05] tracking-[-0.05em] text-[#17302E] sm:text-5xl md:text-6xl">
                        Real Experiences.
                        <span className="block bg-gradient-to-r from-[#246765] via-[#4C8C88] to-[#B69D00] bg-clip-text text-transparent">
                            Real Stories.
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#17302E]/60 sm:text-base sm:leading-8 md:text-lg">
                        The best way to understand OutSold is through the people
                        who use it. Organizer and attendee stories are coming
                        soon.
                    </p>
                </motion.div>

                {/* ================= QUOTE VISUAL ================= */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: 0.25,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative mx-auto mt-12 flex h-28 w-28 items-center justify-center sm:mt-14 sm:h-32 sm:w-32"
                >
                    {/* Teal Glow */}
                    <div className="absolute inset-0 rounded-full bg-[#2F7775]/15 blur-2xl" />

                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border border-[#2F7775]/20" />

                    {/* Yellow Dashed Ring */}
                    <div className="absolute inset-3 rounded-full border border-dashed border-[#FEDF24]/40" />

                    {/* Quote Box */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F7775] to-[#5F9E9A] shadow-xl shadow-[#2F7775]/20 sm:h-20 sm:w-20">
                        <Quote
                            size={30}
                            strokeWidth={2}
                            className="text-[#FEDF24] sm:h-9 sm:w-9"
                        />
                    </div>

                    {/* Floating Yellow Dot */}
                    <motion.span
                        animate={{
                            scale: [1, 1.35, 1],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="absolute right-0 top-2 h-3 w-3 rounded-full bg-[#FEDF24] shadow-[0_0_15px_rgba(254,223,36,0.7)]"
                    />
                </motion.div>

                {/* ================= FEATURED MESSAGE ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="mx-auto mt-8 max-w-3xl text-center"
                >
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#17302E]/35">
                        Coming Soon
                    </p>

                    <h3 className="mt-3 text-2xl font-black leading-tight text-[#17302E] sm:text-3xl">
                        Your story could be
                        <span className="ml-2 bg-gradient-to-r from-[#B69D00] to-[#2F7775] bg-clip-text text-transparent">
                            the next one.
                        </span>
                    </h3>
                </motion.div>

                {/* ================= TESTIMONIAL PREVIEW CARDS ================= */}
                <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
                    {testimonialPreview.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                whileHover={{ y: -6 }}
                                className="group relative overflow-hidden rounded-3xl border border-[#2F7775]/15 bg-[#EDF5F2]/90 p-6 shadow-lg shadow-[#17302E]/[0.07] backdrop-blur-md transition duration-300 hover:border-[#2F7775]/35 hover:bg-[#F5F9F7] sm:p-7"
                            >
                                {/* Card Glow */}
                                <div
                                    className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-[55px] ${
                                        index === 1
                                            ? "bg-[#FEDF24]/18"
                                            : "bg-[#2F7775]/12"
                                    }`}
                                />

                                {/* Quote Mark */}
                                <div className="absolute right-5 top-5 text-4xl font-black leading-none text-[#2F7775]/[0.07]">
                                    “
                                </div>

                                <div className="relative">

                                    {/* Icon */}
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                            index === 1
                                                ? "bg-[#FEDF24]/20 text-[#A58F00]"
                                                : "bg-[#2F7775]/12 text-[#2F7775]"
                                        }`}
                                    >
                                        <Icon size={21} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="mt-5 text-base font-black text-[#17302E]">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-2 text-sm leading-6 text-[#17302E]/55">
                                        {item.text}
                                    </p>

                                    {/* Placeholder Lines */}
                                    <div className="mt-6 space-y-2">
                                        <div className="h-2 w-full rounded-full bg-[#2F7775]/[0.07]" />
                                        <div className="h-2 w-[72%] rounded-full bg-[#FEDF24]/20" />
                                    </div>
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#FEDF24] to-[#2F7775] transition-all duration-500 group-hover:w-full" />
                            </motion.div>
                        );
                    })}
                </div>

                {/* ================= BOTTOM COMMUNITY STRIP ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.7 }}
                    className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-[#2F7775]/18 bg-[#EDF5F2]/80 shadow-lg shadow-[#17302E]/[0.05] backdrop-blur-md"
                >
                    <div className="flex flex-col items-center justify-between gap-5 p-6 text-center sm:flex-row sm:p-7 sm:text-left">

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2F7775]">
                                Growing With You
                            </p>

                            <h4 className="mt-2 text-lg font-black text-[#17302E] sm:text-xl">
                                Every event creates a new story.
                            </h4>
                        </div>

                        {/* Yellow Status Pill */}
                        <div className="flex items-center gap-3 rounded-full border border-[#FEDF24]/35 bg-[#FEDF24]/15 px-4 py-2.5 shadow-sm">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#FEDF24] shadow-[0_0_10px_rgba(254,223,36,0.7)]" />

                            <span className="text-xs font-bold text-[#17302E]/65">
                                Stories are on the way
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* ================= BOTTOM ACCENT ================= */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="mx-auto mt-10 flex max-w-xs items-center gap-3"
                >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#2F7775]/30" />

                    <span className="h-2 w-2 rounded-full bg-[#FEDF24]" />

                    <span className="h-2 w-8 rounded-full bg-gradient-to-r from-[#FEDF24] to-[#2F7775]" />

                    <span className="h-2 w-2 rounded-full bg-[#2F7775]" />

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FEDF24]/30" />
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;