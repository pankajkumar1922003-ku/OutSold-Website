
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const Testimonials = () => {
    return (
        <section
            id="testimonials"
            className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#FFF9D9] py-24 text-[#17302E]"
        >
            {/* Background Atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Warm Yellow Glow */}
                <div className="absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#FEDF24]/20 blur-[170px]" />

                {/* Soft Golden Glow */}
                <div className="absolute -right-40 top-1/3 h-[460px] w-[460px] rounded-full bg-[#F4C430]/15 blur-[160px]" />

                {/* Center Warm Glow */}
                <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFFDF0]/80 blur-[130px]" />

                {/* Subtle Teal Accent */}
                <div className="absolute bottom-[-180px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#44807F]/[0.06] blur-[140px]" />
            </div>

            {/* Faint Grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(173,143,25,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(173,143,25,0.8) 1px, transparent 1px)",
                    backgroundSize: "70px 70px",
                }}
            />

            {/* Top / Bottom Hairlines */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF19]/50 to-transparent" />

            <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#44807F]/25 to-transparent" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* Quote Mark */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative mx-auto mb-10 flex h-20 w-20 items-center justify-center"
                >
                    {/* Yellow Glow */}
                    <div className="absolute inset-0 rounded-full bg-[#FEDF24]/30 blur-xl" />

                    {/* Golden Border */}
                    <div className="absolute inset-0 rounded-full border border-[#D4AF19]/45" />

                    {/* Quote Circle */}
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#FEDF24] to-[#D4AF19] shadow-xl shadow-[#C79A00]/20">
                        <Quote
                            size={26}
                            strokeWidth={2.2}
                            className="text-[#17302E]"
                        />
                    </div>
                </motion.div>

                {/* Big Statement */}
                <motion.h2
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: 0.15,
                        duration: 0.8,
                    }}
                    className="text-4xl font-black leading-[1.15] tracking-[-0.03em] text-[#17302E] sm:text-5xl md:text-6xl lg:text-7xl"
                >
                    Your story could be

                    <span className="block bg-gradient-to-r from-[#B78A00] via-[#D4A900] to-[#44807F] bg-clip-text text-transparent">
                        the next one.
                    </span>
                </motion.h2>

                {/* Underline Accent */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                        delay: 0.4,
                        duration: 0.7,
                    }}
                    className="mx-auto mt-10 flex max-w-xs items-center justify-center gap-3"
                >
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF19]/50" />

                    <span className="h-2 w-2 rounded-full bg-[#D4AF19] shadow-[0_0_10px_rgba(212,169,25,0.35)]" />

                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FEDF24]/60" />
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;
