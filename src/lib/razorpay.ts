import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  // We don't throw error here to prevent crashing during build/SSR
  // but we log it for the server console.
  if (typeof window === 'undefined') {
    console.error("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing");
  }
}

export const razorpay = new Razorpay({
  key_id: key_id || 'dummy_id',
  key_secret: key_secret || 'dummy_secret',
});
