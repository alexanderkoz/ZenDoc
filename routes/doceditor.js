function saveToFile()
{
  var text = document.getElementById("inputText").value;
  var textBlob = new Blob([text], {type:"text/plain"});
  var textUrl = window.URL.createObjectURL(textBlob);
  var fileName = document.getElementById("fileName").value;
  console.log(fileName);
  var link = document.createElement("a");
  link.download = fileName;
  link.innerHTML = "Download";
  link.href = textUrl;
  link.onclick = destroyElement;
  link.style.display = "none";
  document.body.appendChild(link);

  link.click();

  fetch('/savedoc', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, 
    body: JSON.stringify({file_name: fileName})})
    .then(response => {
      alert("File saved")
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

//Taboo words

function tabooReplace()
{
    var tabooWords = ['one', 'two', 'three', 'four'];
    //var tabooWords = results;
    var text = document.getElementById('inputText').value;
    for(i =0; i<tabooWords.length;i++)
    {
      if(text==tabooWords[i])
      {
          var replaceWord = text.replace(new RegExp(tabooWords[i], "g"), "UNK");
          document.getElementById('inputText').value = replaceWord;
      }
    }
}



