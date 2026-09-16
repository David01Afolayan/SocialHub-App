export function logJobError(
  queue: string,
  jobId: string | undefined,
  error: unknown
) {
  console.error("JOB_FAILED", { queue, jobId, error })
}
