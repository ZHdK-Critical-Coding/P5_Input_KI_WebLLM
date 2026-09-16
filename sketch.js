let engine2, engine1
const defaultSentence = "DR: Wie denkst du über den Mars"

let padding, chatbox_width, right_offset, boxpadding;
let scroll_offset = 0
let temperature = 1
const stack = [{
  align: 0,
  content: defaultSentence
}]

async function chat(actor, lastSentence) {
  lastSentence = lastSentence || defaultSentence

    const messages = [
      { role: "system", content: actor === engine1
      ? `Stelle eine Frage passend zur Eingabe in reinem Deutsch. Stil: politisch bewusster linker Philosoph à la Douglas Rushkoff. 
        Sei scharfzüngig, kritisch, reflektiert, maximal 128 Zeichen, keine Zeilenumbrüche, keine Leerzeilen.`
      : `Antwort nur in reinem Deutsch . Stil: rechter CEO à la Elon Musk. 
        Sei provokant, unter 512 Zeichen, keine Zeilenumbrüche, keine Leerzeilen. 
        Beantworte die Frage.` },
      { role: "user", content: lastSentence }
    ];

    const chunks = await actor.chat.completions.create({
      messages,
      stream: true,
      temperature: 0.5,
      stream_options: { include_usage: true },
    });


  let localAnswer = ""
  const currentStack  = {
    align: actor === engine1 ? 0 : 1,
    content: actor === engine1 ? "DR: " : "EM: "
  }
  stack.push(currentStack)
  for await (const chunk of chunks) {
    currentStack.content += chunk.choices[0]?.delta.content || ""
    localAnswer += chunk.choices[0]?.delta.content || ""
    console.log(localAnswer);
    if (chunk.usage) {
        console.log(chunk.usage); // only last chunk has usage
    }
  }
  //const fullReply = await engine.getMessage();
  //console.log(fullReply);

  chat(actor === engine1 ? engine2 : engine1, localAnswer)
}

 function textHeight(text, maxWidth) {
     var words = text.split(' ');
     var line = '';
     var h = textLeading() - textDescent();
     for (var i = 0; i < words.length; i++) {
         var testLine = line + words[i] + ' ';
         var testWidth = textWidth(testLine);
         if (testWidth > maxWidth && i > 0) {
             line = words[i] + ' ';
             h += textLeading();
         } else {
             line = testLine;
         }
     }
     return h;
 }


async function setup() {
  const selectedModel = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
  try {
    engine1 = await window.webllm.CreateMLCEngine(selectedModel);
    engine2 = await window.webllm.CreateMLCEngine(selectedModel);
  } catch (e) {
    alert(e)
  }

  console.log(engine1, engine2)



  createCanvas(windowWidth, windowHeight);
  padding = 20
  chatbox_width = width / 2 - (padding * 1.5)
  right_offset = chatbox_width + padding
  boxpadding = padding / 4
  background(0);
  fill(255);
  textSize(16);
  textWrap(WORD)
}

function draw() {
  background(0);
  translate(0, -scroll_offset)
  let vertical_offset = 0;
  stack.forEach((block) => {
    const boxheight =  textHeight(block.content, chatbox_width)
    push()
      noFill()
      stroke(255)
      rect(padding + (block.align * right_offset) - boxpadding, padding + vertical_offset - boxpadding, chatbox_width + (2*boxpadding), boxheight + (2*boxpadding), boxpadding)
    pop()
    text(block.content, padding + (block.align * right_offset), padding + vertical_offset, chatbox_width);
    vertical_offset += boxheight + padding
  })

  if (vertical_offset + padding > height + scroll_offset) {
    scroll_offset = vertical_offset + padding - height
  }
}

function mouseClicked() {
  chat(engine2);
}