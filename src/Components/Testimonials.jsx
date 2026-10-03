
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-EioqUhVdVh3Abj98KfEin098Q_BopLzC6JsUxen0Q&s=10",
    name: "Tanisha Malhotra",
    company: "SogaRuns",
    quote: "",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-EioqUhVdVh3Abj98KfEin098Q_BopLzC6JsUxen0Q&s=10",
    name: "Roopam Yaduvanshi",
    company: "Aao Twist Karein",
    quote: "",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-EioqUhVdVh3Abj98KfEin098Q_BopLzC6JsUxen0Q&s=10",
    name: "Yukti Pandey",
    company: "SogaRuns",
    quote: "",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-EioqUhVdVh3Abj98KfEin098Q_BopLzC6JsUxen0Q&s=10",
    name: "Akanksha Tagotra",
    company: "Atmovement House",
    quote: "",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-EioqUhVdVh3Abj98KfEin098Q_BopLzC6JsUxen0Q&s=10",
    name: "Tejasvi Deva",
    company: "Soul Stories",
    quote: "",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-EioqUhVdVh3Abj98KfEin098Q_BopLzC6JsUxen0Q&s=10",
    name: "Ashish Rawat",
    company: "ACCESSDENIED",
    quote: "",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe-EioqUhVdVh3Abj98KfEin098Q_BopLzC6JsUxen0Q&s=10",
    name: "Apruv Rai",
    company: "Atmovement House",
    quote: "",
  },
];

