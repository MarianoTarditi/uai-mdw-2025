import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/server";
import Payment from "../models/Payment";
import User from "../models/User";
import { UserRole } from "../types";
import { normalizePaymentSource } from "../utils/paymentBridge";

const sameInstant = (left: Date | null, right: Date | null) =>
  (left?.getTime() ?? null) === (right?.getTime() ?? null);

const hasLegacyPaymentData = (payment?: Record<string, unknown> | null) =>
  Boolean(
    payment &&
      Object.values(payment).some(
        (value) => value !== null && value !== undefined && value !== "",
      ),
  );

const isEquivalentPayment = (
  left: ReturnType<typeof normalizePaymentSource>,
  right: ReturnType<typeof normalizePaymentSource>,
) =>
  sameInstant(left.startDate, right.startDate) &&
  sameInstant(left.dueDate, right.dueDate) &&
  sameInstant(left.paymentDate, right.paymentDate) &&
  left.billingCycleDays === right.billingCycleDays &&
  left.amount === right.amount &&
  left.isPaid === right.isPaid;

const main = async () => {
  await connectDB();

  const students = await User.find({ roles: UserRole.Student })
    .select("_id email payment")
    .lean();

  const summary = {
    scanned: 0,
    created: 0,
    alreadyMigrated: 0,
    skippedWithoutLegacyData: 0,
    skippedMissingStartDate: 0,
    skippedAmbiguousExistingPayments: 0,
  };

  const manualReview: Array<{
    userId: string;
    email: string;
    reason: string;
  }> = [];

  for (const student of students) {
    summary.scanned += 1;

    if (!hasLegacyPaymentData(student.payment as Record<string, unknown> | null)) {
      summary.skippedWithoutLegacyData += 1;
      continue;
    }

    const normalizedLegacyPayment = normalizePaymentSource({
      userId: student._id,
      ...(student.payment ?? {}),
    });

    if (!normalizedLegacyPayment.startDate) {
      summary.skippedMissingStartDate += 1;
      manualReview.push({
        userId: String(student._id),
        email: student.email,
        reason:
          "Legacy payment has no startDate, so the billing cycle is ambiguous.",
      });
      continue;
    }

    const existingPayments = await Payment.find({
      $or: [{ userId: student._id }, { studentId: student._id }],
    }).lean();

    if (existingPayments.length === 0) {
      await Payment.create({
        userId: student._id,
        studentId: student._id,
        startDate: normalizedLegacyPayment.startDate,
        dueDate: normalizedLegacyPayment.dueDate,
        amount: normalizedLegacyPayment.amount,
        paymentDate: normalizedLegacyPayment.paymentDate,
        isPaid: normalizedLegacyPayment.isPaid,
        billingCycleDays: normalizedLegacyPayment.billingCycleDays,
        reminderCount: normalizedLegacyPayment.reminderCount,
        lastReminderAt: normalizedLegacyPayment.lastReminderAt,
        lastReminderChannel: normalizedLegacyPayment.lastReminderChannel,
      });

      summary.created += 1;
      continue;
    }

    const matchingPayment = existingPayments.some((payment) =>
      isEquivalentPayment(
        normalizePaymentSource(payment),
        normalizedLegacyPayment,
      ),
    );

    if (matchingPayment) {
      summary.alreadyMigrated += 1;
      continue;
    }

    summary.skippedAmbiguousExistingPayments += 1;
    manualReview.push({
      userId: String(student._id),
      email: student.email,
      reason:
        "Existing Payment rows do not match the legacy bridge exactly; review manually before migrating.",
    });
  }

  console.log("Backfill legacy payments summary:");
  console.table(summary);

  if (manualReview.length > 0) {
    console.log("Manual review required:");
    console.table(manualReview);
  }
};

main()
  .catch((error) => {
    console.error("Legacy payment backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
