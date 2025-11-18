export default function gradientPalGen(oklch, gradientPalType) {
  if (gradientPalType === "rightGradient") {
    const LMAX = 0.95;
    const LMIN = 0.25;
    const CMAX = 0.25;
    const CMIN = 0.05;

    const base = oklch;
    const stepDistance = 20;

    const step1 = {
      ...base,
      h: (base.h + 0) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.0)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 1.0)),
    };

    const step2 = {
      ...base,
      h: (base.h + stepDistance) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.02)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.97)),
    };

    const step3 = {
      ...base,
      h: (base.h + stepDistance * 2) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.04)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.94)),
    };

    const step4 = {
      ...base,
      h: (base.h + stepDistance * 3) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.06)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.91)),
    };

    const step5 = {
      ...base,
      h: (base.h + stepDistance * 4) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.08)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.88)),
    };

    const step6 = {
      ...base,
      h: (base.h + stepDistance * 5) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.1)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.85)),
    };

    const step7 = {
      ...base,
      h: (base.h + stepDistance * 6) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.82)),
    };

    const step8 = {
      ...base,
      h: (base.h + stepDistance * 7) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.79)),
    };

    const step9 = {
      ...base,
      h: (base.h + stepDistance * 8) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.76)),
    };

    const step10 = {
      ...base,
      h: (base.h + stepDistance * 9) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.18)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.73)),
    };

    return [
      { name: "Step-1", value: step1 },
      { name: "Step-2", value: step2 },
      { name: "Step-3", value: step3 },
      { name: "Step-4", value: step4 },
      { name: "Step-5", value: step5 },
      { name: "Step-6", value: step6 },
      { name: "Step-7", value: step7 },
      { name: "Step-8", value: step8 },
      { name: "Step-9", value: step9 },
      { name: "Step-10", value: step10 },
    ];
  } else if (gradientPalType === "leftGradient") {
    const LMAX = 0.95;
    const LMIN = 0.25;
    const CMAX = 0.25;
    const CMIN = 0.05;

    const base = oklch;
    const stepDistance = 20;

    const step1 = {
      ...base,
      h: (base.h - 0 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.0)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 1.0)),
    };

    const step2 = {
      ...base,
      h: (base.h - stepDistance + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.02)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.97)),
    };

    const step3 = {
      ...base,
      h: (base.h - stepDistance * 2 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.04)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.94)),
    };

    const step4 = {
      ...base,
      h: (base.h - stepDistance * 3 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.06)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.91)),
    };

    const step5 = {
      ...base,
      h: (base.h - stepDistance * 4 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.08)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.88)),
    };

    const step6 = {
      ...base,
      h: (base.h - stepDistance * 5 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.1)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.85)),
    };

    const step7 = {
      ...base,
      h: (base.h - stepDistance * 6 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.12)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.82)),
    };

    const step8 = {
      ...base,
      h: (base.h - stepDistance * 7 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.14)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.79)),
    };

    const step9 = {
      ...base,
      h: (base.h - stepDistance * 8 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.16)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.76)),
    };

    const step10 = {
      ...base,
      h: (base.h - stepDistance * 9 + 360) % 360,
      l: Math.min(LMAX, Math.max(LMIN, base.l + 0.18)),
      c: Math.min(CMAX, Math.max(CMIN, base.c * 0.73)),
    };

    return [
      { name: "Step-1", value: step1 },
      { name: "Step-2", value: step2 },
      { name: "Step-3", value: step3 },
      { name: "Step-4", value: step4 },
      { name: "Step-5", value: step5 },
      { name: "Step-6", value: step6 },
      { name: "Step-7", value: step7 },
      { name: "Step-8", value: step8 },
      { name: "Step-9", value: step9 },
      { name: "Step-10", value: step10 },
    ];
  }
}
