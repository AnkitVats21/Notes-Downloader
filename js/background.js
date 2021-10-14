document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (foundTabs) {
    if (foundTabs.length > 0) {
      var url = foundTabs[0].url
      if (url.includes('http://www.twowaits.in/')) {
        if (url.includes('/notes.php')) {
          let notesID = url.split('=')[1];
          getNotes(notesID);
        }
        else {
          document.getElementById('text').innerHTML = `Please head to notes page.`;
        }
      }
      else document.getElementById('text').innerHTML = "It only works for Twowaits."
    }
  },
  );
})

var data = null;

function getNotes(notesID) {

  const data = {
    uniq: notesID,
  };

  const request = fetch('http://www.twowaits.in/api/getNotesData.php', {
    method: 'POST',
    headers: {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "x-requested-with": "XMLHttpRequest",
      "cookie": "__gads=ID=fe38a837a7f37b8b-221b68484ec800cb:T=1622640149:RT=1622640149:S=ALNI_MY4XmBM9kupGO8yjFv_5YzLlfkGpw; user_id=41281"
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data.link, data.pages, data.cover);
      document.getElementById('text').innerHTML = data.title;
      document.getElementById('cover').src = data.cover;
      document.getElementById('db').addEventListener('click', () => { download(data.link, data.pages, data.cover, data.title) });

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
const zeroPad = (num, places) => String(num).padStart(places, '0')


function download(imgUrl, pages, cover, title) {
  
  
  var doc = new jsPDF("p", "mm", "a4");
  
  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();
  document.getElementById('text').innerHTML = pages + ' pages';

  for (var i = 1; i <= pages; i++) {
    const newUrl = imgUrl + '-' + zeroPad(i, 4) + '.jpg';
    var image = new Image();
    image.src = newUrl;
    doc.addImage(image, 'JPEG', 0, 0, width, height);
    doc.addPage();
  }
  doc.save(`${title}.pdf`);

  document.getElementById('message').innerHTML = "🙂 Please wait while we are preparing your file...";

}