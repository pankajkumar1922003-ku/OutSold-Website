import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    image: "/Testimonials/Tanisha.jpeg",
    name: "Tanisha Malhotra",
    company: "SogaRuns",
    quote: "As our running community grew, we wanted sign-ups to feel as easy as the runs themselves. Outsold made registering simple for everyone, even runners who aren't big on apps.",
  },
  {
    image: "/Testimonials/Anmol Malik.jpeg",
    name: "Anmol Malik",
    company: "MDFK",
    quote: "Ticket tiers and early-bird drops are super easy to set up on Outsold. Our crowd books in a few taps, and we can focus on the night itself.",
  },
  {
    image: "/Testimonials/Roopam Sogaruns.jpeg",
    name: "Roopam Yaduvanshi",
    company: "Aao Twist Karein",
    quote: "Trips come with a lot of questions and planning, and Outsold makes the booking and payment side feel effortless. We spend our time on the experience instead of the admin.",
  },
  {
    image: "/Testimonials/Yukti Pandey.jpeg",
    name: "Yukti Pandey",
    company: "SogaRuns",
    quote: "Early-morning check-ins are now quick and calm, so we start on time and the energy stays high. It's one less thing on our minds before a run.",
  },
  {
    image: "/Testimonials/Akansha ATMH.jpeg",
    name: "Akanksha Tagotra",
    company: "Atmovement House",
    quote: "I love seeing who's coming before a session starts. It helps us plan the space and the flow, and every session feels well put together.",
  },
  {
    image: "/Testimonials/Tejasvi.jpeg",
    name: "Tejasvi Deva",
    company: "Soul Stories",
    quote: "Our nights are small and personal, so I wanted ticketing that didn't feel cold or corporate. Outsold works quietly in the background, and people show up knowing exactly what to expect.",
  },
  {
    image: "/Testimonials/Ashish Rawat.jpeg",
    name: "Ashish Rawat",
    company: "ACCESSDENIED",
    quote: "For a rave, the door is everything. Outsold handles capped entries and quick scanning, and the live sales view tells us exactly when to push the next drop.",
  },
  {
    image: "/Testimonials/Apurv.jpeg",
    name: "Apruv Rai",
    company: "Atmovement House",
    quote: "Outsold lets people book their spot in seconds, and we always know who's walking in. It fits right into how we run our sessions.",
  },
];

