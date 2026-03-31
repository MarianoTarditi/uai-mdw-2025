import { Schema, model, InferSchemaType } from "mongoose";
import { auditPlugin } from "../utils/auditPlugin";

const paymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    amount: { type: Number, default: null },
    paymentDate: { type: Date, default: null },
    isPaid: { type: Boolean, default: false },
    billingCycleDays: { type: Number, default: 30 },
    reminderCount: { type: Number, default: 0 },
    lastReminderAt: { type: Date, default: null },
    lastReminderChannel: {
      type: String,
      enum: ["email", "whatsapp"],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

paymentSchema.pre("validate", function (next) {
  if (!this.userId && this.studentId) {
    this.userId = this.studentId;
  }

  if (!this.studentId && this.userId) {
    this.studentId = this.userId;
  }

  next();
});

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ dueDate: 1, isPaid: 1 });
paymentSchema.index({ studentId: 1, createdAt: -1 }, { sparse: true });
paymentSchema.plugin(auditPlugin);

type PaymentType = InferSchemaType<typeof paymentSchema>;
const Payment = model<PaymentType>("Payment", paymentSchema);

export default Payment;
