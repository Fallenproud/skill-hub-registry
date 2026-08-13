-- Read-only migration export query for the current Skill Hub registry.
-- Run against the existing Skill Hub database and serialize each returned row
-- into a file-backed skill package. This script performs no writes.
SELECT
  id,
  name,
  category_id,
  description,
  trigger_condition,
  boundary,
  priority,
  cost_class,
  latency_class,
  requires_auth,
  requires_freshness,
  safe_for_parallel,
  stateful,
  logs_required,
  inputs,
  outputs,
  fallback_chain,
  invoke_conditions,
  block_conditions,
  tool_definition,
  created_at,
  updated_at
FROM public.skills
ORDER BY category_id, id;
