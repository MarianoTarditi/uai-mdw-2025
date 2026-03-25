export type PaymentTrafficStatus =
  | "al_dia"
  | "vence"
  | "vencido"
  | "sin_configurar";

type PaymentInput = {
  startDate?: Date | string | null;
  paymentDate?: Date | string | null;
  isPaid?: boolean | null;
  billingCycleDays?: number | null;
};

export type PaymentStatusResult = {
  status: PaymentTrafficStatus;
  nextDueDate: Date | null;
  daysUntilDue: number | null;
  isCurrentCyclePaid: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_BILLING_DAYS = 30;
const DUE_SOON_WINDOW_DAYS = 3;

const toDate = (value?: Date | string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeStartOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

export const calculatePaymentStatus = (
  payment: PaymentInput | null | undefined,
  now = new Date(),
): PaymentStatusResult => {
  const startDate = toDate(payment?.startDate);
  if (!startDate) {
    return {
      status: "sin_configurar",
      nextDueDate: null,
      daysUntilDue: null,
      isCurrentCyclePaid: false,
    };
  }

  const billingCycleDays =
    payment?.billingCycleDays && payment.billingCycleDays > 0
      ? payment.billingCycleDays
      : DEFAULT_BILLING_DAYS;

  const today = normalizeStartOfDay(now);
  const anchor = normalizeStartOfDay(startDate);
  const paymentDate = toDate(payment?.paymentDate);
  const hasPaidFlag = Boolean(payment?.isPaid);

  const cyclesSinceAnchor = Math.max(
    0,
    Math.floor((today.getTime() - anchor.getTime()) / (billingCycleDays * MS_PER_DAY)),
  );

  const currentCycleStart = new Date(
    anchor.getTime() + cyclesSinceAnchor * billingCycleDays * MS_PER_DAY,
  );
  const nextDueDate = new Date(
    currentCycleStart.getTime() + billingCycleDays * MS_PER_DAY,
  );

  const isCurrentCyclePaid =
    hasPaidFlag &&
    Boolean(paymentDate) &&
    paymentDate!.getTime() >= currentCycleStart.getTime() &&
    paymentDate!.getTime() < nextDueDate.getTime();

  const daysUntilDue = Math.ceil(
    (nextDueDate.getTime() - today.getTime()) / MS_PER_DAY,
  );

  if (isCurrentCyclePaid) {
    return {
      status: "al_dia",
      nextDueDate,
      daysUntilDue,
      isCurrentCyclePaid: true,
    };
  }

  if (daysUntilDue <= 0) {
    return {
      status: "vencido",
      nextDueDate,
      daysUntilDue,
      isCurrentCyclePaid: false,
    };
  }

  if (daysUntilDue <= DUE_SOON_WINDOW_DAYS) {
    return {
      status: "vence",
      nextDueDate,
      daysUntilDue,
      isCurrentCyclePaid: false,
    };
  }

  return {
    status: "al_dia",
    nextDueDate,
    daysUntilDue,
    isCurrentCyclePaid: false,
  };
};

