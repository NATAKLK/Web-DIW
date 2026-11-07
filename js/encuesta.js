const form = document.querySelector("#encuesta-form");
const status = document.querySelector("#encuesta-status");

if (form && status) {
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
