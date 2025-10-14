// Shared state for current file
const state = {
  folder: "",
  fileName: "",
  imgFiles: [],
  defaultX:0,
  defaultY:0,
  resize:0,
  frameX:0,
  frameY:0,
  bp:{x:0,y:0,w:0,h:0},
  b:{x:0,y:0,w:0,h:0},
  w:{x:0,y:0,w:0,h:0},
  i:{x:0,y:0,w:0,h:0},
  o:{x:0,y:0,w:0,h:0},
  c:{x:0,y:0,w:0,h:0},


  filePath:""
  
};

// Add pan/zoom state
let zoom = 2;
let pan = { x: 0, y: 0 };
let isPanning = false;
let start = { x: 0, y: 0 };

// Utility to redraw the image with pan/zoom
function drawImageWithTransform(img, frame) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height - 20);
  ctx.translate(pan.x, pan.y);
  ctx.scale(zoom, zoom);

  



  const resize = state.resize>0?state.resize:1; 
  const spriteX =(state.frameX?state.frameX:state.defaultX);
  const spriteY =(state.frameY?state.frameY:state.defaultY);

  ctx.drawImage(
    img,
    frame.x, frame.y, frame.w, frame.h,
    0-spriteX, 0-spriteY, frame.w/resize, frame.h/resize
  );
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    0,    
    0 ,    
    17,    
    4,   
    0,             
    0, 2 * Math.PI
  );
  ctx.fillStyle = 'gba(239, 83, 80, 0.36)';
  ctx.fill();
  ctx.restore();

  ctx.save(); 
  ctx.fillStyle = "rgba(239, 83, 80, 0.36)"; 
  ctx.beginPath();
  ctx.rect(state.b.x-spriteX, state.b.y-spriteY, state.b.w, state.b.h); 
  ctx.fill();
  ctx.restore();


  ctx.save(); 
  ctx.fillStyle = "red"; 
  ctx.beginPath();
  ctx.rect(state.bp.x-spriteX, state.bp.y-spriteY, state.bp.w, state.bp.h); 
  ctx.fill();
  ctx.restore();

  ctx.save(); 
  ctx.fillStyle = "rgba(5, 17, 243, 0.41)"; 
  ctx.beginPath();
  ctx.rect(state.w.x-spriteX, state.w.y-spriteY,state.w.w, state.w.h); 
  ctx.fill();
  ctx.restore();

  ctx.save(); 
  ctx.fillStyle = "rgba(255, 162, 0, 0.23)"; 
  ctx.beginPath();
  ctx.rect(state.i.x-spriteX, state.i.y-spriteY, state.i.w, state.i.h); 
  ctx.fill();
  ctx.restore();

  ctx.save(); 
  ctx.fillStyle = "rgba(255, 170, 0, 0.38)"; 
  ctx.beginPath();
  ctx.rect(state.o.x-spriteX, state.o.y-spriteY, state.o.w, state.o.h); 
  ctx.fill();
  ctx.restore();

  ctx.save(); 
  ctx.fillStyle = "rgba(255, 0, 200, 0.49)"; 
  ctx.beginPath();
  ctx.rect(state.c.x-spriteX, state.c.y-spriteY, state.c.w, state.c.h); 
  ctx.fill();
  ctx.restore();

  /* console.log(state.i); */
  
  
}

// Store last image/frame for redraw
let lastImg = null;
let lastFrame = null;

