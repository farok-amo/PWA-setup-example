// const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';

/**
 * it inits the widget by selecting the type from the field myType
 * and it displays the Google Graph widget
 * it also hides the form to get the type
 */
 function widgetInit(){
    let type= document.getElementById("myType").value;

    if (type) {
        let config = {
            'limit': 10,
            'languages': ['en'],
            'types': [type],
            'maxDescChars': 100,
            'selectHandler': selectItem,
        }
        KGSearchWidget(apiKey, document.getElementById("myInput"), config);
        document.getElementById('typeSet').innerHTML= 'of type: '+type;
        document.getElementById('widget').style.display='block';
        document.getElementById('typeForm').style.display= 'none';
    }
    else {
        alert('Set the type please');
        document.getElementById('widget').style.display='none';
        document.getElementById('resultPanel').style.display='none';
        document.getElementById('typeSet').innerHTML= '';
        document.getElementById('typeForm').style.display= 'block';
    }
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function selectItem(event){
    let row= event.row;
    let data = {room:roomNo,id:row.id,name:row.name,rc:row.rc,qc:row.qc,border_color:color};
    storeKnowledgeGraph(data).then(r => console.log("stored knowledge graph"));
    addKnowledgeGraph(data);
}

/**
 * function to add the knowledge graph generated
 * @param data
 */
function addKnowledgeGraph(data){
    document.getElementById('knowledge-graph-result').style.display = 'block';
    let knowledgeGraphDiv = document.getElementById('knowledge-graph-result');
    let result = document.createElement("div");
    result.innerHTML = '<div class=\'resultPanel\' id="resultPanel" style="border-color: '+data.border_color+'; border-style: solid;">\n' +
'                     <h3 id="resultName">'+data.name+'</h3>\n' +
'                    <h4 id="resultId">'+data.id+'</h4>\n' +
'                    <div id="resultDescription">'+data.rc+'</div>\n' +
'                    <div>\n' +
'                        <a id="resultUrl"  href="'+data.qc+'" target="_blank">\n' +
'                            Link to Webpage\n' +
'                        </a>\n' +
'                    </div>\n' +
'                </div>'
    knowledgeGraphDiv.appendChild(result);
}
