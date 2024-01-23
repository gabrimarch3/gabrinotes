import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";




export const runtime = "edge";

/**
 * POST /api/createNotebook
 *
 * Creates a new notebook.
 *
 * 1. Gets the authenticated user ID from the auth middleware.
 * 2. Gets the notebook name from the request body.
 * 3. Generates an image prompt for the cover image from the name.
 * 4. Generates a cover image URL from the prompt using OpenAI.
 * 5. Inserts a new notebook record into the database.
 * 6. Returns the inserted notebook ID.
 *
 * Returns 401 if unauthenticated.
 * Returns 500 on error generating image prompt or cover image.
 */
export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const body = await req.json();
  const { name } = body;
  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    return new NextResponse(
      "Impossibile generare una descrizione di immagine",
      { status: 500 }
    );
  }
  const image_url = await generateImage(image_description);
  if (!image_url) {
    return new NextResponse("Impossibile generare un immagine di copertina", {
      status: 500,
    });
  }

  const note_ids = await db
    .insert($notes)
    .values({
      name,
      userId,
      imageUrl: image_url,
    })
    .returning({
      insertedId: $notes.id,
    });

  return NextResponse.json({
    note_id: note_ids[0].insertedId,
  });
}