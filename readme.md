# P5.js: WebLLM

[Deutsch](README_DE.md)

Runs two instances of a small language model (`Llama-3.2-1B-Instruct`)
directly in the browser using [WebLLM](https://github.com/mlc-ai/web-llm).
The two models discuss with each other in German; the conversation is drawn
as a scrolling chat with left and right speech boxes. A starting point for
using a language model without any server.

## Installation

Requirements: a browser with WebGPU support (Chrome or Edge) and enough GPU
memory for two copies of the model. The model is downloaded on first start,
which can take a while.

Libraries (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (included, not
used), WebLLM 0.2.79 (`@mlc-ai/web-llm`, jsDelivr bundle `webllm.js`).

## How to Run

1. Open the folder in Visual Studio Code and start Live Server (click
   **Go Live** in the status bar).
2. Wait until both models are loaded (the progress is shown at the bottom
   of the page), then click on the canvas to start the conversation. Clicks
   before that, and further clicks, are ignored.

## Coding Help

- **`index.html`**: imports `libraries/webllm.js` as an ES module, stores it
  in `window.webllm` and only then loads `sketch.js`.
- **`setup()`**: creates the canvas and the layout values, then calls
  `loadModels()`.
- **`loadModels()`**: creates two engines with
  `webllm.CreateMLCEngine(selectedModel, { initProgressCallback })`; the
  callback writes the progress into `loadingText`, which `draw()` shows.
  When both are loaded, `modelsReady` is set to true. Change
  `selectedModel` to use another model from the WebLLM model list.
- **`chat(actor, lastSentence)`**: builds a `messages` array with a system
  prompt depending on the persona – `engine1` ("DR", left) asks short,
  critical questions, `engine2` ("EM", right) answers provocatively – and
  the last sentence as user message. It calls
  `actor.chat.completions.create()` (OpenAI-style API, `stream: true`,
  `temperature` from the global variable, default `0.5`), appends the streamed chunks to a new entry in `stack`
  and then calls itself with the other engine.
- **`mouseClicked()`**: starts the conversation once with `chat(engine2)`,
  using `defaultSentence` as first prompt – only when `modelsReady` is true
  and the conversation has not `started` yet.
- **`draw()`**: draws every entry of `stack` as a box (left or right by
  `align`) and scrolls down automatically. Until the conversation starts it
  shows `loadingText` at the bottom. `textHeight()` computes the box height
  for wrapped text.
