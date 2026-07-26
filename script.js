const CORRECT_PIN = "072726";
let enteredPin = [];
let butterfliesSpawned = false;
let pinModalOpen = false;

// Cached DOM Elements for zero-overhead access
const elements = {
    messageEl: null,
    pinModal: null,
    pinModalContent: null,
    pinError: null,
    pinDots: null,
    envelopeWrapper: null,
    envelope: null,
    letterModal: null,
    letterCloseBtn: null
};

function initElements() {
    elements.messageEl = document.getElementById("instructionMessage");
    elements.pinModal = document.getElementById("pinModal");
    elements.pinModalContent = document.querySelector(".pin-modal");
    elements.pinError = document.getElementById("pinError");
    elements.pinDots = document.querySelectorAll(".pin-dot");
    elements.envelopeWrapper = document.getElementById("envelopeWrapper");
    elements.envelope = document.getElementById("envelope");
    elements.letterModal = document.getElementById("letterModal");
    elements.letterCloseBtn = document.getElementById("letterCloseBtn");
}

const startAnimation = () => {
    const c = setTimeout(() => {
        document.body.classList.remove("not-loaded");
        clearTimeout(c);

        setTimeout(() => {
            if (elements.messageEl && !butterfliesSpawned) {
                elements.messageEl.classList.add("visible");
            }
        }, 8500);
    }, 1000);
};

