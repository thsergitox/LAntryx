# LAntryx

**Configuración de iluminación para teclados Antryx en Linux, como proyecto independiente.**

[English](README.md) · [Especificación](docs/specs/2026-10-18-lantryx-design.md) · [Diseño visual](docs/design/desktop-brief.md)

> Fase de planificación e investigación. Todavía no hay una aplicación ejecutable ni soporte confirmado mediante pruebas físicas.

La primera meta es conseguir un color RGB uniforme y fiable en el MK825 TRIX sin Wine. Después: perfiles locales, representación del teclado, español/inglés, efectos verificados, brillo y velocidad.

## Propuesta de escritorio

![Boceto no funcional de LAntryx, con perfiles locales, teclado y controles de iluminación](docs/design/preview/desktop-1440.png)

Propuesta de diseño, no captura de una aplicación funcional ni fotografía del teclado físico. Todos los controles están inactivos. [Abrir boceto estático](docs/design/preview/index.html) · [Notas de revisión visual](docs/design/preview/README.md).

## Qué está preparado

- Alcance del MVP y criterios de aceptación.
- Propuesta de arquitectura y límites de seguridad.
- Dirección visual basada en las capturas facilitadas.
- Investigación estática del protocolo, separada de sus validaciones pendientes.
- Guía de contribución para trabajar sin hardware.

## Qué no está implementado

No existen todavía código de aplicación, instaladores ni pruebas satisfactorias de iluminación. Los controles no verificados no se presentarán como funciones disponibles.

Guardar un perfil en Linux, previsualizarlo y aplicarlo al teclado serán operaciones diferentes.

## Código abierto e imágenes

Se propone MIT para el código original, pendiente de confirmación. La fotografía real del teclado y los elementos de marca requieren su procedencia y condiciones de uso por separado; no están cubiertos automáticamente por la licencia del código.

Proyecto comunitario, no afiliado ni oficial de Antryx. No redistribuye el software propietario del fabricante.
