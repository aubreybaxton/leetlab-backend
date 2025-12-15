const corsOptions = {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8180",
      "http://localhost:14000",
      "https://accounts.google.com",
      "https://admin.socket.io",
      "http://10.0.2.2:8081",
      "https://www.aubreybaxton.com",
      "https://aubreybaxton.com",
      process.env.FRONTEND_URL,
    ],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token','x-csrf-token']
  }

  export {corsOptions}