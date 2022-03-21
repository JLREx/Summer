let source_text = document.getElementById("source_text");
let counter = document.getElementById("word_count");
// Checking word limits
source_text.addEventListener("keyup", function(event) {
    let current_length = source_text.value.split(" ").length;
    if (current_length > 350) {
        limited_text = source_text.value.split(" ", 350).join(" ");
        source_text.value = limited_text + " ";
    } else {
        counter.innerHTML = String(current_length - 1) + "/350";
    }
});

let summarize_button = document.getElementById("summarize_button");
summarize_button.addEventListener("click", function(event) {
    let source_text = document.getElementById("source_text").value;
    // Send AJAX POST request to the server with jQuery
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/summarize",
        // headers: { "X-CSRFToken": csrftoken },
        data: { text: source_text },
        success: function(data) {
            document.getElementById("result_text").value = data;
        }
    });
});