const Testimonials = () => {
  const scrollerRef = useRef(null);
  const firstGroupRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);    
  const [active, setActive] = useState(0);

  const speed = 35; // Pixels per second; lower means slower

  const getCards = useCallback(() => {
    return firstGroupRef.current
      ? Array.from(firstGroupRef.current.querySelectorAll("[data-card]"))
      : [];
  }, []);

  const getLoopWidth = useCallback(() => {
    const group = firstGroupRef.current;
    if (!group) return 0;

    // Includes the complete first group and its internal card gaps.
    return group.getBoundingClientRect().width;
  }, []);

  const getPad = useCallback(() => {
    const el = scrollerRef.current;
    return el ? parseFloat(getComputedStyle(el).paddingLeft) || 0 : 0;
  }, []);

  const updateActive = useCallback(() => {
    const el = scrollerRef.current;
    const cards = getCards();

    if (!el || !cards.length) return;

    const loopWidth = getLoopWidth();
    const currentPosition =
      loopWidth > 0 ? el.scrollLeft % loopWidth : el.scrollLeft;

    let closest = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(
        card.offsetLeft - getPad() - currentPosition
      );

      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActive(closest);
  }, [getCards, getLoopWidth, getPad]);

  // Seamless, constant-speed marquee animation.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let frameId;
    let lastTimestamp = 0;

    const animate = (timestamp) => {
      if (!el || !el.isConnected) return;

      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const delta = Math.min(timestamp - lastTimestamp, 32);
      lastTimestamp = timestamp;

      const loopWidth = getLoopWidth();

      if (!pausedRef.current && !draggingRef.current && loopWidth > 0) {
        positionRef.current += (speed * delta) / 1000;

        // Wrap by exactly one group width to keep the loop continuous.
        if (positionRef.current >= loopWidth) {
          positionRef.current %= loopWidth;
        }

        el.scrollLeft = positionRef.current;
      }

      frameId = requestAnimationFrame(animate);
      animationRef.current = frameId;
    };

    const syncPosition = () => {
      const loopWidth = getLoopWidth();

      if (loopWidth > 0) {
        positionRef.current = el.scrollLeft % loopWidth;
      }
    };

    const pause = () => {
      pausedRef.current = true;
    };

    const resume = () => {
      pausedRef.current = false;
      lastTimestamp = 0;
    };

    frameId = requestAnimationFrame(animate);
    animationRef.current = frameId;

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("touchcancel", resume, { passive: true });
    window.addEventListener("resize", syncPosition);

    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("touchcancel", resume);
      window.removeEventListener("resize", syncPosition);
    };
  }, [getLoopWidth]);

  const goTo = (index) => {
    const el = scrollerRef.current;
    const card = getCards()[index];

    if (!el || !card) return;

    pausedRef.current = true;

    const target =
      card.offsetLeft - getPad();

    el.scrollTo({
      left: target,
      behavior: "smooth",
    });

    // Resume marquee after manual navigation.
    window.setTimeout(() => {
      if (!el.isConnected) return;

      const loopWidth = getLoopWidth();
      positionRef.current =
        loopWidth > 0 ? el.scrollLeft % loopWidth : el.scrollLeft;

      pausedRef.current = false;
      updateActive();
    }, 500);
  };

  const scrollCards = (direction) => {
    const el = scrollerRef.current;
    const card = getCards()[0];

    if (!el || !card) return;

    pausedRef.current = true;

    const styles = getComputedStyle(firstGroupRef.current);
    const gap = parseFloat(styles.columnGap) || 0;
    const cardWidth = card.getBoundingClientRect().width;

    el.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });

    window.setTimeout(() => {
      if (!el.isConnected) return;

      const loopWidth = getLoopWidth();
      positionRef.current =
        loopWidth > 0 ? el.scrollLeft % loopWidth : el.scrollLeft;

      pausedRef.current = false;
      updateActive();
    }, 500);
  };

  const renderCard = (t, i, duplicate = false) => (
    <motion.article
      key={duplicate ? `duplicate-${i}` : i}
      data-card={!duplicate ? "" : undefined}
      initial={duplicate ? false : { opacity: 0, y: 24 }}
      whileInView={duplicate ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={
        duplicate
          ? undefined
          : { duration: 0.6, delay: Math.min(i, 3) * 0.08 }
      }
      className="group flex w-[72%] shrink-0 flex-col overflow-hidden rounded-2xl border-2 border-[#111] bg-white shadow-[5px_5px_0_#FEDF24] sm:w-[300px] lg:w-[320px]"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden border-b-2 border-[#111] bg-[#FEDF24]">
        {t.image && (
          <img
            src={t.image}
            alt={duplicate ? "" : t.name}
            loading="lazy"
            draggable="false"
            className="h-full w-full select-none object-cover"
          />
        )}

        <div className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#111] bg-[#FEDF24]">
          <Quote size={20} strokeWidth={2.4} className="text-[#111]" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex-1 text-[15px] leading-relaxed text-[#111]/80 sm:text-base">
          {t.quote}
        </p>

        <div className="mt-4 border-t-2 border-dashed border-[#111]/15 pt-3">
          <h3 className="truncate text-lg font-extrabold text-[#111]">
            {t.name}
          </h3>

          <span className="mt-2 inline-block max-w-full truncate rounded-full bg-[#FEDF24] px-3 py-1 text-sm font-semibold text-[#111]">
            {t.company}
          </span>
        </div>
      </div>
    </motion.article>
  );

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#FFFBEA] py-8 text-[#142522]"
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-52 top-10 h-[520px] w-[520px] rounded-full bg-[#FEDF24]/20 blur-[150px]" />
        <div className="absolute -right-52 top-[20%] h-[600px] w-[600px] rounded-full bg-[#44807F]/15 blur-[160px]" />
        <div className="absolute bottom-[-220px] left-[25%] h-[500px] w-[500px] rounded-full bg-[#FEDF24]/15 blur-[150px]" />
        <div className="absolute left-[48%] top-[30%] h-[300px] w-[300px] rounded-full bg-[#44807F]/10 blur-[120px]" />
      </div>

      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,37,34,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(20,37,34,0.7) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#111] bg-[#FEDF24] shadow-[4px_4px_0_#111]"
          >
            <Quote size={24} strokeWidth={2.4} className="text-[#111]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl font-black leading-[1.15] tracking-[-0.03em] text-[#111] sm:text-5xl md:text-6xl"
          >
            Loved by the people
            <span className="relative isolate mx-auto mt-1 block w-fit">
              <span className="absolute inset-x-[-6px] bottom-1 -z-10 h-3 -rotate-1 bg-[#FEDF24] sm:h-4 md:h-5" />
              who host with us.
            </span>
          </motion.h2>
        </div>

        {/* Desktop controls */}
        <div className="mx-auto mt-8 hidden max-w-7xl justify-end gap-3 px-12 md:flex">
          <button
            type="button"
            onClick={() => scrollCards(-1)}
            aria-label="Scroll testimonials left"
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#142522] bg-white/80 text-[#142522] shadow-[3px_3px_0_#44807F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FEDF24] hover:shadow-[4px_4px_0_#142522] active:translate-y-0"
          >
            <ChevronLeft size={23} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={() => scrollCards(1)}
            aria-label="Scroll testimonials right"
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#142522] bg-white/80 text-[#142522] shadow-[3px_3px_0_#44807F] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FEDF24] hover:shadow-[4px_4px_0_#142522] active:translate-y-0"
          >
            <ChevronRight size={23} strokeWidth={2.5} />
          </button>
        </div>

        {testimonials.length > 0 ? (
          <>
            {/* Marquee viewport */}
            <div
              ref={scrollerRef}
              onScroll={updateActive}
              className="relative mt-14 flex flex-nowrap gap-7 overflow-x-auto px-6 pb-12 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-9 md:px-12"
              style={{
                scrollBehavior: "auto",
                overscrollBehaviorX: "contain",
              }}
            >
              {/* First group */}
              <div
                ref={firstGroupRef}
                data-marquee-group
                className="flex shrink-0 flex-nowrap gap-7 md:gap-9"
              >
                {testimonials.map((t, i) => renderCard(t, i))}
              </div>

              {/* Identical second group makes the loop seamless */}
              <div
                aria-hidden="true"
                className="flex shrink-0 flex-nowrap gap-7 md:gap-9"
              >
                {testimonials.map((t, i) => renderCard(t, i, true))}
              </div>
            </div>

            {/* Navigation dots */}
            <div
              className="flex items-center justify-center gap-2.5"
              role="tablist"
              aria-label="Testimonial navigation"
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-3 rounded-full border-2 border-[#111] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2 ${
                    active === i
                      ? "w-9 bg-[#FEDF24]"
                      : "w-3 bg-white hover:bg-[#FEDF24]/60"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-14 px-6 text-center text-sm text-[#111]/50">
            Testimonials array me data add karo, cards yahan dikhenge.
          </p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;