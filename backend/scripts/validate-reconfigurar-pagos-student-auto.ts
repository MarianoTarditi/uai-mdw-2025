import assert from "node:assert/strict";

import Payment from "../models/Payment";
import {
  buildLegacyPaymentBridge,
  createInitialPaidPaymentSource,
  normalizePaymentSource,
  saveStudentPaymentSource,
} from "../utils/paymentBridge";
import { calculatePaymentStatus } from "../utils/paymentStatus";

const utcDate = (iso: string) => new Date(iso);
const localStartOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const studentId = "64b000000000000000000001";

const logStep = (label: string) => {
  console.log(`✓ ${label}`);
};

const run = async () => {
  const now = utcDate("2026-04-10T12:00:00.000Z");
  const dueInThreeDays = utcDate("2026-04-13T12:00:00.000Z");
  const overdue = utcDate("2026-04-09T12:00:00.000Z");

  const paidStatus = calculatePaymentStatus(
    {
      startDate: utcDate("2026-04-01T12:00:00.000Z"),
      dueDate: dueInThreeDays,
      paymentDate: utcDate("2026-04-01T12:00:00.000Z"),
      isPaid: true,
      billingCycleDays: 30,
    },
    now,
  );

  assert.equal(paidStatus.status, "al_dia");
  assert.equal(paidStatus.isCurrentCyclePaid, true);
  assert.equal(paidStatus.daysUntilDue, 3);
  assert.equal(
    paidStatus.nextDueDate?.getTime(),
    localStartOfDay(dueInThreeDays).getTime(),
  );
  logStep("calculatePaymentStatus marks paid payments as al_dia");

  const dueSoonStatus = calculatePaymentStatus(
    {
      startDate: utcDate("2026-04-01T12:00:00.000Z"),
      dueDate: dueInThreeDays,
      isPaid: false,
      billingCycleDays: 30,
    },
    now,
  );

  assert.equal(dueSoonStatus.status, "vence");
  assert.equal(dueSoonStatus.daysUntilDue, 3);
  logStep("calculatePaymentStatus marks the 3-day warning window as vence");

  const overdueStatus = calculatePaymentStatus(
    {
      startDate: utcDate("2026-04-01T12:00:00.000Z"),
      dueDate: overdue,
      isPaid: false,
      billingCycleDays: 30,
    },
    now,
  );

  assert.equal(overdueStatus.status, "vencido");
  assert.equal(overdueStatus.daysUntilDue, -1);
  logStep("calculatePaymentStatus marks overdue payments as vencido");

  const initialPayment = createInitialPaidPaymentSource({
    studentId,
    amount: 12000,
    startDate: utcDate("2026-04-01T12:00:00.000Z"),
    billingCycleDays: 45,
    paymentDate: utcDate("2026-04-01T13:00:00.000Z"),
  });

  assert.equal(initialPayment.userId, studentId);
  assert.equal(initialPayment.studentId, studentId);
  assert.equal(initialPayment.isPaid, true);
  assert.equal(initialPayment.amount, 12000);
  assert.equal(initialPayment.billingCycleDays, 45);
  assert.equal(
    initialPayment.dueDate?.getTime(),
    utcDate("2026-05-16T12:00:00.000Z").getTime(),
  );
  logStep("createInitialPaidPaymentSource builds the first paid cycle correctly");

  const bridge = buildLegacyPaymentBridge(initialPayment);
  assert.equal(bridge.isPaid, true);
  assert.equal(bridge.amount, 12000);
  assert.equal(bridge.billingCycleDays, 45);
  assert.equal(bridge.paymentDate?.getTime(), utcDate("2026-04-01T13:00:00.000Z").getTime());
  logStep("buildLegacyPaymentBridge preserves the compatibility mirror");

  const normalizedForCurrentCycle = normalizePaymentSource({
    userId: studentId,
    startDate: utcDate("2026-04-01T12:00:00.000Z"),
    dueDate: utcDate("2026-05-01T12:00:00.000Z"),
    amount: 10000,
    paymentDate: utcDate("2026-04-01T12:00:00.000Z"),
    isPaid: true,
    billingCycleDays: 30,
  });

  const replaceTracker = {
    createCalls: 0,
    saveCalls: 0,
    latestSetPayload: null as Record<string, unknown> | null,
  };

  const mockedCurrentPayment = {
    userId: studentId,
    studentId,
    startDate: utcDate("2026-04-01T12:00:00.000Z"),
    dueDate: utcDate("2026-05-01T12:00:00.000Z"),
    amount: 10000,
    paymentDate: utcDate("2026-04-01T12:00:00.000Z"),
    isPaid: true,
    billingCycleDays: 30,
    reminderCount: 0,
    lastReminderAt: null,
    lastReminderChannel: null,
    toObject() {
      return { ...this };
    },
    set(payload: Record<string, unknown>) {
      replaceTracker.latestSetPayload = payload;
      Object.assign(this, payload);
    },
    save: async () => {
      replaceTracker.saveCalls += 1;
      return this;
    },
  };

  const originalFindOne = Payment.findOne;
  const originalCreate = Payment.create;

  try {
    (Payment as any).findOne = () => ({
      sort: () => mockedCurrentPayment,
    });
    (Payment as any).create = async (payload: Record<string, unknown>) => {
      replaceTracker.createCalls += 1;

      return {
        toObject: () => payload,
      };
    };

    const savedSameCycle = await saveStudentPaymentSource(
      studentId,
      {
        ...normalizedForCurrentCycle,
        amount: 15000,
      },
    );

    assert.equal(replaceTracker.saveCalls, 1);
    assert.equal(replaceTracker.createCalls, 0);
    assert.equal(savedSameCycle.amount, 15000);
    assert.equal(savedSameCycle.dueDate?.getTime(), normalizedForCurrentCycle.dueDate?.getTime());
    assert.equal(
      replaceTracker.latestSetPayload?.amount,
      15000,
    );
    logStep("saveStudentPaymentSource replaces the latest record inside the same cycle");
  } finally {
    (Payment as any).findOne = originalFindOne;
    (Payment as any).create = originalCreate;
  }

  const appendTracker = {
    createCalls: 0,
    saveCalls: 0,
  };

  const mockedPreviousCyclePayment = {
    userId: studentId,
    studentId,
    startDate: utcDate("2026-03-01T12:00:00.000Z"),
    dueDate: utcDate("2026-03-31T12:00:00.000Z"),
    amount: 9000,
    paymentDate: utcDate("2026-03-01T12:00:00.000Z"),
    isPaid: true,
    billingCycleDays: 30,
    reminderCount: 0,
    lastReminderAt: null,
    lastReminderChannel: null,
    toObject() {
      return { ...this };
    },
    save: async () => {
      appendTracker.saveCalls += 1;
      return mockedPreviousCyclePayment;
    },
  };

  try {
    (Payment as any).findOne = () => ({
      sort: () => mockedPreviousCyclePayment,
    });
    (Payment as any).create = async (payload: Record<string, unknown>) => {
      appendTracker.createCalls += 1;

      return {
        toObject: () => payload,
      };
    };

    const appendedPayment = await saveStudentPaymentSource(studentId, {
      userId: studentId,
      startDate: utcDate("2026-04-01T12:00:00.000Z"),
      dueDate: utcDate("2026-05-01T12:00:00.000Z"),
      amount: 16000,
      paymentDate: utcDate("2026-04-01T12:00:00.000Z"),
      isPaid: true,
      billingCycleDays: 30,
    });

    assert.equal(appendTracker.createCalls, 1);
    assert.equal(appendTracker.saveCalls, 0);
    assert.equal(appendedPayment.amount, 16000);
    assert.equal(
      appendedPayment.dueDate?.getTime(),
      utcDate("2026-05-01T12:00:00.000Z").getTime(),
    );
    logStep("saveStudentPaymentSource appends a new record when the cycle changes");
  } finally {
    (Payment as any).findOne = originalFindOne;
    (Payment as any).create = originalCreate;
  }

  console.log("");
  console.log("Validation passed for reconfigurar-pagos-student-auto.");
  console.log(
    "Covered: 3-day status window, initial paid payment creation, legacy bridge, and cycle-aware save behavior.",
  );
};

run().catch((error) => {
  console.error("Validation failed for reconfigurar-pagos-student-auto.");
  console.error(error);
  process.exitCode = 1;
});
