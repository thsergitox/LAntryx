# Sesión con el MK825 TRIX presente

**Estado:** procedimiento preparado; NO ejecutado sobre el teclado. La interfaz normal sigue sin enviar USB. El primer frame puede no producir ningún cambio: el modo de inicialización requerido todavía no se conoce.

## Antes de empezar

- Tener el teclado físico a la vista y conectado por cable, no solo por el receptor inalámbrico.
- Cerrar la aplicación OEM de Wine para evitar dos controladores concurrentes.
- Guardar trabajo importante y comprobar que la escritura normal funciona. No grabar contraseñas ni otras pulsaciones en capturas USB.
- No usar `sudo`, no cambiar permisos permanentemente y no probar firmware o matrices de teclas. Si hay un problema de acceso, detenerse y acordar una solución temporal limitada al nodo correcto.

## 1. Prueba completamente sin hardware

```sh
npm run check
npm run typecheck
npm run hardware:check -- --dry-run
```

El dry-run solo compone 382 bytes en memoria; no enumera, abre ni escribe dispositivos. Se puede ejecutar antes de volver a casa.

## 2. Identificación pasiva, SOLO cuando estés presente

```sh
npm run hardware:check -- --inspect
```

Lee identidad y descriptor desde sysfs. Debe aparecer una única coincidencia de `258a:0049`, interfaz 1 y el fingerprint observado. No abre hidraw ni envía SetFeature. Los números de hidraw cambian al reconectar y no se configuran manualmente.

Un fingerprint coincidente demuestra identidad estática, NO que el protocolo RGB funcione. Si no hay coincidencia, hay varias o cambia el descriptor, detenerse. No ampliar la lista por intuición.

## 3. Experimento activo y explícito

```sh
npm run hardware:check -- --probe
```

Requiere una terminal interactiva. Vuelve a inspeccionar la identidad; solicita `#RRGGBB` y una frase exacta que confirma modelo e incertidumbre. El proceso hijo Python 3 abre el nodo y comprueba VID/PID y el descriptor mediante ioctl sobre ESE MISMO descriptor de archivo antes de enviar: una reutilización del nombre hidraw no permite saltarse la validación. El backend experimental de ioctl solo admite Linux x86_64. Solo solicita UN Feature report 8: `08 0A 7A 01` y 126 ternas RGB. Timeout de 3 segundos; sin reintentos ni comandos alternativos.

Registrar el resultado técnico y observar el teclado. «transport-accepted» exige la longitud completa de 382 bytes; aun así no significa color correcto ni persistencia. Una transferencia corta o un error durante el envío tiene resultado desconocido. Un error de limpieza no reescribe como fallida una transferencia ya aceptada. Un timeout tiene resultado DESCONOCIDO: matar el proceso no deshace una transferencia. Ante cualquier error, parar.

Si un único frame no cambia nada, NO iniciar un bucle ni adivinar comandos de modo. Investigar la inicialización por separado. La lectura de perfil OEM incluye una petición SetFeature y tiene una discrepancia de longitud del reporte 5: NO es identificación pasiva ni se corrige recortando bytes automáticamente.

## 4. Solo tras entender el primer resultado

Acordar pruebas separadas de rojo, verde y azul, preservación de escritura normal, cierre/reconexión/pérdida de alimentación, brillo y apagado. No aplicar un perfil completo de otro teclado ni interpretar negro como apagado verificado.

Documentar modelo, fingerprint, versión del programa y observación visible. La habilitación de Apply en la interfaz requiere evidencia física y otro cambio revisado; no se desbloquea al conectar el cable ni al importar un perfil.
