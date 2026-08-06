/**
 * Threads Admin Seed Script
 * =========================
 * Control likes, views, comments, and threads in your Threads clone.
 *
 * Usage:
 *   node seed.js --help                      Show this help
 *   node seed.js --list                      List all threads
 *   node seed.js --thread <id> --likes <n>  Set likes on a thread
 *   node seed.js --thread <id> --views <n>  Set views on a thread
 *   node seed.js --thread <id> --comments <n>  Add N fake comments
 *   node seed.js --create --text "..."      Create a new thread
 *
 * Prerequisites:
 *   1. Copy .env.example to .env and fill in MONGODB_URL
 *   2. Run: npm install
 *
 * Example:
 *   node seed.js --thread 60d5ec49f1b2c8a1f8e4d5b2 --likes 99999 --views 500000
 */

const mongoose = require("mongoose");
const { program } = require("commander");

// ─── Config ───────────────────────────────────────────────────────────────────
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error("❌  MONGODB_URL not set. Add it to your .env file.");
  process.exit(1);
}

// ─── In-memory schema (mirrors your app's Thread model) ──────────────────────
const threadSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCount(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Commands ─────────────────────────────────────────────────────────────────

program
  .name("seed")
  .description("Admin tool to control Threads clone data")
  .version("1.0.0");

// ── List all threads ──────────────────────────────────────────────────────────
program
  .command("list")
  .description("List all top-level threads with their current likes/views/comments")
  .action(async () => {
    await mongoose.connect(MONGODB_URL);
    const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .limit(50)
      .populate("author", "name image");

    console.log(`\n📋  ${threads.length} thread(s) found:\n`);
    for (const t of threads) {
      const authorName = t.author?.name || "Unknown";
      console.log(`  ID:   ${t._id}`);
      console.log(`  Author: ${authorName}`);
      console.log(`  Text:  ${t.text.substring(0, 80)}${t.text.length > 80 ? "..." : ""}`);
      console.log(`  Likes: ${formatCount(t.likes || 0)}`);
      console.log(`  Views: ${formatCount(t.views || 0)}`);
      console.log(`  Comments: ${t.children?.length || 0}`);
      console.log(`  Created: ${new Date(t.createdAt).toLocaleString()}`);
      console.log(`  ─────────────────────────────────────────`);
    }

    await mongoose.disconnect();
  });

// ── Update thread ─────────────────────────────────────────────────────────────
program
  .command("thread <id>")
  .description("Update a specific thread")
  .option("--likes <number>", "Set like count")
  .option("--views <number>", "Set view count")
  .option("--comments <number>", "Add N fake comments")
  .action(async (id, options) => {
    await mongoose.connect(MONGODB_URL);

    const thread = await Thread.findById(id);
    if (!thread) {
      console.error(`❌  Thread ${id} not found.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    let changed = false;

    if (options.likes !== undefined) {
      const val = parseInt(options.likes, 10);
      if (isNaN(val)) {
        console.error("❌  --likes must be a number.");
        await mongoose.disconnect();
        process.exit(1);
      }
      thread.likes = val;
      changed = true;
      console.log(`  ✓  Likes set to ${formatCount(val)}`);
    }

    if (options.views !== undefined) {
      const val = parseInt(options.views, 10);
      if (isNaN(val)) {
        console.error("❌  --views must be a number.");
        await mongoose.disconnect();
        process.exit(1);
      }
      thread.views = val;
      changed = true;
      console.log(`  ✓  Views set to ${formatCount(val)}`);
    }

    if (options.comments !== undefined) {
      const count = parseInt(options.comments, 10);
      if (isNaN(count) || count < 1) {
        console.error("❌  --comments must be a positive number.");
        await mongoose.disconnect();
        process.exit(1);
      }

      console.log(`  ⟳  Adding ${count} fake comment(s)...`);

      const fakeComments = [];
      const fakeTexts = [
        "This is so true! 🔥",
        "I completely agree with this.",
        "Great thread, thanks for sharing!",
        "Totally relatable content 😄",
        "This made my day,Keep it up!",
        "Interesting perspective, never thought of it that way.",
        "Everyone needs to see this.",
        "Facts no cap ✅",
        "Preach! 👏",
        "I've been saying this for years.",
        "Underrated comment right here.",
        "Wait, this is actually deep.",
        "LMAO same 😂",
        "We need more of this content.",
        "Saved this for later.",
      ];

      for (let i = 0; i < count; i++) {
        const comment = new Thread({
          text: fakeTexts[i % fakeTexts.length],
          author: thread.author, // same author for simplicity
          parentId: id,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // within last 7 days
        });
        await comment.save();
        fakeComments.push(comment._id);
        if ((i + 1) % 20 === 0) console.log(`    ... ${i + 1}/${count}`);
        await delay(10); // small delay to avoid overwhelming
      }

      thread.children.push(...fakeComments);
      await thread.save();

      console.log(`  ✓  ${count} comment(s) added.`);
      changed = true;
    }

    if (!changed) {
      console.log("  ℹ  No changes specified. Use --likes, --views, or --comments.");
    } else {
      await thread.save();
      console.log(`  ✓  Thread ${id} updated successfully.`);
    }

    await mongoose.disconnect();
  });

// ── Create thread ─────────────────────────────────────────────────────────────
program
  .command("create")
  .description("Create a new thread")
  .requiredOption("--text <text>", "Thread text content")
  .option("--author <authorId>", "Author user ID (required for full setup)", "60d5ec49f1b2c8a1f8e4d5b2")
  .action(async (options) => {
    await mongoose.connect(MONGODB_URL);

    const thread = new Thread({
      text: options.text,
      author: options.author,
      likes: 0,
      views: 0,
      createdAt: new Date(),
    });

    await thread.save();

    console.log(`\n  ✅  Thread created!`);
    console.log(`  ID:     ${thread._id}`);
    console.log(`  Text:   ${thread.text}`);
    console.log(`  Likes:  ${thread.likes}`);
    console.log(`  Views:  ${thread.views}`);
    console.log(`  ─────────────────────────────────────────\n`);
    console.log(`  To update it: node seed.js --thread ${thread._id} --likes 50000 --views 100000\n`);

    await mongoose.disconnect();
  });

// ── Reset ─────────────────────────────────────────────────────────────────────
program
  .command("reset")
  .description("Reset all threads (set likes/views to 0, remove all comments)")
  .action(async () => {
    await mongoose.connect(MONGODB_URL);

    const count = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
    console.log(`  ⟳  Found ${count} top-level threads. Resetting...`);

    // Remove all child comments
    await Thread.deleteMany({ parentId: { $ne: null } });

    // Reset likes/views on top-level threads
    await Thread.updateMany(
      { parentId: { $in: [null, undefined] } },
      { $set: { likes: 0, views: 0, children: [] } }
    );

    console.log(`  ✓  All threads reset.`);
    await mongoose.disconnect();
  });

// ─── Parse & Run ──────────────────────────────────────────────────────────────
program.parse(process.argv);
