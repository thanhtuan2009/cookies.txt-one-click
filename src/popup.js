var content = "";
var downloadable = "";

chrome.tabs.getSelected(null, function(tab) {
  domain = getDomain(tab.url)  
  chrome.cookies.getAll({}, function(cookies) {
    for (var i in cookies) {
      cookie = cookies[i]; 
      if (cookie.domain.indexOf(domain) != -1) {     
      content += escapeForPre(cookie.domain);
      content += "\t";
      content += escapeForPre((!cookie.hostOnly).toString().toUpperCase());
      content += "\t";     
      content += escapeForPre(cookie.path); 
      content += "\t";     
      content += escapeForPre(cookie.secure.toString().toUpperCase());
      content += "\t";     
      content += escapeForPre(cookie.expirationDate ? Math.round(cookie.expirationDate) : "0");
      content += "\t";     
      content += escapeForPre(cookie.name);
      content += "\t";     
      content += escapeForPre(cookie.value);
      content += "\n";
      }
    }
    downloadable += "# HTTP Cookie File for domains related to " + escapeForPre(domain) + ".\n";
    downloadable += "# Downloaded with cookies.txt Chrome Extension (" + escapeForPre("https://chrome.google.com/webstore/detail/njabckikapfpffapmjgojcnbfjonfjfg") + ")\n";
    downloadable += "# Example:  wget -x --load-cookies cookies.txt " + escapeForPre(tab.url) + "\n"; 
    downloadable += "#\n"; 

    var uri = "data:application/octet-stream;base64,"+btoa(downloadable + content);

    chrome.downloads.download({
      "url": uri,
      "filename": domain + "-cookies.txt"
    })
  });
})

function escapeForPre(text) {
  return String(text).replace(/&/g, "&amp;")
                     .replace(/</g, "&lt;")
                     .replace(/>/g, "&gt;")
                     .replace(/"/g, "&quot;")
                     .replace(/'/g, "&#039;");
}

function getDomain(url) {
  server = url.match(/:\/\/(.[^/:#?]+)/)[1];
  parts = server.split(".");

  isip = !isNaN(parseInt(server.replace(".",""),10));

  if (parts.length <= 1 || isip)   {
    domain = server;
  }
  else   {
    //search second level domain suffixes
    var domains = new Array();
    domains[0] = parts[parts.length - 1];
    for(i = 1; i < parts.length; i++) {
      domains[i] = parts[parts.length-i-1] + "." + domains[i-1];
      if (!domainlist.hasOwnProperty(domains[i])) {
        domain = domains[i];
        break;
      }
    }

    if (typeof(domain) == "undefined") { 
      domain = server;
    }
  }
  
  return domain;
}