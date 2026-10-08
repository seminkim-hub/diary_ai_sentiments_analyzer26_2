import { z } from "zod";

const diarySchema = z.object({
  datetime: z.string().optional(),
  content: z.string().trim().min(1).max(1000),
});

const mutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), data: diarySchema }),
  z.object({ action: z.literal("update"), timestamp: z.string().min(1), data: diarySchema.partial() }),
  z.object({ action: z.literal("delete"), timestamp: z.string().min(1) }),
]);

function getScriptUrl() {
  const value = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (!value) throw new Error("NEXT_PUBLIC_GOOGLE_SCRIPT_URL 환경 변수가 설정되지 않았습니다.");
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "script.google.com") {
    throw new Error("구글 Apps Script 웹 앱 주소를 확인해 주세요.");
  }
  return url;
}

async function forwardToAppsScript(url: URL, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store", redirect: "follow" });
  const text = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Apps Script 응답을 읽을 수 없습니다. 웹 앱 배포 주소와 접근 권한을 확인해 주세요.");
  }
  if (!response.ok) throw new Error("Google 시트 요청에 실패했습니다.");
  return payload;
}

export async function GET(request: Request) {
  try {
    const url = getScriptUrl();
    const incoming = new URL(request.url);
    const action = incoming.searchParams.get("action") || "list";
    if (action !== "list" && action !== "get") {
      return Response.json({ error: "지원하지 않는 조회 작업입니다." }, { status: 400 });
    }
    url.searchParams.set("action", action);
    const timestamp = incoming.searchParams.get("timestamp");
    if (action === "get") {
      if (!timestamp) return Response.json({ error: "일기 식별 정보가 없습니다." }, { status: 400 });
      url.searchParams.set("timestamp", timestamp);
    }
    const result = await forwardToAppsScript(url);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "구글 시트 조회에 실패했습니다." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  try {
    const input = mutationSchema.parse(await request.json());
    const url = getScriptUrl();
    const result = await forwardToAppsScript(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 502;
    return Response.json({ error: error instanceof Error ? error.message : "구글 시트 저장에 실패했습니다." }, { status });
  }
}
