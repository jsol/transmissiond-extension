// This extension enables you to right-click a link
// and send it to a Transmission Daemon. 
// Note that I have my server behind a firewall
// and thus no username/password protection.
// Other limitiations includes that it per default
// sends the torrent to the hostname "media".
// You can either alter the source to a better address
// or add "media" to your dns server / hosts file.


// Set address to the torrent server here:
// Note: Server address, ie http://media/ must
// be in the permissions array in the manifest.
// If you dont want to mess around with the hosts
// file you can use an IP address instead of "media".
var transmissionurl = "http://media:9091/transmission/rpc";


var transmissionid = ''; // leave empty

function doRequest(torrent, retry) {
  var post = JSON.stringify( {'method': "torrent-add", "arguments": {"filename": torrent,  "paused" : false}} );
  var xhr = new XMLHttpRequest();
  xhr.open("POST", transmissionurl , true);
  xhr.setRequestHeader("X-Transmission-Session-Id", transmissionid);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      transmissionid = xhr.getResponseHeader('X-Transmission-Session-Id');
      if (xhr.status == 409 && !retry) {
        // TransmissionDaemon wants us to retry with the ID it put in the header.
        doRequest(torrent, true);
      }

    }
  }
  xhr.send(post);
}

function genericOnClick(info) {
  doRequest(info.linkUrl);
}

var context = "link";
var title = "Send to Transmission";
var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                     "onclick": genericOnClick});