function spawnButterflies() {
    if (butterfliesSpawned) return;
    butterfliesSpawned = true;

    if (elements.messageEl) {
        elements.messageEl.classList.remove("visible");
        elements.messageEl.style.opacity = "0";
        elements.messageEl.style.pointerEvents = "none";
    }

    // Vector-optimized SVG creation for butterflies with natural wing geometry
    const createButterfly = (idClass) => {
        const b = document.createElement("div");
        b.className = `butterfly ${idClass} fly`;

        const isB2 = idClass === "butterfly--2";
        const primaryColor = isB2 ? "#ff75a0" : "#ff69b4";
        const secondaryColor = isB2 ? "#ff1493" : "#e60073";
        const darkBase = isB2 ? "#260318" : "#1f0214";

        b.innerHTML = `
            <div class="butterfly__body">
                <div class="butterfly__head">
                    <div class="butterfly__antenna butterfly__antenna--left"></div>
                    <div class="butterfly__antenna butterfly__antenna--right"></div>
                </div>
                <div class="butterfly__thorax"></div>
                <div class="butterfly__abdomen"></div>
            </div>
            <div class="butterfly__wing-pair butterfly__wing-pair--left">
                <svg viewBox="0 0 120 140" class="butterfly__svg-wing" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="foreGradL_${idClass}" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="${primaryColor}" />
                            <stop offset="40%" stop-color="${secondaryColor}" />
                            <stop offset="75%" stop-color="#47082e" />
                            <stop offset="100%" stop-color="${darkBase}" />
                        </linearGradient>
                        <linearGradient id="hindGradL_${idClass}" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="${secondaryColor}" />
                            <stop offset="55%" stop-color="#3d0528" />
                            <stop offset="100%" stop-color="${darkBase}" />
                        </linearGradient>
                        <radialGradient id="cellGlowL_${idClass}" cx="70%" cy="30%" r="55%">
                            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
                            <stop offset="35%" stop-color="#ffb6c1" stop-opacity="0.6" />
                            <stop offset="75%" stop-color="${secondaryColor}" stop-opacity="0.15" />
                            <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0" />
                        </radialGradient>
                        <radialGradient id="spotGlowL_${idClass}" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#ffffff" />
                            <stop offset="40%" stop-color="${primaryColor}" />
                            <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.8" />
                        </radialGradient>
                    </defs>
                    <!-- Left Forewing (Organic Curve) -->
                    <path class="butterfly__path-fore" d="M 120 45 C 105 20, 70 2, 18 5 C 4 9, 2 20, 8 30 C 18 46, 32 64, 52 78 C 76 74, 104 62, 120 45 Z" fill="url(#foreGradL_${idClass})" stroke="${primaryColor}" stroke-width="0.7" stroke-opacity="0.6" />
                    <path d="M 115 44 C 100 24, 72 10, 30 14 C 20 20, 22 30, 32 40 C 48 55, 75 62, 115 44 Z" fill="url(#cellGlowL_${idClass})" />
                    <path class="butterfly__veins" d="M 120 45 C 95 32, 60 22, 18 5 M 120 45 C 90 38, 55 35, 8 30 M 120 45 C 92 48, 65 54, 52 78 M 85 36 C 60 28, 35 15, 20 12 M 75 42 C 55 46, 38 48, 24 44" stroke="rgba(255, 182, 193, 0.45)" stroke-width="1.1" stroke-linecap="round" fill="none" />
                    
                    <!-- Left Hindwing (Organic Scalloped Edge & Swallowtail) -->
                    <path class="butterfly__path-hind" d="M 120 52 C 95 56, 60 68, 44 75 C 32 82, 26 94, 38 106 C 40 114, 34 133, 40 138 C 45 138, 52 124, 56 114 C 74 116, 102 96, 120 52 Z" fill="url(#hindGradL_${idClass})" stroke="${primaryColor}" stroke-width="0.7" stroke-opacity="0.6" />
                    <path d="M 116 54 C 95 58, 68 70, 52 78 C 44 84, 42 94, 50 102 C 68 106, 96 90, 116 54 Z" fill="url(#cellGlowL_${idClass})" />
                    <path class="butterfly__veins" d="M 120 52 C 92 62, 62 76, 44 75 M 120 52 C 85 70, 58 92, 38 106 M 120 52 C 80 82, 54 105, 40 138 M 70 66 C 55 78, 42 90, 36 98" stroke="rgba(255, 182, 193, 0.4)" stroke-width="1.0" stroke-linecap="round" fill="none" />
                    
                    <!-- Left Marginal Accent Spots -->
                    <circle cx="16" cy="18" r="1.8" fill="#ffffff" opacity="0.9" />
                    <circle cx="10" cy="26" r="1.6" fill="#ffb6c1" opacity="0.9" />
                    <circle cx="14" cy="36" r="1.5" fill="#ffffff" opacity="0.85" />
                    <circle cx="24" cy="50" r="1.4" fill="#ffb6c1" opacity="0.8" />
                    <circle cx="34" cy="62" r="1.4" fill="#ffffff" opacity="0.8" />
                    <circle cx="33" cy="94" r="2.2" fill="url(#spotGlowL_${idClass})" />
                    <circle cx="44" cy="106" r="1.8" fill="${primaryColor}" opacity="0.9" />
                </svg>
            </div>
            <div class="butterfly__wing-pair butterfly__wing-pair--right">
                <svg viewBox="0 0 120 140" class="butterfly__svg-wing" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="foreGradR_${idClass}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="${primaryColor}" />
                            <stop offset="40%" stop-color="${secondaryColor}" />
                            <stop offset="75%" stop-color="#47082e" />
                            <stop offset="100%" stop-color="${darkBase}" />
                        </linearGradient>
                        <linearGradient id="hindGradR_${idClass}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="${secondaryColor}" />
                            <stop offset="55%" stop-color="#3d0528" />
                            <stop offset="100%" stop-color="${darkBase}" />
                        </linearGradient>
                        <radialGradient id="cellGlowR_${idClass}" cx="30%" cy="30%" r="55%">
                            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
                            <stop offset="35%" stop-color="#ffb6c1" stop-opacity="0.6" />
                            <stop offset="75%" stop-color="${secondaryColor}" stop-opacity="0.15" />
                            <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0" />
                        </radialGradient>
                        <radialGradient id="spotGlowR_${idClass}" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#ffffff" />
                            <stop offset="40%" stop-color="${primaryColor}" />
                            <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.8" />
                        </radialGradient>
                    </defs>
                    <!-- Right Forewing (Organic Curve) -->
                    <path class="butterfly__path-fore" d="M 0 45 C 15 20, 50 2, 102 5 C 116 9, 118 20, 112 30 C 102 46, 88 64, 68 78 C 44 74, 16 62, 0 45 Z" fill="url(#foreGradR_${idClass})" stroke="${primaryColor}" stroke-width="0.7" stroke-opacity="0.6" />
                    <path d="M 5 44 C 20 24, 48 10, 90 14 C 100 20, 98 30, 88 40 C 72 55, 45 62, 5 44 Z" fill="url(#cellGlowR_${idClass})" />
                    <path class="butterfly__veins" d="M 0 45 C 25 32, 60 22, 102 5 M 0 45 C 30 38, 65 35, 112 30 M 0 45 C 28 48, 55 54, 68 78 M 35 36 C 60 28, 85 15, 100 12 M 45 42 C 65 46, 82 48, 96 44" stroke="rgba(255, 182, 193, 0.45)" stroke-width="1.1" stroke-linecap="round" fill="none" />
                    
                    <!-- Right Hindwing (Organic Scalloped Edge & Swallowtail) -->
                    <path class="butterfly__path-hind" d="M 0 52 C 25 56, 60 68, 76 75 C 88 82, 94 94, 82 106 C 80 114, 86 133, 80 138 C 75 138, 68 124, 64 114 C 46 116, 18 96, 0 52 Z" fill="url(#hindGradR_${idClass})" stroke="${primaryColor}" stroke-width="0.7" stroke-opacity="0.6" />
                    <path d="M 4 54 C 25 58, 52 70, 68 78 C 76 84, 78 94, 70 102 C 52 106, 24 90, 4 54 Z" fill="url(#cellGlowR_${idClass})" />
                    <path class="butterfly__veins" d="M 0 52 C 28 62, 58 76, 76 75 M 0 52 C 35 70, 62 92, 82 106 M 0 52 C 40 82, 66 105, 80 138 M 50 66 C 65 78, 78 90, 84 98" stroke="rgba(255, 182, 193, 0.4)" stroke-width="1.0" stroke-linecap="round" fill="none" />
                    
                    <!-- Right Marginal Accent Spots -->
                    <circle cx="104" cy="18" r="1.8" fill="#ffffff" opacity="0.9" />
                    <circle cx="110" cy="26" r="1.6" fill="#ffb6c1" opacity="0.9" />
                    <circle cx="106" cy="36" r="1.5" fill="#ffffff" opacity="0.85" />
                    <circle cx="96" cy="50" r="1.4" fill="#ffb6c1" opacity="0.8" />
                    <circle cx="86" cy="62" r="1.4" fill="#ffffff" opacity="0.8" />
                    <circle cx="87" cy="94" r="2.2" fill="url(#spotGlowR_${idClass})" />
                    <circle cx="76" cy="106" r="1.8" fill="${primaryColor}" opacity="0.9" />
                </svg>
            </div>
        `;
        return b;
    };

    const b1 = createButterfly("butterfly--1");
    const b2 = createButterfly("butterfly--2");

    const fragment = document.createDocumentFragment();
    fragment.appendChild(b1);
    fragment.appendChild(b2);
    document.body.appendChild(fragment);

    // Flight path end (9.5s)
    setTimeout(() => {
        b1.classList.add("landed");
        b2.classList.add("landed");

        // 2s after landing (11.5s total)
        setTimeout(() => {
            b2.classList.add("interactive-ready");
            if (elements.messageEl) {
                elements.messageEl.textContent = "Tap the butterfly on the right";
                elements.messageEl.style.opacity = "";
                elements.messageEl.classList.add("visible");
            }

            const triggerPinModal = (e) => {
                e.stopPropagation();
                if (e.cancelable) e.preventDefault();
                openPinModal();
            };

            b2.addEventListener("click", triggerPinModal);
            b2.addEventListener("pointerdown", triggerPinModal);
            b2.addEventListener("touchstart", triggerPinModal, { passive: false });
        }, 2000);
    }, 9500);
}

