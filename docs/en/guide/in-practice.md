# In Practice — This Tutorial as Its Own Test Case

> Using the actual build process of this tutorial to trace each concept back to reality.

This tutorial was written by an agent tool.

It started with a single file—`draft-ideas.md`, 68 lines. A handful of concepts listed out: context, tools, MCP, commands, sub-agents. Two or three sentences under each. The rest said "out of scope for now."

The user walked into an empty repo with that file and typed the first message:

> "Use this repository to build a GitHub Pages tutorial site on agentic adoption."

Followed immediately by:

> "Content comes later. Scaffold first."

Scaffold first. VitePress site structure, GitHub Pages deployment, bilingual routing—done in minutes.

Then the user pointed at `draft-ideas.md`: "Phase 1." But before the agent could start expanding, an addition: "Load the brainstorming skill first." Not "go ahead and expand it"—first, specify *how* to expand it.

After the initial expansion, 68 lines weren't enough to support a full tutorial site. The user wanted industry perspectives. A single message listed the names: Steve Yegge, Gene Kim, Karpathy, Martin Fowler, plus the creators of Cline, Roo, Claude Code, OpenCode—"Draw from their key insights and see what can strengthen our skeleton."

Six librarian agents fanned out simultaneously, each researching a different cluster of industry voices. The user dropped a line that would recur throughout the project: "Always run sub-agents in the background"—with a straightforward reason: "So I can keep talking to you while they work."

When research came back, the user wasn't satisfied with coverage of the Chinese market. A single name was offered as a lead, and the agent was sent to find more practitioners from China's AI coding scene. Another batch of agents dispatched.

Once enough material accumulated, the agent organized it into one large file. The user looked at the file structure and rejected it on the spot: "A-to-F, G-to-L—terrible file naming. I asked for logical and well-organized. This isn't." Redo.

The materials eventually got split into a `materials/` directory with logical groupings. But they weren't meant to be copied verbatim—the user invoked a Chinese idiom that roughly translates to "stones from other mountains can polish your jade." Take knowledge from the "building agents" world, filter for what's useful to people who *use* agent tools.

Then came the concept-by-concept review. User and agent sat down together, evaluating each piece of research for skeleton inclusion:

- "Worth its own chapter?" — "No, but it's good as a sub-item."
- "Does it need dedicated coverage?" — "A brief mention is enough."
- "Should this go into the skeleton?" — "Yes, but not about LangChain or LangGraph."
- "Human-in-the-loop?" — "Absolutely. Worth its own chapter."
- "Cost?" — "Out of scope for now."

Along the way, key principles got established: "We need to stay agent-agnostic"—no tying to any specific product. Universal concepts only.

68 lines became 16 concept nodes. Skeleton locked.

Time to write content. The first piece was context.md—but the user didn't just say "go write it." There was a specific direction: "Frame it around HTTP requests and responses, including SSE events—that's how agents communicate with LLM APIs, and how context accumulates." That instruction established the technical explanation pattern used across every chapter: show agent-LLM communication through HTTP request/response pairs.

After the first draft landed, work moved to the second piece—actors.md. The user read the first version: "Not good enough. Improve it." Then did something specific: "I've staged both files—you handle the edits only, so I can review the diff." The user pre-staged files in git, the agent only handled content edits—no staging, no committing. The user wanted to see the diff and decide what to accept.

This pattern recurred throughout the project.

With two pieces establishing the baseline, all remaining nodes went out at once. Over a dozen sub-agents received tasks simultaneously, each responsible for one concept node in both Chinese and English. Completion notifications started rolling in one after another. A few drafts landed in wrong directories—"Don't delete—just move them." Meanwhile, Oracle got called in to review key nodes for quality.

By the end of that day, first drafts existed for every node.

Then a new phase began. The user called for humanizer skill to start review passes. Simultaneously, SVG illustrations kicked off. The first illustration wasn't good—the user said so directly. Then came a turning point: "Give it the relevant skills and a prompt, but don't constrain its imagination." Don't constrain the creative process. The result came back with animated arrows inside the SVG. The user's reaction: "I didn't even know SVG could do that." From that point on, the SVG strategy changed—provide direction, not constraints.

