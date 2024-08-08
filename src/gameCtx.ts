import kkplay, { type KKPlayCtx } from "kkplay";
import { globalScale } from "./constants";

// Initialize Kaboom with specific configurations
export const GameCtx: KKPlayCtx = kkplay({
  width: 256 * globalScale,
  height: 144 * globalScale,
  letterbox: true,
  scale: globalScale, // Workaround for a Kaboom bug: set scaling here and also scale sprites
  // to ensure each pixel takes up mostly the correct amount of space.
  global: false,
  background: "#66ccff",
});
