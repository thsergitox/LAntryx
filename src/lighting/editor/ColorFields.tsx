import { useEffect, useState } from "react";
import { formatHex, parseHex } from "../model/color.mjs";
import type { Rgb } from "../../desktop/bridge/contracts";
import type { Copy } from "../../preferences/language/en";
export function ColorFields({
  color,
  onChange,
  t,
}: {
  color: Rgb;
  onChange: (color: Rgb) => void;
  t: Copy;
}) {
  const [hex, setHex] = useState(formatHex(color));
  const [channels, setChannels] = useState({
    r: String(color.r),
    g: String(color.g),
    b: String(color.b),
  });
  const [invalid, setInvalid] = useState(false);
  useEffect(() => {
    setHex(formatHex(color));
    setChannels({ r: String(color.r), g: String(color.g), b: String(color.b) });
    setInvalid(false);
  }, [color]);
  return (
    <>
      <div className="color-values">
        <label className="hex-field">
          {t.hex}
          <input
            value={hex}
            spellCheck={false}
            aria-invalid={invalid}
            aria-describedby={invalid ? "color-error" : undefined}
            maxLength={7}
            onChange={(event) => {
              const text = event.target.value;
              setHex(text);
              const rgb = parseHex(text);
              setInvalid(!rgb);
              if (rgb) onChange(rgb);
            }}
          />
        </label>
        {(["r", "g", "b"] as const).map((channel, index) => (
          <label key={channel}>
            {[t.red, t.green, t.blue][index]}
            <input
              inputMode="numeric"
              value={channels[channel]}
              aria-invalid={invalid}
              onChange={(event) => {
                const text = event.target.value;
                setChannels({ ...channels, [channel]: text });
                const valid = /^\d{1,3}$/.test(text) && Number(text) <= 255;
                setInvalid(!valid);
                if (valid) onChange({ ...color, [channel]: Number(text) });
              }}
            />
          </label>
        ))}
      </div>
      {invalid ? (
        <p className="field-error" id="color-error" role="alert">
          {t.invalidColor}
        </p>
      ) : null}
    </>
  );
}
