import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const TicketDownloadTemplate = React.forwardRef(
  (
    {
      ticketId,
      tierName,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      eventTitle,
      eventDate,
      eventDay,
      eventTime,
      venue,
      quantity,
      totalAmount,
      paymentMethod,
      bookingDate,
      eventImage,
      generatedAt,
    },
    ref
  ) => {
    const safeTicketId = String(ticketId || "TICKET");

    const safeTierName = String(
      tierName || "ADULTS"
    ).toUpperCase();

    const safeAttendeeName = String(
      attendeeName || "Guest"
    );

    const safeEventTitle = String(
      eventTitle || "Event"
    );

    const safeQuantity = Number(quantity || 1);

    const paidAmount = totalAmount
      ? String(totalAmount).replace(/^₹\s*/, "")
      : "0";

    const paymentText =
      paymentMethod || "UPI";

    const generatedText =
      generatedAt ||
      new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    return (
      <div
        ref={ref}
        style={{
          width: "512px",
          minHeight: "1050px",
          background: "#e8f5f6",
          padding: "28px",
          boxSizing: "border-box",
          fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
          color: "#17242b",
        }}
      >
        {/* ==================================================
            MAIN TICKET
        ================================================== */}

        <div
          style={{
            width: "100%",
            background: "#e8f5f6",
            boxSizing: "border-box",
          }}
        >
          {/* ==================================================
              HERO IMAGE
          ================================================== */}

          <div
            style={{
              position: "relative",
              width: "100%",
              height: "255px",
              overflow: "hidden",
              borderRadius:
                "28px 28px 0 0",
              background: "#9dc9e8",
            }}
          >
            {eventImage ? (
              <img
                src={eventImage}
                crossOrigin="anonymous"
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, #74b7df, #a9d6ef)",
                }}
              />
            )}

            {/* Image overlay */}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.05) 25%, rgba(20,50,70,0.48) 100%)",
              }}
            />

            {/* E-TICKET */}

            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "22px",
                padding: "7px 13px",
                borderRadius: "999px",
                background: "#ffffff",
                color: "#31586a",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.02em",
              }}
            >
              E-TICKET
            </div>

            {/* CONFIRMED */}

            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "22px",
                padding: "7px 13px",
                borderRadius: "999px",
                background: "#d8f6e8",
                color: "#2f8b66",
                fontSize: "10px",
                fontWeight: 900,
              }}
            >
              CONFIRMED
            </div>

            {/* Event title */}

            <div
              style={{
                position: "absolute",
                left: "24px",
                right: "24px",
                bottom: "22px",
                color: "#ffffff",
                fontSize: "25px",
                lineHeight: 1.08,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                textShadow:
                  "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              {safeEventTitle}
            </div>
          </div>

          {/* ==================================================
              EVENT INFORMATION
          ================================================== */}

          <div
            style={{
              display: "flex",
              width: "100%",
              minHeight: "190px",
            }}
          >
            {/* DATE */}

            <div
              style={{
                width: "145px",
                flexShrink: 0,
                background: "#60778a",
                color: "#ffffff",
                padding: "25px 20px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  lineHeight: 1,
                  fontWeight: 400,
                }}
              >
                {eventDate
                  ? new Date(
                      eventDate
                    ).getDate()
                  : ""}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {eventDate
                  ? new Date(
                      eventDate
                    )
                      .toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                        }
                      )
                      .toUpperCase()
                  : ""}
              </div>

              <div
                style={{
                  marginTop: "7px",
                  fontSize: "12px",
                  opacity: 0.9,
                }}
              >
                {eventDay ||
                  (eventDate
                    ? new Date(
                        eventDate
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "long",
                        }
                      )
                    : "")}
              </div>
            </div>

            {/* EVENT INFO */}

            <div
              style={{
                flex: 1,
                background: "#9fc7e9",
                padding: "23px 24px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "0.08em",
                  marginBottom: "3px",
                }}
              >
                SHOW STARTS
              </div>

              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 900,
                  color: "#ffffff",
                }}
              >
                {eventTime || "10:00"}
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "15px",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.25,
                }}
              >
                {venue ||
                  "Splash Water Park Delhi"}
              </div>

              {/* Buttons */}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "7px",
                  marginTop: "13px",
                }}
              >
                <div
                  style={{
                    padding: "7px 11px",
                    borderRadius: "999px",
                    background: "#ffffff",
                    color: "#426679",
                    fontSize: "9px",
                    fontWeight: 900,
                  }}
                >
                  Get directions
                </div>

                <div
                  style={{
                    padding: "7px 11px",
                    borderRadius: "999px",
                    border:
                      "1px solid rgba(255,255,255,0.9)",
                    color: "#ffffff",
                    fontSize: "9px",
                    fontWeight: 900,
                  }}
                >
                  Add to calendar
                </div>

                <div
                  style={{
                    padding: "7px 11px",
                    borderRadius: "999px",
                    border:
                      "1px solid rgba(255,255,255,0.9)",
                    color: "#ffffff",
                    fontSize: "9px",
                    fontWeight: 900,
                  }}
                >
                  Book more tickets
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              TICKET HOLDER CARD
          ================================================== */}

          <div
            style={{
              position: "relative",
              background: "#a4ccef",
              padding: "20px 18px",
              boxSizing: "border-box",
            }}
          >
            {/* Cutout left */}

            <div
              style={{
                position: "absolute",
                left: "-14px",
                top: "-15px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#e8f5f6",
              }}
            />

            {/* Cutout right */}

            <div
              style={{
                position: "absolute",
                right: "-14px",
                top: "-15px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "#e8f5f6",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "16px",
                width: "100%",
                minHeight: "255px",
                padding: "20px",
                boxSizing: "border-box",
                background: "#f4fbfa",
                borderRadius: "20px",
                border:
                  "1px solid rgba(60,100,110,0.08)",
              }}
            >
              {/* ==========================================
                  LEFT HOLDER INFO
              =========================================== */}

              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "#829096",
                    letterSpacing: "0.08em",
                    marginBottom: "4px",
                  }}
                >
                  TICKET HOLDER
                </div>

                <div
                  style={{
                    fontSize: "23px",
                    lineHeight: 1.1,
                    fontWeight: 900,
                    color: "#18252b",
                    wordBreak: "break-word",
                  }}
                >
                  {safeAttendeeName}
                </div>

                {attendeeEmail && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "10px",
                      color: "#829096",
                      wordBreak:
                        "break-all",
                    }}
                  >
                    {attendeeEmail}
                  </div>
                )}

                {attendeePhone && (
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "10px",
                      color: "#829096",
                    }}
                  >
                    {attendeePhone}
                  </div>
                )}

                {/* Tier */}

                <div
                  style={{
                    display: "inline-block",
                    marginTop: "18px",
                    padding:
                      "9px 17px",
                    borderRadius:
                      "12px",
                    background:
                      "#60778a",
                    color: "#ffffff",
                    fontSize: "17px",
                    fontWeight: 900,
                    boxShadow:
                      "0 5px 0 #28535c",
                  }}
                >
                  {safeTierName}
                </div>

                {/* Payment */}

                <div
                  style={{
                    display: "flex",
                    gap: "28px",
                    marginTop: "22px",
                    paddingTop: "12px",
                    borderTop:
                      "1px solid rgba(90,110,115,0.15)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "8px",
                        fontWeight: 800,
                        color: "#89959a",
                        letterSpacing:
                          "0.08em",
                      }}
                    >
                      PAID VIA{" "}
                      {String(
                        paymentText
                      ).toUpperCase()}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "13px",
                        fontWeight: 900,
                        color: "#82a9c8",
                      }}
                    >
                      Rs. {paidAmount}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "8px",
                        fontWeight: 800,
                        color: "#89959a",
                        letterSpacing:
                          "0.08em",
                      }}
                    >
                      BOOKED
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "12px",
                        fontWeight: 900,
                        color: "#18252b",
                      }}
                    >
                      {bookingDate ||
                        eventDate ||
                        ""}
                    </div>
                  </div>
                </div>
              </div>

              {/* ==========================================
                  QR SIDE
              =========================================== */}

              <div
                style={{
                  width: "155px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* QR box */}

                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ffffff",
                    border:
                      "3px solid #9fc7e9",
                    borderRadius: "17px",
                    boxSizing: "border-box",
                  }}
                >
                  <QRCodeCanvas
                    value={safeTicketId}
                    size={112}
                    includeMargin
                    bgColor="#FFFFFF"
                    fgColor="#111111"
                    level="H"
                  />
                </div>

                {/* Ticket number */}

                <div
                  style={{
                    marginTop: "9px",
                    fontSize: "13px",
                    fontWeight: 900,
                    color: "#9ab8d4",
                    textAlign: "center",
                  }}
                >
                  #{safeTicketId.replace(
                    /^#/,
                    ""
                  )}
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    fontSize: "8px",
                    fontWeight: 900,
                    color: "#a7c6dd",
                    letterSpacing: "0.05em",
                  }}
                >
                  SCAN AT ENTRY
                </div>

                {/* Admits */}

                <div
                  style={{
                    marginTop: "8px",
                    padding:
                      "5px 10px",
                    borderRadius:
                      "999px",
                    background:
                      "#d5f5e7",
                    color: "#48a17c",
                    fontSize: "8px",
                    fontWeight: 900,
                  }}
                >
                  ADMITS {safeQuantity}
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              GOOD TO DO
          ================================================== */}

          <div
            style={{
              marginTop: "14px",
              padding: "18px 20px 20px",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "17px",
                fontWeight: 900,
                color: "#9fc4e2",
                letterSpacing: "0.03em",
              }}
            >
              GOOD TO DO BEFORE THE EVENT
            </div>

            <div
              style={{
                marginTop: "7px",
                fontSize: "10px",
                color: "#7d898e",
                lineHeight: 1.45,
              }}
            >
              A few things to know before you
              head to the event.
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding:
                "25px 2px 5px",
              color: "#7e8b90",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "8px",
                  fontWeight: 500,
                }}
              >
                TICKET #{safeTicketId}
              </div>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "8px",
                }}
              >
                GENERATED:{" "}
                {generatedText}
              </div>
            </div>

            <div
              style={{
                padding:
                  "5px 10px",
                borderRadius:
                  "999px",
                background: "#d9f8ea",
                color: "#3c9a72",
                fontSize: "8px",
                fontWeight: 900,
              }}
            >
              VERIFIED
            </div>
          </div>

          {/* Made by */}

          <div
            style={{
              textAlign: "center",
              marginTop: "22px",
              fontSize: "8px",
              color: "#7d8a8e",
            }}
          >
            Made by{" "}
            <span
              style={{
                color: "#9fc4e2",
                fontWeight: 900,
              }}
            >
              Outsold.in
            </span>
          </div>
        </div>
      </div>
    );
  }
);

TicketDownloadTemplate.displayName =
  "TicketDownloadTemplate";

export default TicketDownloadTemplate;