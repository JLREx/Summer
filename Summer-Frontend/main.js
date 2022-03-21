let source_text = document.getElementById("input-text");
let counter = document.getElementById("word-count");
source_text.addEventListener("keyup", function (event) {
  word_count();
});

// Checking word limits
function word_count() {
  let current_length = source_text.value.split(" ").length;
  if (current_length > 350) {
    current_length = 350;
    limited_text = source_text.value.split(" ", 350).join(" ");
    source_text.value = limited_text + " ";
  }
  counter.innerHTML = String(current_length) + "/350";
}

// Text-to-speech function
if ("speechSynthesis" in window) {
  let synth = window.speechSynthesis;
  let msg = new SpeechSynthesisUtterance();

  let input_text_to_speech = document.getElementById("text-to-speech-left");
  input_text_to_speech.addEventListener("click", function (e) {
    let speechMsgInput = document.getElementById("input-text");
    let text = speechMsgInput.value;

    if (synth.speaking == true) {
      synth.cancel();
    } else if (text.length > 0) {
      msg.text = text;
      msg.lang = "en-US";
      synth.speak(msg);
    }
  });

  let lang = document.getElementById("lang");
  let output_text_to_speech = document.getElementById("text-to-speech-right");
  output_text_to_speech.addEventListener("click", function (e) {
    let speechMsgInput = document.getElementById("output-text");
    let text = speechMsgInput.value;

    if (synth.speaking == true) {
      synth.cancel();
    } else if (text.length > 0) {
      msg.text = text;
      msg.lang = lang.value;
      synth.speak(msg);
    }
  });
} else {
  alert("error");
}

// Speech-to-text function
if ("webkitSpeechRecognition" in window) {
  let recognizer = new webkitSpeechRecognition();
  recognizer.continuous = true;
  recognizer.interimResults = true;
  let recognizing = false;

  recognizer.onstart = function () {
    recognizing = true;
  };

  recognizer.onend = function () {
    recognizing = false;
  };

  recognizer.onerror = function (event) {
    let ignore_onend;
    let start_timestamp;

    if (event.error == "no-speech") {
      alert(
        "No voice was detected. You may need to adjust your microphone settings. "
      );
      ignore_onend = true;
    }

    if (event.error == "audio-capture") {
      alert(
        "No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly. "
      );
      ignore_onend = true;
    }

    if (event.error == "not-allowed") {
      if (event.timeStamp - start_timestamp < 100) {
        alert(
          "Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream. "
        );
      } else {
        alert("Permission to use microphone was denied");
      }
      ignore_onend = true;
    }
  };

  recognizer.onresult = function (event) {
    let final_transcript = document.getElementById("input-text").value;
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    document.getElementById("input-text").value = final_transcript;
    word_count();
  };

  var two_line = /\n\n/g;
  var one_line = /\n/g;
  function linebreak(s) {
    return s.replace(two_line, "<p></p>").replace(one_line, "<br>");
  }

  var first_char = /\S/;
  function capitalize(s) {
    return s.replace(first_char, function (m) {
      return m.toUpperCase();
    });
  }

  let button = document.getElementById("mic");
  button.onclick = function () {
    if (recognizing) {
      recognizer.stop();
    } else {
      recognizer.start();
    }
  };
} else {
  alert("Sorry your browser does not support speech synthesis.");
}

// Language selector dropdown
$(document).ready(function () {
  $("#chi").click(function () {
    $("#lang").html("CHINESE");
    translate_text("zh");
    $("#lang").attr("value", "zh-CN");
  });

  $("#eng").click(function () {
    $("#lang").html("ENGLISH");
    translate_text("en");
    $("#lang").attr("value", "en-US");
  });

  $("#fre").click(function () {
    $("#lang").html("FRENCH");
    translate_text("fr");
    $("#lang").attr("value", "fr-FR");
  });

  $("#ger").click(function () {
    $("#lang").html("GERMAN");
    translate_text("de");
    $("#lang").attr("value", "de-DE");
  });

  $("#ita").click(function () {
    $("#lang").html("ITALIAN");
    translate_text("it");
    $("#lang").attr("value", "it-IT");
  });

  $("#mal").click(function () {
    $("#lang").html("MALAY");
    translate_text("ms");
    $("#lang").attr("value", "id-ID");
  });

  $("#spa").click(function () {
    $("#lang").html("SPANISH");
    translate_text("es");
    $("#lang").attr("value", "es-ES");
  });
});

//style border
var x = document.getElementById("list");

x.addEventListener("mouseover", border_mouseover);
x.addEventListener("mouseout", border_mouseout);

function border_mouseover() {
  document.getElementById("lang").style.borderBottom = "2px solid #65daff";
  document.getElementById("lang").style.borderEndEndRadius = "0px";
  document.getElementById("lang").style.borderEndStartRadius = "0px";
}

function border_mouseout() {
  document.getElementById("lang").style.borderBottom = "2px solid #65daff";
  document.getElementById("lang").style.borderEndEndRadius = "10px";
  document.getElementById("lang").style.borderEndStartRadius = "10px";
}

// Send translate request to server
function translate_text(target_language) {
  let source_text = document.getElementById("output-text").value;
  // Send AJAX POST request to the server with jQuery
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/translate",
    data: {
      text: source_text,
      target_language: target_language,
    },
    success: function (data) {
      document.getElementById("output-text").value = data;
    },
  });
}

// File upload by drag and drop
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  let formData = new FormData();
  var files = evt.dataTransfer.files[0]; // FileList object.
  formData.append("file", files);

  if (formData.get("file") != 'undefined') {
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8000/text_detection",
      data: formData,
      processData: false,  
      contentType: false,  
      success: function (data) {
        document.getElementById("input-text").value = data;
        word_count();
      },
    });
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy"; // Explicitly word-count this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById("input-text");
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("drop", handleFileSelect, false);

// Send summarise request to server
let summarise_button = document.getElementById("summarise");
summarise_button.addEventListener("click", function (event) {
  let source_text = document.getElementById("input-text").value;
  // Send AJAX POST request to the server with jQuery
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/summarize",
    data: { text: source_text },
    success: function (data) {
      document.getElementById("output-text").value = data;
      $("#lang").html("ENGLISH");
      $("#lang").attr("value", "en-US");
    },
  });
});
