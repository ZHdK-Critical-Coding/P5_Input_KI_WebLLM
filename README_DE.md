# P5.js: WebLLM

[English](readme.md)

Führt zwei Instanzen eines kleinen Sprachmodells (`Llama-3.2-1B-Instruct`)
direkt im Browser mit [WebLLM](https://github.com/mlc-ai/web-llm) aus. Die
beiden Modelle diskutieren auf Deutsch miteinander; die Unterhaltung wird
als scrollender Chat mit Sprechboxen links und rechts gezeichnet. Ein
Ausgangspunkt, um ein Sprachmodell ganz ohne Server zu verwenden.

## Installation

Voraussetzungen: ein Browser mit WebGPU-Unterstützung (Chrome oder Edge)
und genug GPU-Speicher für zwei Kopien des Modells. Das Modell wird beim
ersten Start heruntergeladen, das kann eine Weile dauern.

1. Den Ordner in Visual Studio Code öffnen und Live Server starten (in der
   Statusleiste auf **Go Live** klicken).
2. Warten, bis beide Modelle geladen sind (siehe Konsole – die Seite zeigt
   keinen Fortschritt an), dann auf die Zeichenfläche klicken, um die
   Unterhaltung zu starten. Nur einmal klicken: Jeder Klick startet eine
   weitere Gesprächsschleife.

Bibliotheken (in `libraries/`): p5.js 1.10.0, p5.sound 1.0.1 (eingebunden,
nicht verwendet), WebLLM 0.2.79 (`@mlc-ai/web-llm`, jsDelivr-Bundle
`webllm.js`).

## Coding-Hilfe

- **`index.html`**: importiert `libraries/webllm.js` als ES-Modul, legt es
  in `window.webllm` ab und lädt erst dann `sketch.js`.
- **`setup()`**: erstellt zwei Engines mit
  `webllm.CreateMLCEngine(selectedModel)`, danach die Zeichenfläche und die
  Layout-Werte. `selectedModel` ändern, um ein anderes Modell aus der
  WebLLM-Modellliste zu verwenden.
- **`chat(actor, lastSentence)`**: baut ein `messages`-Array mit einem
  System-Prompt je nach Persona – `engine1` ("DR", links) stellt kurze,
  kritische Fragen, `engine2` ("EM", rechts) antwortet provokant – und dem
  letzten Satz als User-Nachricht. Ruft `actor.chat.completions.create()`
  auf (API im OpenAI-Stil, `stream: true`, `temperature: 0.5`), hängt die
  gestreamten Teile an einen neuen Eintrag in `stack` an und ruft sich dann
  mit der anderen Engine selbst auf.
- **`mouseClicked()`**: startet die Unterhaltung mit `chat(engine2)`, mit
  `defaultSentence` als erstem Prompt.
- **`draw()`**: zeichnet jeden Eintrag von `stack` als Box (links oder
  rechts je nach `align`) und scrollt automatisch nach unten.
  `textHeight()` berechnet die Boxhöhe für umbrochenen Text.
