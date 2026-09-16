# P5 -> WebLLM

A p5.js sketch that runs two instances of a small language model
(`Llama-3.2-1B-Instruct`) directly in the browser using
[WebLLM](https://github.com/mlc-ai/web-llm). The two models discuss with each
other; the conversation is rendered as chat bubbles.

## Requirements

- A browser with WebGPU support (Chrome / Edge).
- The model is downloaded on first start (this can take a while).

## How to Use

1. Start Live Server (click **Go Live** in the VS Code status bar).
2. Wait until the model is loaded, then click on the canvas to start the conversation.
