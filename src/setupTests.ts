import "@testing-library/jest-dom";

if (typeof (globalThis as any).structuredClone !== "function") {
  (globalThis as any).structuredClone = (obj: any) =>
    JSON.parse(JSON.stringify(obj));
}
