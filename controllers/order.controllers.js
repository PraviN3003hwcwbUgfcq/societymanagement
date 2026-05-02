// import { Order } from "../models/order.model.js";

// // Stores client-reported order metadata for history/logging after payment confirmation.
//  const orderData = async (req, res) => {
//   const order = req.body;
//   try {
//     // Save the order record for logging/history purposes
//     const orderInfo = await Order.create(order);
//     // NOTE: Purchase is created by the Stripe webhook (payment_intent.succeeded)
//     // Do NOT create Purchase here — that would cause duplicates
//     res.status(201).json({ message: "Order Details: ", orderInfo });
   
//   } catch (error) {
//     console.log("Error in order: ", error);
//     res.status(500).json({ errors: "Error in order creation", details: error.message });
//   }
// };

// export {orderData};








import { Order } from "../models/order.model.js";

// Stores order metadata AFTER Razorpay payment verification
const orderData = async (req, res) => {
  const order = req.body;

  try {
    // Save order (already verified by Razorpay verify API)
    const orderInfo = await Order.create(order);

    res.status(201).json({
      message: "Order saved successfully",
      orderInfo,
    });

  } catch (error) {
    console.log("Error in order: ", error);

    res.status(500).json({
      errors: "Error in order creation",
      details: error.message,
    });
  }
};

export { orderData };