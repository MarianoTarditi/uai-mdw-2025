import { ClientSession, Types } from "mongoose";
import Payment from "../models/Payment";
import User from "../models/User";
import { calculatePaymentStatus } from "./paymentStatus";

export type ReminderChannel = "email" | "whatsapp";

export type LegacyPaymentBridge = {
  startDate?: Date | null;
  dueDate?: Date | null;
  amount?: number | null;
  paymentDate?: Date | null;
  isPaid?: boolean;
  billingCycleDays?: number;
  reminderCount?: number;
  lastReminderAt?: Date | null;
  lastReminderChannel?: ReminderChannel | null;
};

export type PaymentSourceInput = {
  userId?: Types.ObjectId | string | null;
  studentId?: Types.ObjectId | string | null;
  startDate?: Date | string | null;
  amount?: number | string | null;
  paymentDate?: Date | string | null;
  isPaid?: boolean | null;
  billingCycleDays?: number | string | null;
  reminderCount?: number | null;
  lastReminderAt?: Date | string | null;
  lastReminderChannel?: ReminderChannel | null;
  dueDate?: Date | string | null;
};

export type NormalizedPaymentSource = {
  userId: string | null;
  studentId: string | null;
  startDate: Date | null;
  dueDate: Date | null;
  amount: number | null;
  paymentDate: Date | null;
  isPaid: boolean;
  billingCycleDays: number;
  reminderCount: number;
  lastReminderAt: Date | null;
  lastReminderChannel: ReminderChannel | null;
};

type StudentWithLegacyPayment = {
  _id: Types.ObjectId | string;
  payment?: LegacyPaymentBridge | null;
};

type SaveStudentPaymentMode = "cycle_aware" | "replace_latest";

type SaveStudentPaymentOptions = {
  mode?: SaveStudentPaymentMode;
};

export const DEFAULT_PAYMENT_BILLING_CYCLE_DAYS = 30;
export const DEFAULT_INITIAL_PAYMENT_AMOUNT = 0;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const hasOwn = (value: object | null | undefined, key: string) =>
  Boolean(value) && Object.prototype.hasOwnProperty.call(value, key);

const toDate = (value?: Date | string | null) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toObjectIdString = (value?: Types.ObjectId | string | null) =>
  value ? String(value) : null;

const toObjectId = (value: Types.ObjectId | string) =>
  value instanceof Types.ObjectId ? value : new Types.ObjectId(String(value));

const toNullableNumber = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeBillingCycleDays = (value?: number | string | null) => {
  const parsed = toNullableNumber(value);

  if (!parsed || parsed <= 0) {
    return DEFAULT_PAYMENT_BILLING_CYCLE_DAYS;
  }

  return parsed;
};

const addDays = (value: Date, days: number) =>
  new Date(value.getTime() + days * MS_PER_DAY);

const resolveDueDate = (
  startDate: Date | null,
  dueDate: Date | null,
  billingCycleDays: number,
) => {
  if (dueDate) {
    return dueDate;
  }

  if (!startDate) {
    return null;
  }

  return addDays(startDate, billingCycleDays);
};

const resolveReminderCount = (
  source: PaymentSourceInput | null | undefined,
  fallback: number,
) => {
  if (!hasOwn(source, "reminderCount")) {
    return fallback;
  }

  const parsed = Number(source?.reminderCount ?? 0);
  return Number.isNaN(parsed) ? fallback : Math.max(0, parsed);
};

const resolveOwnerId = (
  source?: PaymentSourceInput | NormalizedPaymentSource | null,
) => toObjectIdString(source?.userId ?? source?.studentId ?? null);

const buildPaymentOwnerFilter = (
  studentId: Types.ObjectId | string,
) => {
  const objectId = toObjectId(studentId);

  return {
    $or: [{ userId: objectId }, { studentId: objectId }],
  };
};

const sameInstant = (left: Date | null, right: Date | null) =>
  (left?.getTime() ?? null) === (right?.getTime() ?? null);

const belongsToSameCycle = (
  currentPayment: NormalizedPaymentSource,
  nextPayment: NormalizedPaymentSource,
) =>
  sameInstant(currentPayment.startDate, nextPayment.startDate) &&
  sameInstant(currentPayment.dueDate, nextPayment.dueDate);

