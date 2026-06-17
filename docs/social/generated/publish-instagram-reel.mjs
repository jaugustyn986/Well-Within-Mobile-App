#!/usr/bin/env node

/**
 * Publish an approved Reel through Composio without relying on Cursor MCP.
 *
 * Required:
 *   COMPOSIO_API_KEY   Valid Composio API key for the account that has Instagram connected.
 *
 * Optional:
 *   COMPOSIO_USER_ID   Composio user id that owns the Instagram connected account.
 *                      If omitted, the script tries to discover an Instagram connected account.
 *   IG_USER_ID         Instagram Business Account ID. Defaults to "me" for lookup, then uses
 *                      the ID returned by INSTAGRAM_GET_USER_INFO.
 *
 * Usage:
 *   cd docs/social/generated
 *   COMPOSIO_API_KEY=... COMPOSIO_USER_ID=... node publish-instagram-reel.mjs \
 *     notice-not-guess-reel/reel.mp4 \
 *     notice-not-guess-reel/caption.txt
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Composio } from "@composio/core";

const TOOLKIT_VERSION = "20260501_00";
const DEFAULT_REEL_PATH = "notice-not-guess-reel/reel.mp4";
const DEFAULT_CAPTION_PATH = "notice-not-guess-reel/caption.txt";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const [reelArg = DEFAULT_REEL_PATH, captionArg = DEFAULT_CAPTION_PATH] = process.argv.slice(2);
const reelPath = path.resolve(__dirname, reelArg);
const captionPath = path.resolve(__dirname, captionArg);

function fail(message) {
  console.error(`\nError: ${message}`);
  process.exit(1);
}

function parseToolData(result) {
  const raw = result?.data ?? result;
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function extractId(value) {
  const data = parseToolData(value);
  if (typeof data === "string") return data;
  return (
    data?.id ??
    data?.creation_id ??
    data?.creationId ??
    data?.media_id ??
    data?.mediaId ??
    data?.data?.id ??
    data?.data?.creation_id ??
    data?.data?.creationId ??
    data?.data?.media_id ??
    data?.data?.mediaId
  );
}

function safeResultSummary(result) {
  const data = parseToolData(result);
  if (typeof data === "string") return data.slice(0, 1000);
  return JSON.stringify(data, null, 2);
}

function validateInputs() {
  if (!process.env.COMPOSIO_API_KEY) {
    fail("COMPOSIO_API_KEY is required. Create/copy a current key from Composio and rerun.");
  }

  if (!fs.existsSync(reelPath)) fail(`Reel file not found: ${reelPath}`);
  if (!fs.existsSync(captionPath)) fail(`Caption file not found: ${captionPath}`);

  const caption = fs.readFileSync(captionPath, "utf8").trim();
  if (!caption) fail("Caption is empty.");
  if (caption.length > 2200) fail(`Caption is ${caption.length} characters; Instagram limit is 2200.`);

  const hashtagCount = (caption.match(/(^|\s)#[\p{L}\p{N}_]+/gu) ?? []).length;
  if (hashtagCount > 30) fail(`Caption has ${hashtagCount} hashtags; Instagram limit is 30.`);

  const stat = fs.statSync(reelPath);
  if (stat.size > 1024 * 1024 * 1024) fail("Reel is larger than 1 GB.");

  try {
    const json = execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height,duration,codec_name",
        "-show_entries",
        "format=duration",
        "-of",
        "json",
        reelPath,
      ],
      { encoding: "utf8" },
    );
    const probe = JSON.parse(json);
    const stream = probe.streams?.[0];
    const duration = Number(stream?.duration ?? probe.format?.duration ?? 0);
    if (!stream) fail("No video stream found in Reel.");
    if (duration < 3) fail(`Reel duration is ${duration}s; Instagram requires at least 3 seconds.`);
    console.log(
      `Asset: ${path.relative(__dirname, reelPath)} (${stream.width}x${stream.height}, ${duration.toFixed(
        2,
      )}s, ${Math.round(stat.size / 1024)} KB)`,
    );
  } catch (error) {
    fail(`ffprobe validation failed: ${error.message}`);
  }

  console.log(`Caption: ${caption.length} chars, ${hashtagCount} hashtags`);
  return caption;
}

async function discoverInstagramConnection(composio) {
  const explicitUserId = process.env.COMPOSIO_USER_ID;
  if (explicitUserId) return { userId: explicitUserId };

  const response = await composio.connectedAccounts.list({ toolkitSlugs: ["instagram"] });
  const items =
    response?.items ??
    response?.data?.items ??
    response?.data ??
    response?.connectedAccounts ??
    [];
  const accounts = Array.isArray(items) ? items : [];
  const account =
    accounts.find((item) => /active|connected|enabled/i.test(String(item.status ?? item.state ?? ""))) ??
    accounts[0];

  const userId = account?.userId ?? account?.user_id ?? account?.user?.id;
  const connectedAccountId = account?.id ?? account?.connectedAccountId ?? account?.connected_account_id;

  if (!userId) {
    fail(
      "Could not discover a Composio Instagram connected account. Set COMPOSIO_USER_ID to the user id that owns the Instagram connection.",
    );
  }

  return { userId, connectedAccountId };
}

async function execute(composio, slug, userId, args, connectedAccountId) {
  const body = {
    userId,
    arguments: args,
  };
  if (connectedAccountId) body.connectedAccountId = connectedAccountId;
  return composio.tools.execute(slug, body);
}

async function main() {
  const caption = validateInputs();
  const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY,
    toolkitVersions: { instagram: TOOLKIT_VERSION },
    dangerouslyAllowAutoUploadDownloadFiles: true,
    fileUploadDirs: [path.dirname(reelPath)],
  });

  const { userId, connectedAccountId } = await discoverInstagramConnection(composio);
  console.log(`Composio user: ${userId}${connectedAccountId ? ` (${connectedAccountId})` : ""}`);

  console.log("\nChecking Instagram account...");
  const userInfoResult = await execute(
    composio,
    "INSTAGRAM_GET_USER_INFO",
    userId,
    { ig_user_id: process.env.IG_USER_ID ?? "me" },
    connectedAccountId,
  );
  if (userInfoResult?.successful === false) fail(`INSTAGRAM_GET_USER_INFO failed: ${safeResultSummary(userInfoResult)}`);

  const userInfo = parseToolData(userInfoResult);
  console.log(safeResultSummary(userInfoResult));

  const igUserId =
    process.env.IG_USER_ID ??
    userInfo?.id ??
    userInfo?.data?.id ??
    userInfo?.instagram_business_account?.id ??
    "me";

  console.log("\nChecking publishing limit...");
  const quotaResult = await execute(
    composio,
    "INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT",
    userId,
    { ig_user_id: igUserId },
    connectedAccountId,
  );
  if (quotaResult?.successful === false) {
    fail(`INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT failed: ${safeResultSummary(quotaResult)}`);
  }
  console.log(safeResultSummary(quotaResult));

  console.log("\nCreating Reel container...");
  const createResult = await execute(
    composio,
    "INSTAGRAM_POST_IG_USER_MEDIA",
    userId,
    {
      ig_user_id: igUserId,
      caption,
      video_file: reelPath,
      media_type: "REELS",
      share_to_feed: true,
      audio_name: "Original Audio",
    },
    connectedAccountId,
  );
  if (createResult?.successful === false) fail(`INSTAGRAM_POST_IG_USER_MEDIA failed: ${safeResultSummary(createResult)}`);

  const creationId = extractId(createResult);
  if (!creationId) fail(`Could not find creation_id in create response:\n${safeResultSummary(createResult)}`);
  console.log(`Creation ID: ${creationId}`);

  console.log("\nPublishing Reel (this can take a couple minutes for video processing)...");
  const publishResult = await execute(
    composio,
    "INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH",
    userId,
    {
      ig_user_id: igUserId,
      creation_id: creationId,
      max_wait_seconds: 300,
      poll_interval_seconds: 5,
    },
    connectedAccountId,
  );
  if (publishResult?.successful === false) {
    fail(`INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH failed: ${safeResultSummary(publishResult)}`);
  }

  const mediaId = extractId(publishResult);
  if (!mediaId) fail(`Could not find media id in publish response:\n${safeResultSummary(publishResult)}`);
  console.log(`Media ID: ${mediaId}`);

  console.log("\nFetching published media...");
  const mediaResult = await execute(
    composio,
    "INSTAGRAM_GET_IG_MEDIA",
    userId,
    {
      ig_media_id: mediaId,
      fields: "id,caption,media_type,media_product_type,permalink,timestamp,username",
    },
    connectedAccountId,
  );
  if (mediaResult?.successful === false) fail(`INSTAGRAM_GET_IG_MEDIA failed: ${safeResultSummary(mediaResult)}`);

  console.log("\nPublished media:");
  console.log(safeResultSummary(mediaResult));
}

main().catch((error) => {
  const message = error?.message ?? String(error);
  if (/Invalid API key/i.test(message)) {
    fail(
      "Composio rejected COMPOSIO_API_KEY as invalid. Create/copy a current API key from Composio, export it, and rerun.",
    );
  }
  console.error(error);
  process.exit(1);
});