// Update onTextClick to use drawImageWithTransform
function onTextClick() {
  const textarea = document.getElementById('text');
  const cursorPos = textarea.selectionStart;
  const lines = textarea.value.split(/\r?\n/);
  


  state.imgFiles = lines.slice(0, 16).filter(line=> line.includes("file"));
  const defaultXY = lines.slice(5, 50).filter(line=> line.includes("default")).map(q=>q.replaceAll(" ",""));
  lines.slice(5, 50).filter(line=> line.toLowerCase().includes("resize")).map(q=>state.resize= +q.match(/-?\d+(\.\d+)?/g)[0]);

   for (let i = 0; i < defaultXY.length; i++) {
    
    if (defaultXY[i].toLowerCase().includes("rx")) {
        state.defaultX = +defaultXY[i].match(/-?\d+(\.\d+)?/g);[0];
        
        
    }

    if (defaultXY[i].toLowerCase().includes("ry")) {
        state.defaultY = +defaultXY[i].match(/-?\d+(\.\d+)?/g);[0];
        

    }

  } 
  












  let charCount = 0;
  for (let i = 0; i < lines.length; i++) {
    charCount += lines[i].length + 1;
    if (cursorPos < charCount) {
      const picNum = lines[i]?.match(/\bpic\s+(\d+)/)?.[1];

      state.frameX = +lines[i]?.match(/\bcenterx\s+(\d+)/)?.[1] || null;
      state.frameY = +lines[i]?.match(/\bcentery\s+(\d+)/)?.[1] || null;


      
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



        state.b={x:0,y:0,w:0,h:0};
        state.bp={x:0,y:0,w:0,h:0};
        state.w={x:0,y:0,w:0,h:0};
        state.i={x:0,y:0,w:0,h:0};
        state.o={x:0,y:0,w:0,h:0};
        state.c={x:0,y:0,w:0,h:0};
if (picNum) {
    for (let k = i;k< lines.length;k++) {
      
        
        

        if(  lines[k].toLowerCase().includes("<b") && !lines[k].toLowerCase().includes("<bp") ) {
          const b = lines[k].replaceAll(" ","").match(/x(-?[\d.]+)y(-?[\d.]+)w(-?[\d.]+)h(-?[\d.]+)/);
          state.b.x= +b[1];
          state.b.y= +b[2];
          state.b.w= +b[3];
          state.b.h= +b[4];
          
          
          
          
        }
        
        if( lines[k].toLowerCase().includes("<bp")) {
          const bp = lines[k].replaceAll(" ","").match(/x(-?[\d.]+)y(-?[\d.]+)/);
          state.bp.x= +bp[1];
          state.bp.y= +bp[2];
          state.bp.w= 1;
          state.bp.h= 3;
          
          
          
        }

        if( lines[k].toLowerCase().includes("<w")) {
          const w = lines[k].replaceAll(" ","").match(/x(-?[\d.]+)y(-?[\d.]+)weaponact(-?[\d.]+)/);
          state.w.x= +w[1];
          state.w.y= +w[2];
          state.w.w= -3;
          state.w.h= -3;
          
          
          
        }
        
        if( lines[k].toLowerCase().includes("<i")) {
          const itr = lines[k].replaceAll(" ","").match(/x(-?[\d.]+)y(-?[\d.]+)w(-?[\d.]+)h(-?[\d.]+)/);
          state.i.x= +itr[1];
          state.i.y= +itr[2];
          state.i.w= +itr[3];
          state.i.h= +itr[4]; 
          
          

        }



        if( lines[k].toLowerCase().includes("<o")) {
          const o = lines[k].replaceAll(" ","").match(/x(-?[\d.]+)y(-?[\d.]+)/);
          state.o.x= +o[1];
          state.o.y= +o[2];
          state.o.w= -3;
          state.o.h= -3;
          
          
          
        }

        if( lines[k].toLowerCase().includes("<c")) {
          const c = lines[k].replaceAll(" ","").match(/x(-?[\d.]+)y(-?[\d.]+)/);
          state.c.x= +c[1];
          state.c.y= +c[2];
          state.c.w= -3;
          state.c.h= -3;
          
          
          
        }

        
        if(  lines[k].toLowerCase().includes("f>") ) break;
            
    
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
            canvas.height = frame.h + 130;
            canvas.style.width = frame.w + "px";
            canvas.style.height = frame.h + 130 + "px";
          lastImg = img;
          lastFrame = frame;
          drawImageWithTransform(img, frame);
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

  
 
  
  
  
  
  // Update shared state
  state.folder = folder;
  state.fileName = fileName;
  state.filePath = textPath; // Store the file path in state
  
  
}

// Add the event listener only once
document.getElementById('text').addEventListener('click', onTextClick);

// Listen for menu-triggered file selection
window.api.onNewFile(loadFile);
window.api.onMenuSave(() => saveCurrentFile());

// Optional: Load a file on startup
(async () => {
  if (window.api.openFile) {
    const initialPath = await window.api.openFile();
    if (initialPath) loadFile(initialPath);
  }
})();

// Pan handlers
const canvas = document.getElementById('canvas');
canvas.addEventListener('mousedown', (e) => {
  isPanning = true;
  start.x = e.offsetX - pan.x;
  start.y = e.offsetY - pan.y;
});
canvas.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  pan.x = e.offsetX - start.x;
  pan.y = e.offsetY - start.y;
  if (lastImg && lastFrame) drawImageWithTransform(lastImg, lastFrame);
});
canvas.addEventListener('mouseup', () => { isPanning = false; });
canvas.addEventListener('mouseleave', () => { isPanning = false; });

// Zoom handler
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const scaleAmount = 1.1;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;
  const prevZoom = zoom;
  if (e.deltaY < 0) {
    zoom *= scaleAmount;
  } else {
    zoom /= scaleAmount;
  }
  // Adjust pan so zoom is centered on mouse
  pan.x = mouseX - ((mouseX - pan.x) * (zoom / prevZoom));
  pan.y = mouseY - ((mouseY - pan.y) * (zoom / prevZoom));
  if (lastImg && lastFrame) drawImageWithTransform(lastImg, lastFrame);
}, { passive: false });


// ...existing code...

async function saveCurrentFile(asNew = false) {
  const textarea = document.getElementById('text');
  let filePath = state.filePath; // Store the original file path in state

  if (asNew || !filePath) {
    // Ask user for a new file path
    if (window.api.openFile) {
      filePath = await window.api.openFile();
      if (!filePath) return;
      state.filePath = filePath;
    }
  }

  await window.api.saveFile(filePath, textarea.value);
  alert('File saved!');
}

// Example: Add a button to your HTML and call saveCurrentFile() on click
// <button onclick="saveCurrentFile()">Save</button>
// <button onclick="saveCurrentFile(true)">Save As</button>

// ...existing code...