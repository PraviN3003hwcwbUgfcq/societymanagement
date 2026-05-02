Booking / Venue API Documentation

Base URL

{{baseUrl}}/api/bookings

Replace with your actual route prefix from app.js.

Auth Required

All APIs need JWT token.

Authorization: Bearer <token>
Content-Type: application/json


1. Create Booking


POST /new-booking
Body
{
  "bookingType": "Club House",
  "bookDescription": "Birthday party booking",
  "duration": "3 hours",
  "date": "2026-05-10"
}
Success
{
  "statusCode": 200,
  "data": {
    "_id": "bookingId",
    "bookingOwner": "userId",
    "bookingType": "Club House",
    "bookDescription": "Birthday party booking",
    "duration": "3 hours",
    "date": "2026-05-10",
    "societyId": "SOC123"
  },
  "message": "Booking created successfully.",
  "success": true
}
Errors
{ "message": "All fields are required." }
{ "message": "Venue not found." }
{ "message": "This venue is already booked for the selected date." }


2. Get All Bookings


GET /all-bookings
Success
{
  "statusCode": 200,
  "data": [
    {
      "_id": "bookingId",
      "bookingOwner": {
        "houseNo": "101",
        "block": "A"
      },
      "bookingType": "Club House",
      "bookDescription": "Birthday party booking",
      "duration": "3 hours",
      "date": "2026-05-10",
      "createdAt": "2026-05-02T10:00:00.000Z"
    }
  ],
  "message": "Bookings found successfully",
  "success": true
}


3. Delete Booking


DELETE /delete/:bookingId
Example
DELETE /delete/662f9b91c7a3b81f2a123456
Success
{
  "statusCode": 200,
  "data": {
    "_id": "bookingId"
  },
  "message": "Booking deleted successfully",
  "success": true
}


4. Create Venue

Admin only

POST /createVenue
Body
{
  "venue": "Club House",
  "description": "Society club house for events",
  "amenities": ["AC", "Chairs", "Sound System"],
  "capacity": 100,
  "price": 2500
}
Success
{
  "statusCode": 200,
  "data": {
    "_id": "venueId",
    "venue": "Club House",
    "description": "Society club house for events",
    "amenities": ["AC", "Chairs", "Sound System"],
    "capacity": 100,
    "price": 2500,
    "societyId": "SOC123"
  },
  "message": "Venue created successfully",
  "success": true
}
Errors
{ "message": "You are not authorized to create a venue" }
{ "message": "All fields are required" }


5. Get Venues


GET /getVenue
Success
{
  "statusCode": 200,
  "data": [
    {
      "_id": "venueId",
      "venue": "Club House",
      "description": "Society club house for events",
      "amenities": ["AC", "Chairs"],
      "capacity": 100,
      "price": 2500,
      "societyId": "SOC123"
    }
  ],
  "message": "Venues found successfully",
  "success": true
}


6. Delete Venue

Admin only

DELETE /deleteVenue/:venueId
Example
DELETE /deleteVenue/662f9b91c7a3b81f2a123456
Success
{
  "statusCode": 200,
  "data": {
    "_id": "venueId"
  },
  "message": "Venue deleted successfully",
  "success": true
}


7. Get My Bookings


GET /getBookingsByUserId
Success
{
  "statusCode": 200,
  "data": [
    {
      "_id": "bookingId",
      "bookingType": "Club House",
      "bookDescription": "Birthday party booking",
      "duration": "3 hours",
      "date": "2026-05-10",
      "createdAt": "2026-05-02T10:00:00.000Z"
    }
  ],
  "message": "My Bookings found successfully",
  "success": true
}


8. Get All Past Bookings


GET /getPastBookings
Success
{
  "statusCode": 200,
  "data": [
    {
      "_id": "bookingId",
      "bookingOwner": {
        "houseNo": "101",
        "block": "A"
      },
      "bookingType": "Club House",
      "bookDescription": "Old booking",
      "duration": "2 hours",
      "date": "2026-04-20"
    }
  ],
  "message": "Past Bookings found successfully",
  "success": true
}


9. Get My Past Bookings


GET /getPastBookingsByUserId
Success Message
My Bookings found successfully


10. Get My Upcoming Bookings


GET /getUpcomingBookingsByUserId
Success Message
My Bookings found successfully


11. Create Razorpay Order for Booking


POST /payBooking/:bookingId
Example
POST /payBooking/662f9b91c7a3b81f2a123456
Success
{
  "message": "Razorpay booking order created successfully",
  "bookings": {
    "_id": "bookingId",
    "bookingType": "Club House"
  },
  "order": {
    "id": "order_Qxxxxxxx",
    "amount": 250000,
    "currency": "INR",
    "receipt": "booking_bookingId"
  },
  "key": "RAZORPAY_KEY_ID"
}
Errors
{
  "errors": "You have already paid for this booking."
}
{ "message": "Booking not found" }


12. Save Booking Payment Order


POST /save-booking-order
Body
{
  "razorpay_order_id": "order_Qxxxxxxx",
  "razorpay_payment_id": "pay_Qxxxxxxx",
  "razorpay_signature": "generated_signature",
  "bookingId": "662f9b91c7a3b81f2a123456",
  "amount": 2500,
  "status": "Paid"
}
Success
{
  "message": "Booking order saved successfully"
}
Errors
{ "message": "Missing required payment/order fields" }
{ "message": "Invalid Razorpay payment signature" }


13. Get My Booking Orders


GET /orders/me
Success
{
  "statusCode": 200,
  "data": [
    {
      "bookingId": "bookingId",
      "paymentIntentId": "pay_Qxxxxxxx",
      "status": "Paid",
      "paidOn": "2026-05-02T10:00:00.000Z",
      "amount": 2500,
      "receiptUrl": ""
    }
  ],
  "message": "Booking orders fetched successfully",
  "success": true
}


Frontend Flow

1. GET /getVenue
2. User selects venue
3. POST /new-booking
4. POST /payBooking/:bookingId
5. Open Razorpay checkout using order + key
6. After payment success, POST /save-booking-order
7. GET /orders/me to show payment history


Important Notes for Frontend


- All APIs require Bearer token.
- Venue name selected in bookingType must match venue field from getVenue.
- Date should be sent in valid date format.
- Admin role is required for createVenue and deleteVenue.
- Razorpay amount is created from venue price.
- Same user cannot pay twice for same booking.