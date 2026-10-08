import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const moodSchema = z.object({
  emotion: z.enum(["happy", "calm", "excited", "tired", "anxious"]),
  title: z.string(),
  summary: z.string(),
  scores: z.array(z.object({ emotion: z.string(), score: z.number().min(0).max(100) })).length(3),
  letter: z.string(),
  question: z.string(),
});

export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json({ error: "Gemini API 키가 설정되지 않았어요. GOOGLE_GENERATIVE_AI_API_KEY를 환경 변수에 등록해 주세요." }, { status: 503 });
  }

  try {
    const body: unknown = await request.json();
    const diary = z.object({ diary: z.string().trim().min(1).max(1000) }).parse(body).diary;
    const { output } = await generateText({
      model: google("gemini-3.1-flash-lite"),
      output: Output.object({ schema: moodSchema }),
      system: "당신은 판단하거나 진단하지 않고 다정하게 공감하는 한국어 감성 일기 도우미입니다. 일기에서 가장 두드러지는 감정 하나를 선택하세요. 감정은 happy(행복·뿌듯함), calm(평온·안정), excited(설렘·기대), tired(피로·지침), anxious(불안·고민) 중 하나입니다. scores는 일기에서 읽히는 감정 세 가지를 한국어로 작성하고 합계가 100이 되게 하세요. title은 짧은 마음의 주제, summary는 근거가 되는 내용을 짚는 따뜻한 요약, letter는 2~4문장의 공감 편지, question은 부담 없는 성찰 질문으로 작성하세요. 모든 값은 한국어로 작성하세요.",
      prompt: `다음 일기를 감성 분석해 주세요.\n\n${diary}`,
    });
    return Response.json(output);
  } catch (error) {
    console.error("일기 감성 분석 오류:", error);
    return Response.json({ error: "일기를 분석하지 못했어요. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
