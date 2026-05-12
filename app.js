// import express from "express"
// import cors from "cors";
// import cookieParser from "cookie-parser"
// import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes.js";
// import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
// import hpp from "hpp";
// dotenv.config({
//     path : "./.env"
// })

// const app = express();

// // 1. Set security HTTP headers
// app.use(helmet({
//     crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
// }));

// // app.use(
// //     cors({
// //         origin: 'https://resi-hub.onrender.com',
// //         // origin: `${process.env.URL_FRONTEND}`,
// //         origin: 'http://localhost:5173',
// //         credentials: true,
// //         methods: ["GET", "POST", "PUT", "DELETE" ,"PATCH"],
// //         allowedHeaders: ["Content-Type", "Authorization"],
// //     })
// // )

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://societymanagementfe.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// // app.use((req, res, next) => {
// //   // Set the Access-Control-Allow-Origin header to the correct origin
// //   res.setHeader('Access-Control-Allow-Origin', 'https://resi-hub.onrender.com');
// //   // Or to allow multiple origins:
// //   // const allowedOrigins = ['https://resi-hub.onrender.com', 'http://localhost:5173'];
// //   // const origin = req.headers.origin;
// //   // if (allowedOrigins.includes(origin)) {
// //   //      res.setHeader('Access-Control-Allow-Origin', origin);
// //   // }
// //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
// //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// //     next();
// // });

// // Stripe webhook must use raw body — register BEFORE express.json()
// // import { stripeWebhook } from "./controllers/payment.controllers.js";
// // app.post("/api/v1/payment/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// app.use(express.json({
//     limit: "16kb" 
// }))

// app.use(express.urlencoded({
//     extended:true , 
//     limit : "16kb"
// }))

// // 2. Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// // 3. Data sanitization against XSS
// app.use(xss());

// // 4. Prevent parameter pollution
// app.use(hpp());

// app.use(express.static("public"));

// app.use(cookieParser())

// import { globalLimiter } from "./middlewares/rateLimit.middlewares.js";
// // Apply rate limiting globally to all requests
// app.use(globalLimiter);



// import userRouter from "./routes/user.routes.js";
// import eventRouter from "./routes/event.routes.js";
// import bookingRouter from "./routes/booking.routes.js";
// import complainRouter from "./routes/complain.routes.js";
// import societyDetailRouter from "./routes/societyDetail.routes.js";
// import visitorRouter from "./routes/visitor.routes.js";
// import securityRouter from "./routes/security.routes.js";
// import paymentRouter from "./routes/payment.routes.js";
// import pollRouter from "./routes/poll.routes.js";
// import noticeRouter from "./routes/notice.routes.js";
// import orderRouter from "./routes/order.routes.js";

// import purchaseRouter from "./routes/purchase.routes.js"
// import refundRouter from "./routes/refund.routes.js"
// import contactRouter from "./routes/contact.routes.js"

// app.use('/auth', authRoutes);

// app.use("/api/v1/users" , userRouter)
// app.use("/api/v1/events" , eventRouter)
// app.use("/api/v1/booking" , bookingRouter)
// app.use("/api/v1/complain" , complainRouter)
// app.use("/api/v1/societyDetail" , societyDetailRouter)
// app.use("/api/v1/visitor" , visitorRouter)
// app.use("/api/v1/security" , securityRouter)
// app.use("/api/v1/polls" , pollRouter )
// app.use("/api/v1/payment" , paymentRouter)
// app.use("/api/v1/notices" , noticeRouter)

// app.use("/api/v1/order",orderRouter)
// app.use("/api/v1/purchase",purchaseRouter)
// app.use("/api/v1/refunds", refundRouter)
// app.use("/api/v1/contact", contactRouter)
// export default app;

















import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

dotenv.config({
  path: "./.env"
});

const app = express();


// ================= SECURITY =================
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  })
);


// ================= CORS (FINAL FIX) =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://societymanagementfe.vercel.app",
  "https://societymanagementfe-4oqu4sx2w-pravin3003hwcwbugfcqs-projects.vercel.app",
  "https://lime-goose-884102.hostingersite.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Handle preflight
app.options("*", cors());


// ================= BODY PARSER =================
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// ================= SANITIZATION =================
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());


// ================= STATIC =================
app.use(express.static("public"));


// ================= COOKIES =================
app.use(cookieParser());


// ================= RATE LIMIT =================
import { globalLimiter } from "./middlewares/rateLimit.middlewares.js";
app.use(globalLimiter);


// ================= ROUTES =================
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/user.routes.js";
import eventRouter from "./routes/event.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import complainRouter from "./routes/complain.routes.js";
import societyDetailRouter from "./routes/societyDetail.routes.js";
import visitorRouter from "./routes/visitor.routes.js";
import securityRouter from "./routes/security.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import pollRouter from "./routes/poll.routes.js";
import noticeRouter from "./routes/notice.routes.js";
import orderRouter from "./routes/order.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";
import refundRouter from "./routes/refund.routes.js";
import contactRouter from "./routes/contact.routes.js";
import treasurerRouter from "./routes/treasurer.routes.js";
import societyTransferRouter from "./routes/societyTransfer.routes.js";
import payrollRouter from "./routes/payroll.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import adminUserRouter from "./routes/adminUser.routes.js";
app.use("/auth", authRoutes);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/complain", complainRouter);
app.use("/api/v1/societyDetail", societyDetailRouter);
app.use("/api/v1/visitor", visitorRouter);
app.use("/api/v1/security", securityRouter);
app.use("/api/v1/polls", pollRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/refunds", refundRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/treasurer", treasurerRouter);
app.use("/api/v1/society-transfer", societyTransferRouter);
app.use("/public", express.static("public"));
app.use("/api/v1/payroll", payrollRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/admin/users", adminUserRouter);


// ================= EXPORT =================
export default app; 