export const normalizePaymentSource = (
  source?: PaymentSourceInput | null,
  fallback?: PaymentSourceInput | null,
): NormalizedPaymentSource => {
  const base: NormalizedPaymentSource = fallback
    ? normalizePaymentSource(fallback)
    : {
        userId: null,
        studentId: null,
        startDate: null,
        dueDate: null,
        amount: null,
        paymentDate: null,
        isPaid: false,
        billingCycleDays: DEFAULT_PAYMENT_BILLING_CYCLE_DAYS,
        reminderCount: 0,
        lastReminderAt: null,
        lastReminderChannel: null,
      };

  if (!source) {
    return {
      ...base,
      userId: base.userId,
      studentId: base.userId,
      dueDate: resolveDueDate(
        base.startDate,
        base.dueDate,
        base.billingCycleDays,
      ),
    };
  }

  const startDate = hasOwn(source, "startDate")
    ? toDate(source.startDate)
    : base.startDate;
  const billingCycleDays = hasOwn(source, "billingCycleDays")
    ? normalizeBillingCycleDays(source.billingCycleDays)
    : base.billingCycleDays;
  const dueDateSeed = hasOwn(source, "dueDate")
    ? toDate(source.dueDate)
    : hasOwn(source, "startDate") || hasOwn(source, "billingCycleDays")
      ? null
      : base.dueDate;
  const paymentDate = hasOwn(source, "paymentDate")
    ? toDate(source.paymentDate)
    : base.paymentDate;

  let isPaid = hasOwn(source, "isPaid") ? Boolean(source.isPaid) : base.isPaid;

  if (!hasOwn(source, "isPaid") && paymentDate) {
    isPaid = true;
  }

  const ownerId =
    hasOwn(source, "userId") || hasOwn(source, "studentId")
      ? resolveOwnerId(source)
      : base.userId;

  return {
    userId: ownerId,
    studentId: ownerId,
    startDate,
    dueDate: resolveDueDate(startDate, dueDateSeed, billingCycleDays),
    amount: hasOwn(source, "amount")
      ? toNullableNumber(source.amount)
      : base.amount,
    paymentDate,
    isPaid,
    billingCycleDays,
    reminderCount: resolveReminderCount(source, base.reminderCount),
    lastReminderAt: hasOwn(source, "lastReminderAt")
      ? toDate(source.lastReminderAt)
      : base.lastReminderAt,
    lastReminderChannel: hasOwn(source, "lastReminderChannel")
      ? source.lastReminderChannel ?? null
      : base.lastReminderChannel,
  };
};

export const buildLegacyPaymentBridge = (
  payment?: PaymentSourceInput | NormalizedPaymentSource | null,
): Required<LegacyPaymentBridge> => {
  const normalized = normalizePaymentSource(payment);

  return {
    startDate: normalized.startDate,
    dueDate: normalized.dueDate,
    amount: normalized.amount,
    paymentDate: normalized.paymentDate,
    isPaid: normalized.isPaid || Boolean(normalized.paymentDate),
    billingCycleDays: normalized.billingCycleDays,
    reminderCount: normalized.reminderCount,
    lastReminderAt: normalized.lastReminderAt,
    lastReminderChannel: normalized.lastReminderChannel,
  };
};

export const createInitialPaidPaymentSource = ({
  studentId,
  amount,
  startDate,
  billingCycleDays,
  paymentDate,
}: {
  studentId: Types.ObjectId | string;
  amount?: number | null;
  startDate?: Date | string | null;
  billingCycleDays?: number | null;
  paymentDate?: Date | string | null;
}) =>
  normalizePaymentSource({
    studentId,
    startDate: startDate ?? new Date(),
    amount: amount ?? DEFAULT_INITIAL_PAYMENT_AMOUNT,
    paymentDate: paymentDate ?? new Date(),
    isPaid: true,
    billingCycleDays: billingCycleDays ?? DEFAULT_PAYMENT_BILLING_CYCLE_DAYS,
  });

