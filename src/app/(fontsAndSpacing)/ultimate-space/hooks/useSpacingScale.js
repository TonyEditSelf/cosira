import { useMemo } from "react";

export const useSpacingScale = (baseUnit, scaleType, customRatio, steps) => {
  return useMemo(() => {
    const scale = [];
    const MAX_VALUE = 2000;

    switch (scaleType) {
      case "linear":
        for (let i = 0; i <= steps; i++) {
          const value = baseUnit * i;
          scale.push({
            name: `space-${i}`,
            value: Math.min(value, MAX_VALUE),
            rem: parseFloat((Math.min(value, MAX_VALUE) / 16).toFixed(3)),
          });
        }
        break;

      case "geometric":
        for (let i = 0; i <= steps; i++) {
          const rawValue =
            i === 0 ? 0 : Math.round(baseUnit * Math.pow(customRatio, i - 1));
          const value = Math.min(rawValue, MAX_VALUE);
          scale.push({
            name: `space-${i}`,
            value: value,
            rem: parseFloat((value / 16).toFixed(3)),
          });
        }
        break;

      case "fibonacci":
        let fib = [0, 1];
        for (let i = 2; i <= steps; i++) {
          const nextFib = fib[i - 1] + fib[i - 2];
          if (nextFib * baseUnit > MAX_VALUE) break;
          fib.push(nextFib);
        }
        fib.forEach((num, i) => {
          const value = Math.min(num * baseUnit, MAX_VALUE);
          scale.push({
            name: `space-${i}`,
            value: value,
            rem: parseFloat((value / 16).toFixed(3)),
          });
        });
        break;

      case "t-shirt":
        const sizes = [
          { name: "space-3xs", multiplier: 0.25 },
          { name: "space-2xs", multiplier: 0.5 },
          { name: "space-xs", multiplier: 0.75 },
          { name: "space-sm", multiplier: 1 },
          { name: "space-md", multiplier: 1.5 },
          { name: "space-lg", multiplier: 2 },
          { name: "space-xl", multiplier: 3 },
          { name: "space-2xl", multiplier: 4 },
          { name: "space-3xl", multiplier: 6 },
          { name: "space-4xl", multiplier: 8 },
          { name: "space-5xl", multiplier: 12 },
          { name: "space-6xl", multiplier: 16 },
        ];
        sizes.forEach((size) => {
          const value = Math.min(baseUnit * size.multiplier, MAX_VALUE);
          scale.push({
            name: size.name,
            value: value,
            rem: parseFloat((value / 16).toFixed(3)),
          });
        });
        break;
    }

    return scale;
  }, [baseUnit, scaleType, customRatio, steps]);
};
