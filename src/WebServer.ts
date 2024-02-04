import { bookingRouter } from "./routes/booking.routes";
import { errorHandler } from "./middlewares/error.middleware";
import express from "express";

export class WebServer {
  private app = express();
  private server: any | null;

  constructor(private port: number) {
    this.server = null;
    this.useMiddleware();
    this.hookupEndpoints();
  }

  public listen() {
    this.server = this.app.listen(this.port, this.printBootMessage.bind(this));
  }

  public getApp(): express.Express {
    return this.app;
  }

  private printBootMessage() {
    console.log("🤖⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️ | booking-node-service listening")
  }

  private useMiddleware() {
    this.app.use(express.json());
    this.app.use(errorHandler);
  }

  public async shutdown(): Promise<void> {
    if (this.server) {
      this.server.close(() => {
        "booking-node-service listening closed.";
      });
      this.server = null;
    }
  }

  private hookupEndpoints() {
    this.app.use("/bookings", bookingRouter);
  }
}