The writing style solidified during this phase too. The user said: "Whenever we edit content in this repo, always load the humanizer skill and the hybrid writing style. Put it in CLAUDE.md." One sentence turned a conversational preference into a permanent rule—inherited by every future session and every sub-agent automatically.

Review wasn't a one-pass affair. First, the humanizer skill scrubbed AI-generated phrasing—filler words like "Additionally," "crucial," and "indispensable" got hunted down and replaced one by one. Then different models were brought in for cross-review: Kimi K2.5 and MiniMax each did a pass, specifically looking for blind spots that Opus couldn't see in its own output. Finally, Opus did an exhaustive sweep—counting repeated filler-token usage in the same article. Each pass caught things the previous one missed.

Content wasn't frozen after the first drafts either. The user launched a research initiative—using the very methodology the tutorial teaches (multi-agent parallel orchestration) to verify the tutorial's own coverage. A large set of community sources was fed in, and the result confirmed the skeleton was sound. The gaps weren't in breadth—they were in depth. Three blind spots were flagged as high priority: parallel session governance, long-running loop control, and team-level configuration management. Those findings drove a second round of content deepening, expanding nearly ten chapters.

From 68 lines to a full tutorial site—the space between was filled with review passes, SVG iterations, the growth of writing rules, and rounds of human course-correction. Those stories are told below.

The tool was OpenCode, but the patterns behind it apply to any agent tool you use.

## The Rulebook — From Blank Slate to Discipline

> Related concepts: [System Instructions](/en/guide/system-instructions), [Knowledge Feeding](/en/guide/knowledge-feeding)

Early on, CLAUDE.md had nothing but engineering constraints—tech stack, package manager, build commands. Nothing about content.

Then things started happening.

The agent fabricated a nonexistent mechanism while explaining a concept. The user's response: "Stop making things up." That one sentence drove a new rule: claims about specific implementation details must cite sources or include qualifiers.

During a review pass, five section headings got flagged as "too literary"—things like "Loading Your Brain into an Agent" and "Hiring a Tutor for Your Agent." Readers use headings to locate content. Poetic headings don't convey information. A new rule went into the file: no literary headings.

This kept happening. Whenever the same kind of correction came up more than twice, it stopped living in conversation and got written into the rules file—effective for every future session.

For example, review passes flagged terms like "mental model" as unnecessarily academic—readers don't need that jargon to grasp the concept. Banned, replaced with "how to think about it." "Leverage" sounded like an MBA deck, replaced with "most effective way." "Scar tissue" and "crystals" read like literary metaphors, replaced with "lessons from mistakes" and "validated practices."

None of these rules were designed upfront. Each one grew from an actual stumble.

Banned terms were only half the story. The other half was turning "something feels off" into enforceable checks.

During one review pass, the user noticed leftover emoji markers in the docs—🔍, 🎯, 🧠—artifacts from early structured notes. A simple "these are still in there" triggered a full sweep: scan every .md file, locate every match, batch-replace. Not manual hunting—the agent ran a script and listed every hit.

In the exhaustive review phase, the focus shifted from "which words to ban" to "which words appear too often." The Chinese word for "essentially" and its English counterpart—both high-frequency fingerprints of AI-generated text. One article had eight occurrences. That became a density rule: no more than two per document. Beyond that, swap in "put simply" or delete outright.

From banning a word to capping its frequency—that level of precision only emerged after five rounds of review.

But not every rule came from user corrections. Toward the later review passes, the agent itself started identifying patterns—distilling five "aesthetic priority" rankings from repeated edits (neutral over judgmental, precise over vivid, plain over ornate), and proposing them for inclusion in CLAUDE.md. The rules file became a co-authored artifact: the user added rules when things went wrong, the agent added rules when it spotted recurring patterns.

Rules also had hierarchy. Some lived in the project's CLAUDE.md—scoped to this repository only. Others got promoted to the user-level configuration, affecting every project and every session. "Sub-agents should run in background," for instance, started as a verbal preference in this project, then got written into the user's global system instructions—because it wasn't project-specific, it was universally useful. Where a rule lands depends on whether it's particular to one project or general enough for all of them.

**The transferable pattern**: Every agent tool has a "system instructions" layer. Editing that layer beats repeating yourself—verbal corrections only affect the current conversation. Rules in the file affect every conversation after.

