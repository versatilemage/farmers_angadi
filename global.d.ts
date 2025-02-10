// global.d.ts
export {};

declare global {
  interface Window {
    Razorpay: any; // Declare Razorpay on the window object
  }
}
