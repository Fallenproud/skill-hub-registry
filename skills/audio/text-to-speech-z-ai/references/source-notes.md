# Source Notes — TTS / z-ai-web-dev-sdk

Canonicalized from the user-provided TTS Skill specification.

## Preserved Source Constraints

- Use `z-ai-web-dev-sdk` in backend code only.
- Maximum 1024 input characters per request; split longer text safely.
- Speed range 0.5–2.0.
- Volume >0 and <=10.
- Streaming supports PCM only.
- Non-streaming supports WAV, PCM and MP3.
- Recommended sample rate: 24000 Hz.
- SDK returns a standard `Response`; use `await response.arrayBuffer()` and convert with `Buffer.from(new Uint8Array(arrayBuffer))`.
- Reuse SDK instances for application workloads.
- Validate and verify generated audio rather than treating an issued API call as proof of completion.

## Source-Provided Voice IDs

`tongtong`, `chuichui`, `xiaochen`, `jam`, `kazi`, `douji`, `luodo`.

Provider/runtime documentation remains authoritative if supported voices or constraints change.

## Canonicalization Notes

The repository Skill was shortened into an execution-oriented reusable Skill Hub form while preserving the source's runtime boundary, API constraints, supported formats, primary usage patterns, error handling and verification requirements.