## Skills — Loading and Unloading on Demand

> Related concepts: [Skills](/en/guide/skills), [Slash Commands](/en/guide/commands)

When writing tutorial content, `adopt-agentic-writer` was loaded—carrying the hybrid writing style and the HTTP request/response explanation template. During review passes, that got swapped for `humanizer-zh`—specialized in scrubbing AI-generated phrasing. For SVG illustrations, `baoyu-infographic`, `baoyu-image-gen` and related visual skills took over.

Different phases, different core skills. `adopt-agentic-writer` stayed loaded throughout the content writing phase; during review, `humanizer-zh` took the lead but the writer skill remained available. Once visual production started and the baoyu suite took over, writing skills stopped being passed to sub-agents—their tasks didn't need them.

There's a gotcha here: sub-agents are stateless. The main agent having a skill loaded doesn't mean its child tasks inherit that knowledge. At one point, a sub-agent produced an SVG that ignored the visual design guidelines. The user asked: "Did you pass the baoyu skill to the sub-agent?" The answer was no—it hadn't been passed along in the task dispatch.

After that, a habit formed: every time a sub-agent gets a task, explicitly list the skills it needs. Capabilities aren't inherited by default. They have to be passed explicitly.

**The transferable pattern**: Skills go by different names across tools—prompt fragments, rule files, templates. The core mechanism is the same: load a chunk of context on demand, unload it when done. The difference from Slash Commands: a command says "do this thing right now," a skill says "work this way from now on."

## Tools — How the Agent Actually Works

> Related concepts: [Built-in Tools](/en/guide/built-in-tools), [MCP](/en/guide/mcp), [CLI Tools](/en/guide/cli-tools)

Looking at the tool call logs, one pattern stands out: file reads vastly outnumber file edits. Not because the agent loves reading—when editing tutorial content, nearly every edit was preceded by a read of the same file. Confirm the current content and context first, then make changes. Editing without reading first usually means hitting the wrong spot or losing surrounding context.

When editing, there are two paths: surgical edits and full-file rewrites. Changing a paragraph or swapping a word calls for surgical editing. Creating a new file or doing a ground-up rewrite calls for overwriting. During one SVG iteration, a sub-agent tried to "restore animations" by overwriting the entire file—and wiped out all existing animations in the process. After that, the strategy changed: animation work uses incremental edits only, never full-file rewrites.

External search (via MCP-connected tools like Firecrawl, Exa, and GitHub search) showed an interesting distribution: the vast majority of searches happened in sub-agent sessions, not the main session. The main agent handles coordination and final drafting. Sub-agents go out, find evidence, bring conclusions back. The main agent decides what to use.

What got searched tracked the project phase. Early on, it was industry research—Reddit, Hacker News, technical blogs—mining for valuable community signals. Later, it shifted to fact-checking—official documentation, GitHub source code, verifying whether technical claims in the tutorial were accurate. At one point, the user asked to cross-check how four different agent tools handle context injection timing. Sub-agents fanned out to each tool's official docs, brought back findings, and the cross-comparison led to two corrections in the tutorial. Search wasn't a one-time activity—it ran throughout the project. Only the targets changed with each phase.

CLI usage patterns are worth noting too. Build verification ran many times—after every round of edits. Git operations were mostly local inspection (diff, status, log), with very few pushes to remote. One unexpected use: `bun` was used to run SQLite queries directly, analyzing session data from the work history. CLI tools aren't just helpers—they're first-class analysis instruments for the agent.

One more phenomenon ties directly back to context management: once a session gets long enough, the context gets automatically compressed—conversation history is summarized, early details are discarded. The main session triggered dozens of compaction events.

What happens after compression? The agent's first move isn't to continue editing files—it's to re-read CLAUDE.md and the plan files. Remembering "who I am and what I'm supposed to be doing" before resuming work. The pattern shows clearly in the data: most of the first few operations after compaction are reads of rules and plans.

This is what the "compress" and "select" operations from [chapter one](/en/guide/context) look like in practice—the window got compressed, and the agent has to actively choose which critical context to restore first. Rules and plans get re-read first because they're the "decision baseline"—losing other things can be recovered by re-reading source files, but losing the decision baseline leads to contradictions.

