const video = document.querySelector("#srcvideo");
const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");
const filter = document.querySelector(".filter");
const snap = document.querySelector(".snap");
const gallery = document.querySelector(".gallery");
let currentFilter;

async function getVideo() {
  try {
    const localMediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = localMediaStream;
    video.play();
  } catch (error) {
    alert("Allow acces to your camera to start using the filters");
  }
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    let pixels = ctx.getImageData(0, 0, width, height);
    if (currentFilter) {
      if (currentFilter === dizzy) {
        ctx.globalAlpha = 0.1;
      } else {
        ctx.globalAlpha = 1;
      }
      pixels = currentFilter(pixels);
      ctx.putImageData(pixels, 0, 0);
    }
  }, 16);
}
getVideo();
video.addEventListener("canplay", () => {
  document.querySelector(".camera").style.display = "";
  paintToCanvas();
});

filter.addEventListener("change", (e) => {
  switch (e.target.value) {
    case "og":
      currentFilter = "";
      break;
    case "re":
      currentFilter = redEffect;
      break;
    case "bnw":
      currentFilter = blackAndWhite;
      break;
    case "dz":
      currentFilter = dizzy;
      break;
    case "rgb":
      currentFilter = rgbGlitch;
      break;
    case "mood":
      currentFilter = mood;
      break;
    default:
      break;
  }
});

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "image");
  link.innerHTML = `<img src=${data} alt="">`;
  gallery.insertBefore(link, gallery.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] - 100;
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
  }
  return pixels;
}

function blackAndWhite(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i + 1];
    pixels.data[i + 1] = pixels.data[i];
    pixels.data[i + 2] = pixels.data[i + 1];
  }
  return pixels;
}

function dizzy(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 50] = pixels.data[i];
    pixels.data[i + 70] = pixels.data[i + 1];
    pixels.data[i - 50] = pixels.data[i + 2];
  }
  return pixels;
}

function rgbGlitch(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 100] = pixels.data[i + 1];
    pixels.data[i + 50] = pixels.data[i + 1];
    pixels.data[i - 100] = pixels.data[i + 2];
  }
  return pixels;
}

function mood(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 50] = pixels.data[i];
    pixels.data[i + 50] = pixels.data[i + 1];
    pixels.data[i - 50] = pixels.data[i + 2];
  }
  return pixels;
}
