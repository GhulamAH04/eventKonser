flowchart TD
  A[Landing Page] --> B[Event Details]
  B --> C[Checkout Page]
  C --> D[Transaction Created]
  D --> E{Upload Payment Proof?}
  E -- Yes --> F[Waiting Confirmation]
  E -- No --> G[Expired after 2 Hours]
  F --> H{Organizer Accept/Reject}
  H -- Accept --> I[Transaction Done]
  H -- Reject --> G[Transaction Rejected]
  
  B --> K[Submit Review after Event]
  
  A --> L[Login / Signup]
  L --> M[Organizer Dashboard]
  M --> N[Create Event]
  M --> O[Manage Transactions]
  O --> P[Confirm/Reject Payment Proof]

  subgraph Organizer
    M --> N
    M --> O
  end

  subgraph Customer
    A --> B
    B --> C
    C --> D
    D --> E
  end
