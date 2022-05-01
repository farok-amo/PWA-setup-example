function init(){
    const form = document.getElementById('xForm');
    form.onsubmit = onSubmit;
}

/**
 * called when the submit button is pressed
 * @param event the submission event
 */
function onSubmit(event) {
    // The .serializeArray() method creates a JavaScript array of objects
    // https://api.jquery.com/serializearray/
    const formArray= $("form").serializeArray();
    const data={};
    for (let index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    sendAjaxQuery('./post-story', data);
    // prevent the form from reloading the page (normal behaviour for forms)
    event.preventDefault()
}

function sendAjaxQuery(url, data) {
    axios.post(url , data)
        .then (function (data) {
            alert(JSON.stringify(data.data))
            window.location.href = '../'
        })
        .catch( function (response) {
            alert (JSON.stringify(response));
        })
}