**The transferable pattern**: Regardless of which agent tool you use, the "read → edit → verify" loop is universal. MCP turns external search into a standardized, delegatable capability. CLI output is plain text—naturally suited for context injection.

## Orchestration — Fifteen Agents from a Single Message

> Related concepts: [Orchestration](/en/guide/orchestration), [Sub Agents](/en/guide/sub-agents)

This project didn't do "dispatch one, wait for one." The user set this rule early on: "Sub-agents should always run in the background"—the reasoning was straightforward: while they run in the background, I can keep talking to the main agent.

A rhythm emerged: **fan-out → advance → harvest**.

Fan-out: batch-dispatch similar tasks to sub-agents. When writing tutorials, drafts for a dozen chapters went out simultaneously. When generating SVGs, multiple illustrations launched in parallel. The peak was fifteen sub-agents dispatched in a single message.

Advance: while sub-agents run in the background, the main agent keeps working—reviewing earlier results, updating rule files, responding to new user requests.

Harvest: collect results at checkpoints, in batches. Not polling each task the moment it's dispatched, but letting them accumulate and pulling them back together.

When not to parallelize? Anything that requires an immediate verdict—build verification, commit operations, final review conclusions. Those run sequentially. The result has to land before the next step can be decided.

A concrete example: when rewriting this chapter, patterns needed to be extracted from work session history. A single message dispatched eleven sub-agents, each digging into a different dimension—orchestration patterns, SVG iteration chains, user correction records. The main agent continued working on structure design while they ran. Once enough results accumulated, they got pulled back in one batch to see which findings were usable.

Every dispatched task carried a structured prompt: what the goal is, what must be done, what's forbidden, what the expected output looks like. Not a casual one-liner. This structure proved especially useful for failure recovery—when a sub-agent didn't finish, resuming its session could precisely specify "what wasn't done."

Skill packs switched with the phase. During tutorial writing, sub-agents shipped out with the writer skill. During review, they carried the humanizer. For SVG work, the entire visual skill suite got bundled in. Not a fixed template—the main agent selected capability packs based on the current task domain, with almost no overlap between phases.

For failure recovery, session resumption beats starting fresh—the context is already there, no need to re-read files or re-establish background. The follow-up prompt only needs to specify what went wrong. Early attempts at session resumption often failed—the tooling wasn't stable enough, sessions couldn't be found. By the later phases, resumption had become the standard recovery mechanism.

One more pattern worth noting: some background tasks ran to completion but their results were never explicitly collected. Not forgotten—the value had already been obtained through other channels, or the decision no longer needed that particular output. Parallel dispatch naturally tolerates redundancy: dispatching a few extra tasks is lower risk than dispatching too few, even if some results go unused.

Role specialization was clear too. Oracle (a sub-agent specialized in content judgment and narrative strategy) and Metis (a sub-agent specialized in plan completeness and acceptance criteria) handled their respective domains. The main agent made final calls. Different roles, different strengths—not interchangeable generalists.

**The transferable pattern**: Parallel vs. sequential isn't about the tool. It's about whether tasks depend on each other. No dependency means parallel. Dependency means sequential. Sub-agent context is isolated—what the main agent sees, the sub-agent may not, and vice versa.

## Verification — Passing the Build Doesn't Mean Passing Review

> Related concepts: [Context](/en/guide/context), [Human-in-the-Loop](/en/guide/human-in-the-loop)

The SVG illustrations made this distinction painfully clear.

One file—context.svg—went through eleven iterations. One stretch was especially telling:

During a style diversification phase, switching visual styles dropped the animation count from thirty to five. No errors—valid XML, successful build. But content was lost.

The first attempt to restore animations failed. A sub-agent injected them via full-file rewrite, which broke the new style in the process.

Strategy change: incremental edits, injecting animations one by one. That brought the count back to twenty-six. The main agent manually added the last four, reaching thirty.

Then the user took one look: "Not clear enough—four items in a single row doesn't work." Layout problem. Another round of redesign—linear layout became a 2×2 grid.

The whole saga exposed three layers of verification:

- **Technical verification**: Valid XML, build passes, no syntax errors. Automatable.
- **Task verification**: Animation count sufficient, text not clipped, no information lost. Scriptable.
- **Aesthetic verification**: Does it look good? Does it have "soul"? Is the layout clear? Only a human can judge.

