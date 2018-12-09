
module.exports = function(db) {

function saveToFile()
{
  var text = document.getElementById("inputText").value;
  var textBlob = new Blob([text], {type:"text/plain"});
  var textUrl = window.URL.createObjectURL(textBlob);
  var fileName = document.getElementById("fileName").value;

  var link = document.createElement("a");
  link.download = fileName;
  link.innerHTML = "Download";
  link.href = textUrl;
  link.onclick = destroyElement;
  link.style.display = "none";
  document.body.appendChild(link);

  link.click();
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
/*
function tabooReplace()
{
  db.query("SELECT word FROM taboo_words;", (err,results,next) =>{
    if(err) throw err;
    var tabooWords = results;
    var text = document.getElementById(inputText).value;
    for(i =0; i<tabooWords.length;i++)
    {
      if(text==tabooWords[i])
      {
          var replaceWord = text.replace(new RegExp(tabooWords[i], "g"), "UNK");
          document.getElementById('inputText').value = replaceWord;
      }
    }
  });

}
}
*/
