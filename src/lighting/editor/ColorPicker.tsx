import { useEffect, useRef, useState } from "react";
import {
  ColorPicker as AriaPicker,
  ColorArea,
  ColorThumb,
  ColorSlider,
  SliderTrack,
  Label,
  parseColor,
} from "react-aria-components";
import { formatHex } from "../model/color.mjs";
import type { Rgb } from "../../desktop/bridge/contracts";
import type { Copy } from "../../preferences/language/en";
import "./color-picker.css";
export function ColorPicker({
  color,
  onChange,
  t,
  disabled,
}: {
  color: Rgb;
  onChange: (color: Rgb) => void;
  t: Copy;
  disabled: boolean;
}) {
  const [value, setValue] = useState(() =>
    parseColor(formatHex(color)).toFormat("hsb"),
  );
  const lastEmitted = useRef(formatHex(color));
  useEffect(() => {
    const hex = formatHex(color);
    if (hex !== lastEmitted.current) {
      const parsed = parseColor(hex).toFormat("hsb");
      setValue((previous) =>
        parsed.getChannelValue("saturation") === 0 ||
        parsed.getChannelValue("brightness") === 0
          ? parsed.withChannelValue("hue", previous.getChannelValue("hue"))
          : parsed,
      );
      lastEmitted.current = hex;
    }
  }, [color]);
  return (
    <AriaPicker
      value={value}
      onChange={(next) => {
        setValue(next);
        const rgb = next.toFormat("rgb");
        const result = {
          r: Math.round(rgb.getChannelValue("red")),
          g: Math.round(rgb.getChannelValue("green")),
          b: Math.round(rgb.getChannelValue("blue")),
        };
        lastEmitted.current = formatHex(result);
        onChange(result);
      }}
    >
      <ColorArea
        isDisabled={disabled}
        aria-label={t.colorArea}
        xChannel="saturation"
        yChannel="brightness"
        className="color-area"
      >
        <ColorThumb className="color-thumb" />
      </ColorArea>
      <ColorSlider isDisabled={disabled} channel="hue" className="hue-slider">
        <Label>{t.hue}</Label>
        <SliderTrack className="hue-track">
          <ColorThumb className="color-thumb" />
        </SliderTrack>
      </ColorSlider>
    </AriaPicker>
  );
}