The first two layers passing didn't prevent the third from rejecting. The user said "Too static," "No soul," "That looks like a nose"—feedback that can't be scripted, but determines the final verdict.

**The transferable pattern**: Every agent workflow has these three layers. Pure technical tasks may only need the first two. But anything involving creativity or judgment—the third layer is non-negotiable.

## People — More Process Corrections Than Content Corrections

> Related concepts: [Human-in-the-Loop](/en/guide/human-in-the-loop), [The Triangle](/en/guide/actors)

Looking back at the user's corrections, there's a surprising finding: nearly half weren't about content—they were about process.

"Sub-agents must run in background"—that's process.

"Text editing must be done by the main agent, not delegated to sub-agents"—also process.

"No commits before I review"—still process.

The tone of corrections had a clear escalation pattern. It started with mild preference statements: "Sub-agents should always run in the background." Then direct rejections: "This doesn't look appealing—we're not running a marketing campaign." When the same issue kept recurring, the tone spiked—directly calling out the agent for fabricating facts, demanding evidence before conclusions.

The most intense exchange was about factual accuracy. The agent made a string of assertions about how skill loading works—plausible-sounding, but entirely fabricated when checked against source code. The user's first response was blunt: stop making things up. The agent acknowledged and corrected. But a few rounds later, similar issues resurfaced, and the user escalated: "Be factual."

The two corrections together drove a permanent rule: claims about specific technical mechanisms must distinguish between "verified" and "unverified." Once written into CLAUDE.md, all subsequent sessions and sub-agents were bound by it. The problem stopped recurring.

There's another form of course-correction that's less obvious: interruption. The user cut in while the agent was still mid-response, redirecting to a new topic. This happened twenty times in the main session. Interruptions weren't rejections—most of the time, the agent wasn't doing anything wrong. The user's priorities had simply shifted. The agent was delivering a status summary the user already knew the conclusion of—interrupt, move to the next task.

The same problem getting corrected more than twice means the agent didn't "learn." At that point, the right move isn't a third verbal reminder—it's writing it into the rules file. Verbal corrections only last for the current conversation. Rules in System Instructions persist across every future request.

But not every verbal correction became a rule. Tracking these conversions reveals an interesting distribution: "no literary headings" got written into the rules file after a single occurrence—because it was obvious the same issue would recur. Meanwhile, "no commits before I review" came up repeatedly in conversation but stayed as a runtime constraint, never formalized into a rule. Constraints that live only in conversation carry a risk: switch to a new session and they vanish.

When is a verbal correction enough? One-off issues specific to the current task. When must it become a rule? The same class of problem appearing more than twice, or any constraint that needs to survive across sessions. That judgment call is itself part of HITL—not every correction is worth institutionalizing, but repeated corrections that never get codified are wasting the human's time.

The user also had a pattern worth noting—track-laying. "I've staged both files—you handle the edits only"—the user set up version control state in advance, and the agent only handled content edits, not git operations. Rails laid down, agent runs on them.

Not because the agent can't use git. But a messy commit history is expensive to untangle. The user chose to keep that under personal control—review first, then commit, making sure every commit is clean and traceable. High-risk operations stay manual, low-risk operations get delegated—that's the core HITL judgment call.

**The transferable pattern**: People do three things in an agent workflow—define tasks, correct course, accept results. When corrections repeat, codify them into rules. Keep human approval for high-risk operations, delegate the rest.

## This Article Itself

The text you just finished reading went through every process described above.

Multiple sub-agents searched session history in parallel, extracted patterns, brought back findings. Oracle (a sub-agent specialized in narrative strategy) reviewed the overall structure. Metis (a sub-agent specialized in plan review) checked completeness. The user said "Write in plain language—don't dump statistics"—so the format shifted from statistical report to the stories you just read. The writing process followed the rules in CLAUDE.md—rules that grew from the same mistakes described in these pages.

Writing this chapter involved SQLite queries to sift through work session history—the same `bun -e` plus database combination described in the "Tools" section above. Git commit history was aligned to session messages one by one—the user instruction behind each commit was traced not from memory, but from data.

The tutorial validated its own theory by building itself. If that's not enough to show what "context management" looks like in practice, go back and reread [chapter one](/en/guide/context).
