var modal;
var modalimg;
var modaltxt;

function initialize() {
  document.getElementById("lastupdatedtxt").innerHTML = new Date(lastupdated*1000).toLocaleString();;
  
  renderNoDupe();

  // Modal stuff
  modal = document.getElementById("mapModal");
  modalimg = document.getElementsByClassName("modalimg")[0];
  modaltxt = document.getElementsByClassName("modaltxt")[0];
  let closebtn = document.getElementsByClassName("close")[0];
  let dlbtn = document.getElementsByClassName("download")[0];

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  closebtn.onclick = function() {
    modal.style.display = "none";
  }

  dlbtn.onclick = function() {
    downloadModal();
  }
}

function renderNoDupe() {
  maps = [];
  for (let hash in hashes) {
    maps.push(hashes[hash][0].split("_")[1]);
  }
  renderMaps(maps);
}

function renderDupe() {
  maps = [];
  for (let i = 0; i < 32768; i++) {
    maps.push(i);
  }
  renderMaps(maps);
}

function renderMaps(maps) {
  imgblock = "";
  for (let i = 0; i < maps.length; i++) {
    imgblock += `<img src="https://mapartwall.rebane2001.com/mapimg/map_${maps[i]}.png?v=${lastupdated}" loading="lazy" class="mapartimg" width="128" height="128" title="ID: ${maps[i]}" alt="ID: ${maps[i]}" onclick="mapClick(${maps[i]})" onerror="reloadImage(this)" />`;
  }
  document.getElementById('maparts').innerHTML = imgblock;
}

function mapClick(id) {
  modalimg.src = "https://mapartwall.rebane2001.com/mapimg/map_" + id + ".png?v=" + lastupdated;
  modaltxt.innerText = "ID: " + id;
  modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
  initialize();
});

function download(url) {
  fetch(url)
    .then(resp => resp.blob())
    .then(blob => {
      const bloburl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = bloburl;
      a.download = url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(bloburl);
    })
    .catch(() => alert('Error downloading ' + fileName));
}

function downloadModal() {
  download(modalimg.src);
}

// CDN sometimes doesn't load images, this reloads them on error
function reloadImage(image) {
  console.log("Reloading image...");
  setTimeout(function(image){ image.src = image.src; }, 1000, image);
}

// Website main buttons
function showId(){
  let id = prompt("Please enter the map ID you wish to see", "0");
  if (id != null) {
    if (id >= 0 && id < 32768)
      mapClick(id);
    else
      alert("Invalid map ID");
  }
}

function showDupe(){
  if(!confirm(`Are you sure you wish to load ALL 32768 maps (you already see all ${document.getElementsByClassName("mapartimg").length} of them that aren't duplicates)?`)) return;
  let button = document.getElementById("button_dupe");
  button.parentNode.removeChild(button);
  renderDupe();
}