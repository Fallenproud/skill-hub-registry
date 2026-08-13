# Signed Skill Execution Contract

This contract captures the reusable doctrine recovered from signed-skill runtime work.

1. Authorization is evaluated before tool/runtime execution.
2. A skill package may be signed independently of its runtime binding.
3. Capability grants are scoped, attributable, time-bounded where appropriate, and fail closed.
4. Sensitive operations can require an explicit human approval token.
5. Execution emits attributable audit events and terminal status.
6. Invalid signature, missing capability, expired approval, or policy denial is a normal terminal decision—not an implicit fallback to unsafe execution.