const toPaymentPersistence = (payment: NormalizedPaymentSource) => ({
  userId: payment.userId,
  studentId: payment.studentId,
  startDate: payment.startDate,
  dueDate: payment.dueDate,
  amount: payment.amount,
  paymentDate: payment.paymentDate,
  isPaid: payment.isPaid,
  billingCycleDays: payment.billingCycleDays,
  reminderCount: payment.reminderCount,
  lastReminderAt: payment.lastReminderAt,
  lastReminderChannel: payment.lastReminderChannel,
});

export const getLatestPaymentsMap = async (
  studentIds: Array<Types.ObjectId | string>,
) => {
  const normalizedIds = Array.from(
    new Set(studentIds.map((value) => String(value))),
  ).filter(Boolean);

  const result = new Map<string, NormalizedPaymentSource>();

  if (normalizedIds.length === 0) {
    return result;
  }

  const ownerIds = normalizedIds.map((id) => new Types.ObjectId(id));

  const payments = await Payment.find({
    $or: [{ userId: { $in: ownerIds } }, { studentId: { $in: ownerIds } }],
  })
    .sort({ dueDate: -1, updatedAt: -1, createdAt: -1 })
    .lean();

  for (const payment of payments) {
    const normalizedPayment = normalizePaymentSource(payment);
    const studentId = normalizedPayment.userId;

    if (!studentId || result.has(studentId)) {
      continue;
    }

    result.set(studentId, normalizedPayment);
  }

  return result;
};

export const getLatestPaymentForStudent = async (
  studentId: Types.ObjectId | string,
) => {
  const payments = await getLatestPaymentsMap([studentId]);
  return payments.get(String(studentId)) ?? null;
};

export const resolveStudentPaymentSource = (
  student: StudentWithLegacyPayment,
  latestPayment?: PaymentSourceInput | NormalizedPaymentSource | null,
) => {
  if (latestPayment) {
    return normalizePaymentSource(latestPayment, {
      userId: student._id,
      ...student.payment,
    });
  }

  return normalizePaymentSource({
    userId: student._id,
    ...student.payment,
  });
};

export const enrichStudentsWithPaymentBridge = async <
  T extends StudentWithLegacyPayment,
>(
  students: T[],
) => {
  const latestPayments = await getLatestPaymentsMap(
    students.map((student) => student._id),
  );

  return students.map((student) => {
    const paymentSource = resolveStudentPaymentSource(
      student,
      latestPayments.get(String(student._id)),
    );

    return {
      ...student,
      payment: buildLegacyPaymentBridge(paymentSource),
      paymentStatus: calculatePaymentStatus(paymentSource),
    };
  });
};

export const saveStudentPaymentSource = async (
  studentId: Types.ObjectId | string,
  nextPayment: PaymentSourceInput | NormalizedPaymentSource,
  options: SaveStudentPaymentOptions = {},
) => {
  const normalized = normalizePaymentSource(nextPayment, { userId: studentId });
  const existingPayment = await Payment.findOne(buildPaymentOwnerFilter(studentId)).sort({
    dueDate: -1,
    updatedAt: -1,
    createdAt: -1,
  });

  if (existingPayment) {
    const currentPayment = normalizePaymentSource(existingPayment.toObject());
    const shouldReplaceLatest =
      options.mode === "replace_latest" ||
      belongsToSameCycle(currentPayment, normalized);

    if (shouldReplaceLatest) {
      // Keep same-cycle corrections and reminder metadata on the latest record.
      existingPayment.set(toPaymentPersistence(normalized));
      await existingPayment.save();

      return normalizePaymentSource(existingPayment.toObject());
    }
  }

  // When the cycle boundaries change we append a new record to preserve history.
  const createdPayment = await Payment.create(toPaymentPersistence(normalized));
  return normalizePaymentSource(createdPayment.toObject());
};

export const syncUserPaymentBridge = async (
  studentId: Types.ObjectId | string,
  payment: PaymentSourceInput | NormalizedPaymentSource,
  options: { session?: ClientSession | null } = {},
) => {
  await User.updateOne(
    { _id: studentId },
    { $set: { payment: buildLegacyPaymentBridge(payment) } },
    options.session ? { session: options.session } : undefined,
  );
};
