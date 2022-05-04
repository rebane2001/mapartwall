var modal;
var modalimg;
var modaltxt;
var data;

function initialize() {
  const dateStart = new Date(data.lastupdated[1]).toLocaleString("sv-SE", {"dateStyle": "short", "timeStyle": "short"});
  const dateEnd = new Date(data.lastupdated[1]).toLocaleString("sv-SE", {"timeStyle": "short"});
  const dateStr = `from ${dateStart} to ${dateEnd}`;
  document.getElementById("lastupdatedtxt").innerHTML = dateStr;

  if (!checkCookie()) return;

  renderNoDupe();

  // Modal stuff
  modal = document.querySelector("#mapModal");
  modalimg = document.querySelector(".modalimg");
  modaltxt = document.querySelector(".modaltxt");
  const closebtn = document.querySelector(".close");
  const dlbtn = document.querySelector(".download");

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      history.pushState(null, null, window.location.pathname);
    }
  }

  closebtn.onclick = function() {
    modal.style.display = "none";
    history.pushState(null, null, window.location.pathname);
  }

  dlbtn.onclick = function() {
    downloadModal();
  }

  if(window.location.hash)
    mapClick(parseInt(window.location.hash.substring(1), 10));
}

function renderNoDupe() {
  if (!checkCookie()) return;
  maps = [];
  for (const hash in data.hashes) {
    maps.push(data.hashes[hash][0].split("_")[1]);
  }
  renderMaps(maps);
}

function renderDupe() {
  if (!checkCookie()) return;
  maps = [];
  for (const i = 0; i < 32768; i++) {
    maps.push(i);
  }
  renderMaps(maps);
}

function renderMaps(maps) {
  imgblock = "";
  for (const i = 0; i < maps.length; i++) {
    imgblock += `<img src="https://mapartwall.rebane2001.com/mapimg/map_${maps[i]}.png?v=${lastupdated[1]}" loading="lazy" class="mapartimg" width="128" height="128" title="ID: ${maps[i]}" alt="ID: ${maps[i]}" onclick="mapClick(${maps[i]})" onerror="reloadImage(this)" />`;
  }
  document.getElementById('maparts').innerHTML = imgblock;
}

function mapClick(id) {
  modalimg.src = "https://mapartwall.rebane2001.com/mapimg/map_" + id + ".png?v=" + lastupdated[1];
  modaltxt.innerText = `ID: ${id} @ ${new Date(data.timestamps[id]).toLocaleString("sv-SE", {"timeStyle": "short"})}`;
  modal.style.display = "block";
  history.pushState(null, null, '#' + id);
}

fetch("https://mapartwall.rebane2001.com/hashes.js?" + Date.now()).then(r => r.json()).then(j => {
  data = j;
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
      a.download = url.split("/").pop().split("?")[0];
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(bloburl);
    })
    .catch(() => alert(`Error downloading ${fileName}`));
}

function downloadModal() {
  download(modalimg.src);
}

// CDN sometimes doesn't load images, this reloads them on error
function reloadImage(image) {
  console.log("Reloading image...");
  setTimeout((image) => { image.src = image.src; }, 1000, image);
}

// Website main buttons
function showId(){
  const map_id = prompt("Please enter the map ID you wish to see", "0");
  if (map_id != null) {
    if (map_id >= 0 && map_id < 32768) {
      mapClick(map_id);
    } else {
      alert("Invalid map ID");
    }
  }
}

function showDupe(){
  const accept = confirm(`Are you sure you wish to load ALL 32768 maps (you already see all ${document.getElementsByClassName("mapartimg").length} of them that aren't duplicates)?`);
  if(!accept) return;
  const button = document.getElementById("button_dupe");
  button.parentNode.removeChild(button);
  renderDupe();
}

// Content warning
function checkCookie() {
    if (getCookie("mapartwall_contentwarning") === "accepted") return true;

    const accept = confirm("All of the images on this site are unmoderated and copied over straight from the Minecraft server - this might include nsfw and otherwise uncomfortable or offensive content - do you wish to proceed?");
    if (accept) {
      setCookie("mapartwall_contentwarning", "accepted", 9000);
      return true;
    } else {
      document.documentElement.innerHTML = "Error: User did not accept content warning";
      return false;
    }
}

//Thx
//https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