/* ==========================================================================
   PIN Modal & Fast Display Logic
   ========================================================================== */
function openPinModal() {
    if (elements.messageEl) elements.messageEl.classList.remove("visible");

    if (elements.pinModal) {
        elements.pinModal.classList.add("active");
        pinModalOpen = true;
        resetPinInput();
    }
}

function closePinModal() {
    if (elements.pinModal) {
        elements.pinModal.classList.remove("active");
        pinModalOpen = false;
        resetPinInput();
    }
}

function updatePinDisplay() {
    requestAnimationFrame(() => {
        if (!elements.pinDots) return;
        const len = enteredPin.length;
        for (let i = 0; i < elements.pinDots.length; i++) {
            if (i < len) {
                elements.pinDots[i].classList.add("filled");
            } else {
                elements.pinDots[i].classList.remove("filled");
            }
        }
    });
}

function resetPinInput() {
    enteredPin = [];
    updatePinDisplay();
    if (elements.pinError) elements.pinError.classList.remove("visible");
    if (elements.pinModalContent) elements.pinModalContent.classList.remove("shake");
}

function handlePinInput(digit) {
    if (!pinModalOpen || enteredPin.length >= 6) return;

    enteredPin.push(digit);
    updatePinDisplay();

    if (enteredPin.length === 6) {
        verifyPin();
    }
}

