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

    // Fast Document Fragment creation for butterflies
    const createButterfly = (idClass) => {
        const b = document.createElement("div");
        b.className = `butterfly ${idClass} fly`;
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
                <div class="butterfly__wing butterfly__wing--fore">
                    <div class="butterfly__wing-cells"></div>
                    <div class="butterfly__wing-veins"></div>
                    <div class="butterfly__wing-scales"></div>
                    <div class="butterfly__wing-sparkles"></div>
                </div>
                <div class="butterfly__wing butterfly__wing--hind">
                    <div class="butterfly__wing-cells"></div>
                    <div class="butterfly__wing-veins"></div>
                    <div class="butterfly__wing-scales"></div>
                    <div class="butterfly__wing-spot"></div>
                    <div class="butterfly__wing-tail"></div>
                </div>
            </div>
            <div class="butterfly__wing-pair butterfly__wing-pair--right">
                <div class="butterfly__wing butterfly__wing--fore">
                    <div class="butterfly__wing-cells"></div>
                    <div class="butterfly__wing-veins"></div>
                    <div class="butterfly__wing-scales"></div>
                    <div class="butterfly__wing-sparkles"></div>
                </div>
                <div class="butterfly__wing butterfly__wing--hind">
                    <div class="butterfly__wing-cells"></div>
                    <div class="butterfly__wing-veins"></div>
                    <div class="butterfly__wing-scales"></div>
                    <div class="butterfly__wing-spot"></div>
                    <div class="butterfly__wing-tail"></div>
                </div>
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