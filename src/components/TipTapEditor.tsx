"use client";
import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";

type Props = {note: NoteType};

const TipTapEditor = ({note}: Props) => {
  const [editorState, setEditorState] = useState(note.editorState || "");
  const saveNote = useMutation({
    mutationFn: async () => {
        const response = await axios.post('/api/saveNote', {
            noteId: note.id,
            editorState
        })
        return response.data;
    }
  })

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const debounceEditorState = useDebounce(editorState, 300);

  useEffect(() => {
    if(debounceEditorState === '') return;
    saveNote.mutate(undefined, {
        onSuccess: data => {
            console.log('aggiornato con successo!', data)
        },
        onError: error => {
            console.error('Aggiornamento non riuscito! Riprovare', error)
        }
    })
  }, [debounceEditorState])

  return (
    <>
      <div className="flex">
        {editor && <TipTapMenuBar editor={editor}/>}
        <Button disabled variant='outline'>
            {saveNote.isPending? "Salvando.." : "Salvato"}
        </Button>
      </div>
      <div className="prose">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TipTapEditor;