function handlePinBackspace() {
    if (!pinModalOpen || enteredPin.length === 0) return;
    enteredPin.pop();
    updatePinDisplay();
    if (elements.pinError) elements.pinError.classList.remove("visible");
}

function verifyPin() {
    const pinString = enteredPin.join("");

    if (pinString === CORRECT_PIN) {
        setTimeout(() => {
            closePinModal();
            showEnvelope();
        }, 300);
    } else {
        if (elements.pinError) elements.pinError.classList.add("visible");
        if (elements.pinModalContent) elements.pinModalContent.classList.add("shake");

        setTimeout(() => {
            resetPinInput();
        }, 750);
    }
}

/* ==========================================================================
   Envelope & Letter Modal Logic
   ========================================================================== */
function showEnvelope() {
    if (elements.envelopeWrapper) {
        elements.envelopeWrapper.classList.add("active");
    }

    if (elements.messageEl) {
        elements.messageEl.textContent = "Open the envelope to reveal your message";
        elements.messageEl.style.opacity = "";
        elements.messageEl.classList.add("visible");
    }
}

function openEnvelope() {
    if (elements.messageEl) elements.messageEl.classList.remove("visible");

    if (elements.envelope) elements.envelope.classList.add("open");

    setTimeout(() => {
        if (elements.envelopeWrapper) elements.envelopeWrapper.classList.remove("active");
        openLetterModal();
    }, 700);
}

function openLetterModal() {
    if (elements.letterModal) elements.letterModal.classList.add("active");
}

function closeLetterModal() {
    if (elements.letterModal) elements.letterModal.classList.remove("active");
}

// Global Event Listeners Setup
document.addEventListener("DOMContentLoaded", () => {
    initElements();

    // Keypad button listeners with Touch & Click optimization
    const keys = document.querySelectorAll(".pin-key");
    keys.forEach((key) => {
        const handleKey = (e) => {
            e.stopPropagation();
            if (e.cancelable) e.preventDefault();
            const keyValue = key.getAttribute("data-key");
            const action = key.getAttribute("data-action");

            if (keyValue !== null) {
                handlePinInput(keyValue);
            } else if (action === "clear") {
                resetPinInput();
            } else if (action === "backspace") {
                handlePinBackspace();
            }
        };

        key.addEventListener("click", handleKey);
        key.addEventListener("touchstart", handleKey, { passive: false });
    });

    const pinCloseBtn = document.getElementById("pinCloseBtn");
    if (pinCloseBtn) {
        pinCloseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closePinModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (!pinModalOpen) return;
        if (e.key >= "0" && e.key <= "9") {
            handlePinInput(e.key);
        } else if (e.key === "Backspace") {
            handlePinBackspace();
        } else if (e.key === "Escape") {
            closePinModal();
        }
    });

    if (elements.envelope) {
        const handleEnvelopeTap = (e) => {
            e.stopPropagation();
            if (e.cancelable) e.preventDefault();
            openEnvelope();
        };

        elements.envelope.addEventListener("click", handleEnvelopeTap);
        elements.envelope.addEventListener("touchstart", handleEnvelopeTap, { passive: false });
    }

    if (elements.letterCloseBtn) {
        elements.letterCloseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeLetterModal();
        });
    }

    if (elements.letterModal) {
        elements.letterModal.addEventListener("click", (e) => {
            if (e.target === elements.letterModal) {
                closeLetterModal();
            }
        });
    }
});

const handleInteraction = (e) => {
    if (!butterfliesSpawned) {
        spawnButterflies();
    }
};

window.addEventListener("click", handleInteraction);
window.addEventListener("touchstart", handleInteraction, { passive: true });

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", startAnimation);
} else {
    startAnimation();
}