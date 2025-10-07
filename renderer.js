// Shared state for current file
const state = {
  folder: "",
  fileName: "",
  imgFiles: [],
};

function onTextClick() {
  const textarea = document.getElementById('text');
  const cursorPos = textarea.selectionStart;
  const lines = textarea.value.split(/\r?\n/);

  let charCount = 0;
  for (let i = 0; i < lines.length; i++) {
    charCount += lines[i].length + 1;
    if (cursorPos < charCount) {
      const picNum = lines[i]?.match(/\bpic\s+(\d+)/)?.[1];
      let imagePath = "";
      let imageName = "";

      for (let j = 0; j < state.imgFiles.length; j++) {
        const firstNum = state.imgFiles[j]?.substring(state.imgFiles[j]?.indexOf('(')+1,state.imgFiles[j]?.indexOf('-'));
        const lastNum = state.imgFiles[j]?.substring(state.imgFiles[j]?.indexOf('-')+1,state.imgFiles[j]?.indexOf(')'));
        if (+picNum >= +firstNum && +picNum <= +lastNum) {
          imagePath = state.imgFiles[j]?.substring(state.imgFiles[j]?.indexOf('s'),state.imgFiles[j]?.indexOf(" w"));
          imagePath = imagePath.replace(/\s+/g, '');
          imageName = imagePath.substring(imagePath?.indexOf("/")+1,imagePath?.length);
          break;
        }
      }

      if (!imagePath) return; // No matching image

      window.api.readJSON(`${state.folder}/_res_pngs/${imagePath}.json`).then(crop => {
        const imageKey =`${state.fileName}-${imageName}-${picNum}.png`;
        const frame = crop.frames[imageKey]?.frame;

        if (!frame) {
          console.log(`Frame "${imageKey}" not found in JSON.`);
          return;
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.getElementById('canvas');
            canvas.width = frame.w;
            canvas.height = frame.h +130;
            canvas.style.width = frame.w + "px";
            canvas.style.height = frame.h+130 + "px";
          console.log(frame.w, frame.h);
          
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img,
            frame.x, frame.y, frame.w, frame.h,
            0, 0, frame.w, frame.h
          );
            ctx.beginPath();
            ctx.ellipse(
            frame.w / 2,    // centerX
            frame.h + 50 ,    // centerY
            frame.w / 6,    // radiusX (adjust as needed)
            frame.h / 10,    // radiusY (adjust as needed)
            0,              // rotation
            0, 2 * Math.PI
        ); // 5 is the radius
            ctx.fillStyle = 'rgba(0, 0, 0, 0.77)';
            ctx.fill();
        };
        img.onerror = () => {
          console.log("Failed to load image.png from folder.");
        };
        img.src = `${state.folder}/_res_pngs/${imagePath}.png`;
      }).catch(err => {
        console.log("Failed to load crop.json: " + err.message);
      });

      break;
    }
  }
}

async function loadFile(textPath) {
  const path = textPath.substring(0, textPath.lastIndexOf('\\'));
  const path2 = path.substring(0, textPath.lastIndexOf('\\'));
  const folder = path2.substring(0, path.lastIndexOf('\\'));
  const fileName = textPath.substring(textPath.lastIndexOf('\\')+1, textPath.length-4);

  const textarea = document.getElementById('text');
  const extractedText = await window.api.readFile(textPath).then(text => {
    textarea.value = text;
    return text;
  }).catch(err => {
    console.log("Failed to load text file: " + err.message);
    return "";
  });

  const imgFiles = extractedText.split(/\r?\n/).slice(0, 16).filter(line=> line.includes("file"));

  // Update shared state
  state.folder = folder;
  state.fileName = fileName;
  state.imgFiles = imgFiles;
  
  
}

// Add the event listener only once
document.getElementById('text').addEventListener('click', onTextClick);

// Listen for menu-triggered file selection
window.api.onNewFile(loadFile);

// Optional: Load a file on startup
(async () => {
  if (window.api.openFile) {
    const initialPath = await window.api.openFile();
    if (initialPath) loadFile(initialPath);
  }
})();
