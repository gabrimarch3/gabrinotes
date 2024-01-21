import { generateImagePrompt } from "@/lib/openAi";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {userId} = auth();
    if(!userId) {
        return new NextResponse('Non sei autenticato!', {status: 401});
    }

    const body = await req.json();
    const {name} = body;
    const image_description = await generateImagePrompt(name);
    console.log({image_description});
    return new NextResponse('ok')
}