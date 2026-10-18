import { keys } from "../model/es69";
import type { Lighting } from "../../desktop/bridge/contracts";
import type { Copy } from "../../preferences/language/en";
import { formatHex } from "../../lighting/model/color.mjs";
export function KeyboardPreview({
  lighting,
  t,
}: {
  lighting: Lighting;
  t: Copy;
}) {
  const color = formatHex(lighting.color);
  return (
    <section className="keyboard-stage" aria-label={t.keyboard}>
      <svg viewBox="0 0 684 222" role="img" aria-label={t.keyboard}>
        <rect className="chassis" x="8" y="1" width="668" height="214" rx="9" />
        {keys.map((key) => (
          <g key={key.id} data-key={key.id}>
            <title>{key.label}</title>
            {key.id === 30 ? (
              <path
                className="keycap"
                d="M577 53H617Q621 53 621 57V119Q621 123 617 123H588Q584 123 584 119V82H577Q573 82 573 78V57Q573 53 577 53Z"
              />
            ) : (
              <rect
                className="keycap"
                x={key.x}
                y={key.y}
                width={key.width}
                height={key.height}
                rx="4"
              />
            )}
            <rect
              x={key.x + 4}
              y={key.y + key.height - 4}
              width={key.width - 8}
              height="2"
              rx="1"
              fill={color}
              opacity={lighting.enabled ? 1 : 0}
            />
            <text
              x={key.x + key.width / 2}
              y={key.y + 18}
              fontSize={key.label.length > 4 ? 7 : 9}
            >
              {key.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="preview-caption">
        <span>
          <i style={{ background: color }} />
          {t.wholeBoard}
        </span>
        <span>{t.previewOnly}</span>
      </div>
    </section>
  );
}
