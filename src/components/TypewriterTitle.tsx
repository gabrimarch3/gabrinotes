"use client";

import React from "react";
import Typewriter from "typewriter-effect";
import GraphemeSplitter from 'grapheme-splitter';

type Props = {};

const TypeWriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter.typeString(`🚀Fai volare la tua produttività.`)
        .pauseFor(1000).deleteAll()
        .typeString("🤖Fatti guidare dall'IA.")
        .start();
      }}
    />
  );
};

export default TypeWriterTitle;
