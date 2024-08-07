import { resolve } from "node:path";
import process from "node:process";

export const port = Number(process.env.PORT || "") || 8888;
export const r = (...args: string[]) => resolve(__dirname, "..", ...args);
export const isDev = process.env.NODE_ENV !== "production";
