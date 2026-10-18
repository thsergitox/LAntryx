function confirmClose(window, dialog, language, event) {
  const english = language === "en";
  const result = dialog.showMessageBoxSync(window, {
    type: "question",
    title: "LAntryx",
    message: english
      ? "Discard unsaved changes and close?"
      : "¿Descartar los cambios sin guardar y cerrar?",
    buttons: english
      ? ["Keep editing", "Discard and close"]
      : ["Seguir editando", "Descartar y cerrar"],
    defaultId: 0,
    cancelId: 0,
    noLink: true,
  });
  if (result === 1) event.preventDefault();
}
module.exports = { confirmClose };
