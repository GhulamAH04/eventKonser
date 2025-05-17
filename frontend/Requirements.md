Ghulam Al Hafizh

Event Management Platform

Objective
The main goal of the MVP is to create a simple and functional event management platform that allows event organizers to create and promote events, while attendees can browse and register for those events.

Core Features
Feature 1

Event Discovery, Details, Creation, and Promotion (4 point)
Landing Page: Display a list of upcoming events.
Event Browsing: Customers can browse events, filter by category/location, and view event details.
Search Bar: Implement a search bar with debounce functionality.
Responsiveness is a must.
Event Creation: Event organizers can create events with details such as name, price, start date, end date, available seats, description, ticket types (if applicable), etc.
Pricing: Events can be free or paid. If paid, customers are charged accordingly.
Promotions: Event organizers can create limited-time voucher promotions specific to events, with defined start and end dates.

Event Transaction (4 point)
Purchasing: Customers can create transactions to buy event tickets.
Transaction Statuses: There are six statuses: waiting for payment, waiting for admin confirmation, done, rejected, expired and canceled.
Payment Proof: After choosing a ticket and checking out, a 2-hour countdown is shown for uploading the payment proof.
Automatic Status Changes: Transactions expire if no payment proof is uploaded within 2 hours. If the organizer doesn't accept/reject within 3 days, the transaction is automatically canceled.
Rollbacks and Seat Restoration: Points, vouchers, or coupons used in transactions are returned if the transaction is canceled or expired. Additionally, available seats are restored.
Point Usage: Customers can use points to reduce payment amounts.(ex: event tickets price is IDR 300.000 while your points balance is 20.000, you could use it and get IDR 280.000 as the final price)
Uses only IDR in each prices of items

Event Reviews and Ratings (2 point)
Reviews: Customers can leave reviews and ratings only after attending the event.
Organizer Profile: Show ratings and reviews on the event organizer's profile.
