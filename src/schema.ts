import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

function createdAtField() {
  return integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());
}

export const tasksTable = sqliteTable(
  "tasks",
  {
    id: integer().notNull().primaryKey({ autoIncrement: true }),
    queue: text().notNull(),
    payload: text().notNull(),
    createdAt: createdAtField(),
    status: text({
      enum: ["pending", "running", "pending_retry", "failed"],
    })
      .notNull()
      .default("pending"),
    expireAt: integer({ mode: "timestamp" }),
    allocationId: text().notNull(),
    numRunsLeft: integer().notNull(),
    maxNumRuns: integer().notNull(),
    idempotencyKey: text(),
  },
  (tasks) => [
    index("tasks_queue_idx").on(tasks.queue),
    index("tasks_status_idx").on(tasks.status),
    index("tasks_expire_at_idx").on(tasks.expireAt),
    index("tasks_num_runs_left_idx").on(tasks.numRunsLeft),
    index("tasks_max_num_runs_idx").on(tasks.maxNumRuns),
    index("tasks_allocation_id_idx").on(tasks.allocationId),
    unique().on(tasks.queue, tasks.idempotencyKey),
  ]
);

export type Job = typeof tasksTable.$inferSelect;
