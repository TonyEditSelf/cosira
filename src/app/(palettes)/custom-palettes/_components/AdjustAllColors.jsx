// import { useColorPaletteContext } from "../../ColorContext";
// import {
//   Slider,
//   SliderTrack,
//   SliderThumb,
//   SliderOutput,
// } from "react-aria-components";

// export default function AdjustAllColors() {
//   const {
//     hueOffset,
//     setHueOffset,
//     lightOffset,
//     setLightOffset,
//     chromaOffset,
//     setChromaOffset,
//     handleOffset,
//   } = useColorPaletteContext();

//   return (
//     <div>
//       <h1 className="text-[15px] font-bold space-y-3 mb-3">
//         ADJUST ALL COLORS
//       </h1>
//       <div className="flex flex-col">
//         <div className="flex flex-col gap-4">
//           <label htmlFor="HueOffset">Hue</label>
//           <Slider
//             aria-label="HueOffset"
//             id="HueOffset"
//             minValue={0}
//             maxValue={360}
//             step={1}
//             value={hueOffset}
//             onChange={(value) => {
//               setHueOffset((prev) => {
//                 const delta = value - prev;
//                 handleOffset(delta, 0, 0);
//                 return value;
//               });
//             }}
//           >
//             <SliderTrack className="relative h-3 bg-[var(--background)] border border-[var(--navBorder)] rounded-md">
//               <SliderThumb className="absolute top-1/2 w-4 h-4 bg-[var(--brand)] rounded-full shadow -translate-y-1/2" />
//             </SliderTrack>
//             <div className="flex justify-between">
//               <span>0</span>
//               <SliderOutput className="ml-2 text-sm font-medium" />
//               <span>360</span>
//             </div>
//           </Slider>
//         </div>
//         <div className="flex flex-col gap-4">
//           <label htmlFor="LightOffset">Lightness</label>
//           <Slider
//             aria-label="LightOffset"
//             id="LightOffset"
//             minValue={0}
//             maxValue={1}
//             step={0.01}
//             value={lightOffset}
//             onChange={(value) => {
//               setLightOffset((prev) => {
//                 const stepSize = 0.01;
//                 const stepsMoved = Math.round((value - prev) / stepSize); // how many 0.01 steps
//                 handleOffset(0, stepsMoved * stepSize, 0); // apply steps
//                 return value;
//               });
//             }}
//           >
//             <SliderTrack className="relative h-3 bg-[var(--background)] border border-[var(--navBorder)] rounded-md">
//               <SliderThumb className="absolute top-1/2 w-4 h-4 bg-[var(--brand)] rounded-full shadow -translate-y-1/2" />
//             </SliderTrack>
//             <div className="flex justify-between">
//               <span>0</span>
//               <SliderOutput className="ml-2 text-sm font-medium" />
//               <span>1</span>
//             </div>
//           </Slider>
//         </div>
//         <div className="flex flex-col gap-4">
//           <label htmlFor="ChromaOffset">Chroma</label>
//           <Slider
//             aria-label="ChromaOffset"
//             id="ChromaOffset"
//             minValue={0}
//             maxValue={0.4}
//             step={0.01}
//             value={chromaOffset}
//             onChange={(value) => {
//               setChromaOffset((prev) => {
//                 const stepSize = 0.01;
//                 const stepsMoved = Math.round((value - prev) / stepSize); // how many 0.01 steps
//                 handleOffset(0, 0, stepsMoved * stepSize); // apply steps
//                 return value;
//               });
//             }}
//           >
//             <SliderTrack className="relative h-3 bg-[var(--background)] border border-[var(--navBorder)] rounded-md">
//               <SliderThumb className="absolute top-1/2 w-4 h-4 bg-[var(--brand)] rounded-full shadow -translate-y-1/2" />
//             </SliderTrack>
//             <div className="flex justify-between">
//               <span>0</span>
//               <SliderOutput className="ml-2 text-sm font-medium" />
//               <span>0.4</span>
//             </div>
//           </Slider>
//         </div>
//       </div>
//     </div>
//   );
// }
