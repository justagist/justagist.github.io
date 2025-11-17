// function copyToClipboard(element) {
//   // var $temp = $("<input>");
//   const el = document.createElement('textarea');
//   document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
//   el.value = $(element).text();                   // Set its value to the string that you want copied
//   el.setAttribute('readonly', '');              
//   el.select();
//   // document.execCommand("copy");
//   document.execCommand("copy", false, $(element).text());
//   // $temp.remove();
//   document.body.removeChild(el);
//   alert($(element).text())
// }

// function fallbackCopyTextToClipboard(text) {
//   var textArea = document.createElement("textarea");
//   textArea.value = text;
  
//   // Avoid scrolling to bottom
//   textArea.style.top = "0";
//   textArea.style.left = "0";
//   textArea.style.position = "fixed";

//   document.body.appendChild(textArea);
//   textArea.focus();
//   textArea.select();
// // document.getElementById
//   try {
//     var successful = document.execCommand('copy');
//     var msg = successful ? 'successful' : 'unsuccessful';
//     console.log('Fallback: Copying text command was ' + msg);
//   } catch (err) {
//     console.error('Fallback: Oops, unable to copy', err);
//   }

//   document.body.removeChild(textArea);
//   // alert("Copied to clipboard!");

//   alert("Copied to clipboard!\n\n".concat(text));
// }
// function copyTextToClipboard(element) {
//   if (!navigator.clipboard) {
//     fallbackCopyTextToClipboard($(element).text());
//     return;
//   }
//   navigator.clipboard.writeText($(element).text()).then(function() {
//     console.log('Async: Copying to clipboard was successful!');
//   }, function(err) {
//     console.error('Async: Could not copy text: ', err);
//   });
//   alert("Copied to clipboard!\n\n".concat($(element).text()));
// }
function copyToClipboardFF(text) {
  window.prompt("Copy to clipboard: Ctrl C, Enter", text);
}

function copyToClipboard(val_string) {
  var success = true,
    range = document.createRange(),
    selection;
  var input = $(val_string);
  // For IE.
  if (window.clipboardData) {
    window.clipboardData.setData("Text", input.val());
  } else {
    // Create a temporary element off screen.
    var tmpElem = $("<div>");
    tmpElem.css({
      position: "absolute",
      left: "-1000px",
      top: "-1000px",
    });
    // Add the input value to the temp element.
    tmpElem.text(input.val());
    $("body").append(tmpElem);
    // Select temp element.
    range.selectNodeContents(tmpElem.get(0));
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    // Lets copy.
    try {
      success = document.execCommand("copy", false, null);
      alert("Copied to clipboard!\n\n".concat($(tmpElem).text()));
    } catch (e) {
      copyToClipboardFF(input.val());
    }
    if (success) {
      // alert("The text is on the clipboard, try to paste it!");
      // remove temp element.
      tmpElem.remove();
    }
  }
}

function skipIntroAnimation() {
  var ele = document.getElementsByClassName("skippable");
  for (var i = 0; i < ele.length; i++) {
    ele[i].style.animationDuration = "0s";
    ele[i].style.animationDelay = "0s";
  }
}