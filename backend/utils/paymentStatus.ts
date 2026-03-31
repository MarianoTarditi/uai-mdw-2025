export type PaymentTrafficStatus =
  | "al_dia"
  | "vence"
  | "vencido"
  | "sin_configurar";

export type PaymentInput = {
  startDate?: Date | string | null;
  dueDate?: Date | string | null;
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
const WARNING_WINDOW_DAYS = 3;

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
  const explicitDueDate = toDate(payment?.dueDate);

  if (!startDate && !explicitDueDate) {
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
  const paymentDate = toDate(payment?.paymentDate);
  const hasPaidFlag = Boolean(payment?.isPaid) || Boolean(paymentDate);

  const nextDueDate = explicitDueDate
    ? normalizeStartOfDay(explicitDueDate)
    : startDate
      ? new Date(
          normalizeStartOfDay(startDate).getTime() +
            billingCycleDays * MS_PER_DAY,
        )
      : null;

  if (!nextDueDate) {
    return {
      status: "sin_configurar",
      nextDueDate: null,
      daysUntilDue: null,
      isCurrentCyclePaid: false,
    };
  }

  const daysUntilDue = Math.ceil(
    (nextDueDate.getTime() - today.getTime()) / MS_PER_DAY,
  );

  if (hasPaidFlag) {
    return {
      status: "al_dia",
      nextDueDate,
      daysUntilDue,
      isCurrentCyclePaid: true,
    };
  }

  if (daysUntilDue < 0) {
    return {
      status: "vencido",
      nextDueDate,
      daysUntilDue,
      isCurrentCyclePaid: false,
    };
  }

  if (daysUntilDue <= WARNING_WINDOW_DAYS) {
    return {
      status: "vence",
      nextDueDate,
      daysUntilDue,
      isCurrentCyclePaid: false,
    };
  }

  return {
    // Neutral fallback until the frontend adds a dedicated "pending but not due-soon" label.
    status: "sin_configurar",
    nextDueDate,
    daysUntilDue,
    isCurrentCyclePaid: false,
  };
};