const Testimonials = () => {
  const scrollerRef = useRef(null);
  const firstGroupRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef(null);
  const userInteractingRef = useRef(false);

  const [active, setActive] = useState(0);

  const speed = 35;
  const resumeDelay = 1000;

  const getCards = useCallback(() => {
    return firstGroupRef.current ? Array.from(firstGroupRef.current.querySelectorAll("[data-card]")) : [];
  }, []);

  const getLoopWidth = useCallback(() => {
    const group = firstGroupRef.current;

    if (!group) return 0;

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
    const currentPosition = loopWidth > 0 ? el.scrollLeft % loopWidth : el.scrollLeft;

    let closest = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - getPad() - currentPosition);

      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActive(closest);
  }, [getCards, getLoopWidth, getPad]);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      draggingRef.current = false;
      userInteractingRef.current = false;
      pausedRef.current = false;

      const el = scrollerRef.current;
      const loopWidth = getLoopWidth();

      if (el && loopWidth > 0) {
        positionRef.current = el.scrollLeft % loopWidth;
      }
    }, resumeDelay);
  }, [getLoopWidth]);

  /* =========================================================
     SEAMLESS MARQUEE
  ========================================================= */

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

      if (loopWidth > 0 && !userInteractingRef.current) {
        positionRef.current = el.scrollLeft % loopWidth;
      }
    };

    const pause = () => {
      if (!userInteractingRef.current) {
        pausedRef.current = true;
      }
    };

    const resume = () => {
      if (!userInteractingRef.current) {
        pausedRef.current = false;
        lastTimestamp = 0;
      }
    };

    const handleTouchStart = () => {
      userInteractingRef.current = true;
      draggingRef.current = true;
      pausedRef.current = true;

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };

    const handleTouchMove = () => {
      userInteractingRef.current = true;
      draggingRef.current = true;
      pausedRef.current = true;

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };

    const handleTouchEnd = () => {
      draggingRef.current = false;
      scheduleResume();
    };

    const handleTouchCancel = () => {
      draggingRef.current = false;
      scheduleResume();
    };

    frameId = requestAnimationFrame(animate);
    animationRef.current = frameId;

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    window.addEventListener("resize", syncPosition);

    return () => {
      cancelAnimationFrame(frameId);

      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }

      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchCancel);

      window.removeEventListener("resize", syncPosition);
    };
  }, [getLoopWidth, scheduleResume]);

  /* =========================================================
     MANUAL SCROLL
  ========================================================= */

  const handleScroll = useCallback(() => {
    updateActive();

    if (userInteractingRef.current) {
      pausedRef.current = true;
      scheduleResume();
    }
  }, [scheduleResume, updateActive]);

  /* =========================================================
     GO TO CARD
  ========================================================= */

  const goTo = (index) => {
    const el = scrollerRef.current;
    const card = getCards()[index];

    if (!el || !card) return;

    pausedRef.current = true;
    userInteractingRef.current = true;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    const target = card.offsetLeft - getPad();

    el.scrollTo({
      left: target,
      behavior: "smooth",
    });

    resumeTimerRef.current = setTimeout(() => {
      const loopWidth = getLoopWidth();

      positionRef.current = loopWidth > 0 ? el.scrollLeft % loopWidth : el.scrollLeft;

      userInteractingRef.current = false;
      draggingRef.current = false;
      pausedRef.current = false;

      updateActive();
    }, 700);
  };

  /* =========================================================
     DESKTOP ARROWS
  ========================================================= */

  const scrollCards = (direction) => {
    const el = scrollerRef.current;
    const card = getCards()[0];

    if (!el || !card) return;

    pausedRef.current = true;
    userInteractingRef.current = true;

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    const styles = getComputedStyle(firstGroupRef.current);
    const gap = parseFloat(styles.columnGap) || 0;
    const cardWidth = card.getBoundingClientRect().width;

    el.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });

    resumeTimerRef.current = setTimeout(() => {
      const loopWidth = getLoopWidth();

      positionRef.current = loopWidth > 0 ? el.scrollLeft % loopWidth : el.scrollLeft;

      userInteractingRef.current = false;
      draggingRef.current = false;
      pausedRef.current = false;

      updateActive();
    }, 700);
  };

  /* =========================================================
     CARD
  ========================================================= */

  const renderCard = (t, i, duplicate = false) => (
    <motion.article
      key={duplicate ? `duplicate-${i}` : i}
      data-card={!duplicate ? "" : undefined}
      initial={duplicate ? false : { opacity: 0, y: 24 }}
      whileInView={duplicate ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={duplicate ? undefined : { duration: 0.6, delay: Math.min(i, 3) * 0.08 }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      className="group flex w-[68vw] h-[52vh] md:h-full max-w-[250px] shrink-0 flex-col overflow-hidden rounded-xl border-2 border-[#111] bg-white shadow-[5px_5px_0_#FEDF24] sm:w-[300px] sm:max-w-none lg:w-[320px]"
    >
      <div className="relative aspect-[5/4] w-full shrink-0 overflow-hidden border-b-2 border-[#111] bg-[#FEDF24]">
        {t.image && (
          <img src={t.image} alt={duplicate ? "" : t.name} loading="lazy" draggable="false" className="h-full w-full select-none object-cover" />
        )}

        <div className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111] bg-[#FEDF24] sm:bottom-4 sm:right-4 sm:h-12 sm:w-12">
          <Quote size={17} strokeWidth={2.4} className="text-[#111] sm:h-5 sm:w-5" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <p className="min-w-0 flex-1 break-words text-[13px] leading-relaxed text-[#111]/80 sm:text-base">
          {t.quote}
        </p>

        <div className="mt-3 min-w-0 border-t-2 border-dashed border-[#111]/15 pt-3 sm:mt-4">
          <h3 className="truncate text-[15px] font-extrabold text-[#111] sm:text-lg">
            {t.name}
          </h3>

          <span className="mt-1.5 inline-block max-w-full truncate rounded-full bg-[#FEDF24] px-2.5 py-1 text-[11px] font-semibold text-[#111] sm:mt-2 sm:px-3 sm:text-sm">
            {t.company}
          </span>
        </div>
      </div>
    </motion.article>
  );

  return (
    <section id="testimonials" className="relative w-full max-w-full overflow-hidden bg-[#FFFBEA] text-[#142522] py-2">
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
          backgroundImage: "linear-gradient(rgba(20,37,34,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(20,37,34,0.7) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative z-10 min-w-0">
        {/* Header */}

        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#111] bg-[#FEDF24] shadow-[4px_4px_0_#111] sm:mb-8 sm:h-16 sm:w-16"
          >
            <Quote size={21} strokeWidth={2.4} className="text-[#111] sm:h-6 sm:w-6" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="px-2 text-3xl font-black leading-[1.12] tracking-[-0.03em] text-[#111] sm:text-5xl md:text-6xl"
          >
            Loved by the people

            <span className="relative isolate mx-auto mt-1 block w-fit">
              <span className="absolute inset-x-[-4px] bottom-1 -z-10 h-2.5 -rotate-1 bg-[#FEDF24] sm:inset-x-[-6px] sm:h-4 md:h-5" />
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

        {/* Testimonials */}

        {testimonials.length > 0 ? (
          <>
            <div
              ref={scrollerRef}
              onScroll={handleScroll}
              className="relative mt-6 md:mt-5 flex w-full max-w-full flex-nowrap gap-4 overflow-x-auto overflow-y-hidden px-4 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-14 sm:gap-7 sm:px-6 sm:pb-12 md:gap-9 md:px-12"
              style={{ scrollBehavior: "auto", overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
            >
              {/* First group */}

              <div ref={firstGroupRef} data-marquee-group className="flex min-w-0 shrink-0 flex-nowrap gap-4 sm:gap-7 md:gap-9">
                {testimonials.map((t, i) => renderCard(t, i))}
              </div>

              {/* Duplicate group */}

              <div aria-hidden="true" className="flex min-w-0 shrink-0 flex-nowrap gap-4 sm:gap-7 md:gap-9">
                {testimonials.map((t, i) => renderCard(t, i, true))}
              </div>
            </div>

            {/* Navigation dots */}

            <div className="flex items-center justify-center gap-2 px-4" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full border-2 border-[#111] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2 sm:h-3 ${active === i ? "w-8 bg-[#FEDF24] sm:w-9" : "w-2.5 bg-white hover:bg-[#FEDF24]/60 sm:w-3"}`}
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