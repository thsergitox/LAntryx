import type { Lighting, EditorAction } from "../../desktop/bridge/contracts";
import type { Copy } from "../../preferences/language/en";
import { ColorPicker } from "./ColorPicker";
import { ColorFields } from "./ColorFields";
import { parseHex, formatHex } from "../model/color.mjs";
const swatches = [
  "#98D6A0",
  "#B9EF83",
  "#EEDFBC",
  "#B9CCE9",
  "#D9B6ED",
  "#EDB579",
  "#EF9B9B",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFFFF",
  "#000000",
];
export function LightingEditor({
  lighting,
  dispatch,
  t,
}: {
  lighting: Lighting;
  dispatch: (action: EditorAction) => void;
  t: Copy;
}) {
  const change = (color: Lighting["color"]) =>
    dispatch({ type: "edit-color", color });
  return (
    <section className="lighting-editor" aria-label={t.lighting}>
      <div className="color-controls">
        <div className="section-heading">
          <h2>{t.color}</h2>
          <span
            className="selected-color"
            style={{ background: formatHex(lighting.color) }}
            aria-label={`${t.profileColor} ${formatHex(lighting.color)}`}
          />
        </div>
        <ColorPicker color={lighting.color} onChange={change} t={t} />
        <ColorFields color={lighting.color} onChange={change} t={t} />
        <div className="swatches" role="group" aria-label={t.swatches}>
          {swatches.map((hex) => (
            <button
              key={hex}
              style={{ background: hex }}
              aria-label={`${t.color} ${hex}`}
              aria-pressed={formatHex(lighting.color) === hex}
              onClick={() => change(parseHex(hex)!)}
            />
          ))}
        </div>
      </div>
      <div className="effect-controls">
        <label className="field-label" htmlFor="effect">
          {t.effect}
        </label>
        <select id="effect" value="uniform" disabled>
          <option>{t.uniform}</option>
        </select>
        <div className="field-heading">
          <label htmlFor="brightness">{t.brightness}</label>
          <span>{t.unverified}</span>
        </div>
        <div className="range-row">
          <input
            id="brightness"
            type="range"
            min="1"
            max="5"
            value={lighting.brightness}
            onChange={(event) =>
              dispatch({
                type: "edit-brightness",
                brightness: Number(
                  event.target.value,
                ) as Lighting["brightness"],
              })
            }
          />
          <output htmlFor="brightness">{lighting.brightness} / 5</output>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={lighting.enabled}
            onChange={(event) =>
              dispatch({ type: "edit-enabled", enabled: event.target.checked })
            }
          />
          {t.illumination}
        </label>
        <p className="support-note">{t.levelNote}</p>
        <p className="future-note">{t.future}</p>
      </div>
    </section>
  );
}
