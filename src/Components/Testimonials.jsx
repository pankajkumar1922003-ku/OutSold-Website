import { motion } from "framer-motion";
import {
    Quote,
    Sparkles,
    Users,
    MessageCircle,
    ArrowRight,
} from "lucide-react";

const Testimonials = () => {
    return (
        <section
            id="testimonials"
            className="relative overflow-hidden bg-[#F7FAF9] py-16 sm:py-24"
        >
            {/* ================= BACKGROUND DECORATIONS ================= */}

            <div className="pointer-events-none absolute -left-40 top-1/3 h-[450px] w-[450px] rounded-full bg-[#007A78]/10 blur-[150px]" />

            <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#20B2AA]/10 blur-[150px]" />

            {/* Subtle Grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,122,120,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,122,120,0.8) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center justify-center px-5 sm:px-8 lg:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                    className="mx-auto w-full max-w-3xl text-center"
                >
                    {/* ================= BADGE ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.15,
                            duration: 0.6,
                        }}
                        className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#007A78]/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#007A78] shadow-sm sm:px-5 sm:py-2.5"
                    >
                        <Sparkles size={15} />
                        Loved By Organizers
                    </motion.div>

                    {/* ================= ICON ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.7,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.3,
                            duration: 0.7,
                            type: "spring",
                            stiffness: 120,
                        }}
                        className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-[28px] bg-[#007A78]/15 blur-2xl" />

                        {/* Main Icon */}
                        <div className="relative flex h-full w-full items-center justify-center rounded-[26px] border border-[#007A78]/15 bg-white shadow-xl shadow-[#007A78]/10">
                            <Quote
                                size={38}
                                strokeWidth={1.5}
                                className="text-[#007A78] sm:h-11 sm:w-11"
                            />
                        </div>

                        {/* Floating Dot */}
                        <motion.span
                            animate={{
                                scale: [1, 1.25, 1],
                                opacity: [0.45, 1, 0.45],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#20B2AA] shadow-lg shadow-[#20B2AA]/40"
                        />
                    </motion.div>

                    {/* ================= HEADING ================= */}

                    <motion.h2
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.4,
                            duration: 0.7,
                        }}
                        className="text-4xl font-black leading-tight tracking-tight text-[#16302E] sm:text-5xl md:text-6xl"
                    >
                        Our Stories Are
                        <span className="mt-2 block bg-gradient-to-r from-[#007A78] via-[#00918E] to-[#20B2AA] bg-clip-text text-transparent">
                            Coming Soon.
                        </span>
                    </motion.h2>

                    {/* ================= DESCRIPTION ================= */}

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.55,
                            duration: 0.7,
                        }}
                        className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#16302E]/55 sm:text-base sm:leading-8 md:text-lg"
                    >
                        We&apos;re building something people will love.
                        Testimonials from event organizers and attendees will
                        be here soon.
                    </motion.p>

                    {/* ================= FEATURE CARDS ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.7,
                            duration: 0.7,
                        }}
                        className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        {/* Card 1 */}
                        <div className="group flex items-center gap-4 rounded-2xl border border-[#007A78]/10 bg-white p-4 text-left shadow-lg shadow-[#007A78]/5 transition duration-300 hover:-translate-y-1 hover:border-[#007A78]/20 hover:shadow-xl">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#007A78]/10 text-[#007A78] transition duration-300 group-hover:scale-110 group-hover:bg-[#007A78] group-hover:text-white">
                                <Users size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#16302E]">
                                    Real Experiences
                                </p>

                                <p className="mt-1 text-xs text-[#16302E]/45">
                                    Stories from our growing community
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group flex items-center gap-4 rounded-2xl border border-[#007A78]/10 bg-white p-4 text-left shadow-lg shadow-[#007A78]/5 transition duration-300 hover:-translate-y-1 hover:border-[#007A78]/20 hover:shadow-xl">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#007A78]/10 text-[#007A78] transition duration-300 group-hover:scale-110 group-hover:bg-[#007A78] group-hover:text-white">
                                <MessageCircle size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#16302E]">
                                    Your Voice Matters
                                </p>

                                <p className="mt-1 text-xs text-[#16302E]/45">
                                    More stories will be shared soon
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ================= STAY TUNED ================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scaleX: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                            scaleX: 1,
                        }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.9,
                            duration: 0.8,
                        }}
                        className="mx-auto mt-10 flex max-w-xs items-center gap-3"
                    >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#007A78]/25" />

                        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.25em] text-[#007A78]/60">
                            Stay Tuned
                        </span>

                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#007A78]/25" />
                    </motion.div>

                    {/* ================= DOT ANIMATION ================= */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.05 }}
                        className="mt-6 flex justify-center gap-2"
                    >
                        {[0, 1, 2].map((dot) => (
                            <motion.span
                                key={dot}
                                animate={{
                                    y: [0, -5, 0],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: dot * 0.18,
                                }}
                                className="h-1.5 w-1.5 rounded-full bg-[#007A78]"
                            />
                        ))}
                    </motion.div>

                    {/* Bottom Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2 }}
                        className="mt-7 flex items-center justify-center gap-2 text-xs text-[#16302E]/35"
                    >
                        <span>Great stories are on the way</span>

                        <ArrowRight
                            size={14}
                            className="text-[#007A78]"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
