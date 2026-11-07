const form = document.querySelector("#encuesta-form");
const status = document.querySelector("#encuesta-status");
const progressBar = document.querySelector("#survey-progress");
const progressFill = document.querySelector("#survey-progress-fill");
const progressCount = document.querySelector("#progress-count");
const progressMessage = document.querySelector("#progress-message");
const suggestion = document.querySelector("#sugerencia");
const characterCount = document.querySelector("#character-count");

const questions = ["motivo", "funcion", "instalarias"];

function hasAnswer(name) {
    if (name === "instalarias") {
        return Boolean(form.querySelector(`input[name="${name}"]:checked`));
    }

    return Boolean(form.elements.namedItem(name)?.value);
}

function updateProgress() {
    const completed = questions.filter(hasAnswer).length;
    const total = questions.length;

    progressCount.textContent = `${completed} de ${total}`;
    progressBar.setAttribute("aria-valuenow", String(completed));
    progressFill.style.width = `${(completed / total) * 100}%`;

    questions.forEach((name) => {
        const complete = hasAnswer(name);
        document.querySelector(`[data-step="${name}"]`).classList.toggle("is-complete", complete);
        form.querySelector(`[data-question="${name}"]`).classList.toggle("is-complete", complete);
    });

    if (completed === total) {
        progressMessage.textContent = "¡Listo! Ya puedes enviar tus respuestas.";
    } else if (completed === 0) {
        progressMessage.textContent = "Responde las tres preguntas obligatorias para completar la encuesta.";
    } else {
        const remaining = total - completed;
        progressMessage.textContent = `Completaste ${completed} de ${total}. ${remaining === 1 ? "Completa una pregunta más." : `Completa las ${remaining} preguntas restantes.`}`;
    }
}

function updateCharacterCount() {
    characterCount.textContent = `${suggestion.value.length} / 500 caracteres`;
}

if (form && status) {
    form.addEventListener("input", updateProgress);
    form.addEventListener("change", updateProgress);
    suggestion.addEventListener("input", updateCharacterCount);
    form.addEventListener("reset", () => {
        requestAnimationFrame(() => {
            updateProgress();
            updateCharacterCount();
            status.textContent = "";
        });
    });

    updateProgress();
    updateCharacterCount();

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const answers = new FormData(form);
        const message = [
            "Respuestas a la encuesta de UniFix",
            "",
            `¿Por qué descargarías UniFix?: ${answers.get("motivo")}`,
            `¿Qué función te gustaría utilizar más?: ${answers.get("funcion")}`,
            `¿La instalarías?: ${answers.get("instalarias")}`,
            `¿Qué mejorarías?: ${answers.get("sugerencia") || "Sin sugerencia adicional"}`
        ].join("\n");
        const subject = encodeURIComponent("Opinión sobre UniFix");
        const body = encodeURIComponent(message);

        status.textContent = "Tu aplicación de correo debería abrirse con las respuestas. Revísalas y pulsa Enviar para compartirlas.";
        window.location.href = `mailto:unifixmx.support@gmail.com?subject=${subject}&body=${body}`;
    });
}
