var tabooWords = [];
fetch("/taboowords")
.then(response => response.json())
.then(response => {
  tabooWords = response;
  applyTabooWords(tabooWords);
  //console.log(tabooWords);
})
.catch(err => {
	tabooWords = [];
})

function saveToFile()
{


  var text = document.getElementById("inputText").value;
//  var textBlob = new Blob([text], {type:"text/plain"});
//  var textUrl = window.URL.createObjectURL(textBlob);
  var fileName = document.getElementById("fileName").value;

	//var getValue = document.getElementById("statusMenu").selectedIndex;
	//var statusDoc = document.getElementsByTagName("option")[getValue].value;
  //console.log(statusDoc);
  //var link = document.createElement("a");
  //link.download = fileName;
  //link.innerHTML = "Download";
  //link.href = textUrl;
  //link.onclick = destroyElement;
  //link.style.display = "none";
  //document.body.appendChild(link);

//console.log(docAccessesStatus());







  //link.click();

  fetch('/savedoc', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({file_name: fileName, doc_status: checkDocStatus(), file_content: text})
	})
    .then(response => {
      alert("File successfully saved!")
    })
}

function destroyElement(e)
{
  document.body.removeChild(e.target);
}


function loadFromFile()
{
  var fileLoad = document.getElementById("fileLoad").files[0];
  var fileReader = new FileReader();

  fileReader.onload = (fileLoadEvent) => {
    var textLoadedFile = fileLoadEvent.target.result;
    document.getElementById("inputText").value = textLoadedFile;
  };

  fileReader.readAsText(fileLoad, "UTF-8");
}


function applyTabooWords(words) {
  var index = 0;
  //var words = ['apple', 'fat'];
  if (!words.length) {
    return
  }
  var regExpString = words.reduce(function (prev, current) {
      return `${prev}|${current.word}`;
  }, '/') + '|/';
  regExpString = new RegExp(regExpString, 'g');

  document.getElementById('inputText').addEventListener('keyup', function (event) {
    var value = this.value;
    if (event.keyCode === 8 && index > 0) {
      index--;
    }
    var valueToValidate = value.slice(index, value.length);
    var validatedValue = valueToValidate.replace(regExpString, 'UNK');
    if (valueToValidate === validatedValue) {
      return;
    }
    var result = value.substr(0, index) + validatedValue;
    index = result.length;
    this.value = result;
  })
}

function checkDocStatus() {


	var getValue = document.getElementById("statusMenu").selectedIndex;
	var statusDoc = document.getElementsByTagName("option")[getValue].value;
  console.log(statusDoc);

	return statusDoc;

}

function shareDoc(){

	var username = document.getElementById("username").value;

	fetch('/share_doc', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: username})
	})
	.then(response => {
		alert(`File is shared with${username}!`)
	})
	var r = document.getElementById('inputText');

	function startConverting(){
	  var r = document.getElementById('inputText');
	  if ('webkitSpeechRecognition' in window){
	    var speechRecognizer = new webkitSpeechRecognition();
	    speechRecognizer.continuous = true;
	    speechRecognizer.interimResults = true;
	    speechRecognizer.lang = 'en-US';
	    speechRecognizer.start();

	    var finalTranscripts = '';

	    speechRecognizer.onresult =  function(event){

	      var interimTranscripts = '';

	        for(var i = event.resultIndex; i < event.results.length; i++){
	          var transcript = event.results[i][0].transcript;
	          //transcript.replace("\n","<br>")
	          if(event.results[i].isFinal){
	            finalTranscripts += transcript;
	          }else{
	              interimTranscripts += transcript;

	          }
	        }
	        r.innerHTML = finalTranscripts + interimTranscripts ;
	    };
	    speechRecognizer.onerror = function(event){
	    };

	  } else{
	      r.innerHTML = 'test';
	  }

	}

}
