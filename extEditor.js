'usestrict';

const body = document.getElementById("tinymce");
const strongDeleteButton = document.getElementById("strongDelete");
const spanDeleteButton = document.getElementById("spanDelete");
const nbspDeleteButton = document.getElementById("nbspDeleteAll")
const nbspWDotDeleteButton = document.getElementById("nbspDeleteW/Dot")
const dirDeleteButton = document.getElementById("dirDelete");
const iDeleteButton = document.getElementById("iDelete");
const bDeleteButton = document.getElementById("bDelete");
const emDeleteButton = document.getElementById("emDelete");
const pInLiDeleteButton = document.getElementById("pInLiDelete");
const pInTdtDeleteButton = document.getElementById("pInTdDelete");
const styleDeleteButton = document.getElementById("styleDelete");
const allAttrDeleteButton = document.getElementById("allAttrDelete");
const almightyButton = document.getElementById("almightyButton");
const htmlViewElement = document.getElementById("sourceView");

let innerText = undefined;
let textToPaste = undefined;

try {
    tinymce.activeEditor.on("input NodeChange", paste);
}
catch{
    console.log("tinyMCE getElement error due initialization order. Try restart")
}

htmlViewElement.addEventListener("input", () => {
    try {
        tinymce.activeEditor.setContent(htmlViewElement.value);
    }
    catch{
        console.log("tinyMCE getElement error due initialization order. Try restart")
    }
})

document.addEventListener("keydown", (event) =>{
    if (event.ctrlKey && (event.key === "q" || event.key === "й")) {
        tinymce.activeEditor.focus();
    }

})

//Удаляет теги <tag ...> ... </tag ...>
function tagRemover(thingToRemove){
    innerText = tinyMCE.activeEditor.getContent();
    textToPaste = innerText;
    let index = textToPaste.indexOf("<" + thingToRemove);

    while(index > 0){
        textToPaste = textToPaste.replace(textToPaste.substring(index, textToPaste.indexOf(">", index) + 1) , "");
        index = textToPaste.indexOf("<" + thingToRemove);

    }
    index = textToPaste.indexOf("</" + thingToRemove);

    while(index > 0){
        textToPaste = textToPaste.replace(textToPaste.substring(index, textToPaste.indexOf(">", index) + 1) , "");
        index = textToPaste.indexOf("</" + thingToRemove);
    }

    tinyMCE.activeEditor.setContent(textToPaste);
    innerText = undefined;
    textToPaste = undefined;
    //index = undefined;
}

function tagRemoverMiddle(innerText, thingToRemove) {
    textToPaste = innerText;
    let index = textToPaste.indexOf("<" + thingToRemove);

    while (index > 0) {
        textToPaste = textToPaste.replace(textToPaste.substring(index, textToPaste.indexOf(">", index) + 1), "");
        index = textToPaste.indexOf("<" + thingToRemove);

    }
    index = textToPaste.indexOf("</" + thingToRemove);

    while (index > 0) {
        textToPaste = textToPaste.replace(textToPaste.substring(index, textToPaste.indexOf(">", index) + 1), "");
        index = textToPaste.indexOf("</" + thingToRemove);
    }
    return textToPaste;
}

//Удаляет все включения word
function wordRemover(thingToRemove, filler = ""){
    innerText = tinyMCE.activeEditor.getContent();
    textToPaste = innerText;
    textToPaste = textToPaste.replaceAll(thingToRemove, filler)
    tinyMCE.activeEditor.setContent(textToPaste);
    innerText = undefined;
    textToPaste = undefined;
}

//Удаляет все атрибуты типа attr="..."
function attributeRemover(thingToRemove){
    innerText = tinyMCE.activeEditor.getContent();
    textToPaste = innerText;
    let index = textToPaste.indexOf(thingToRemove);
    while(index > 0){
        textToPaste = textToPaste.replace(textToPaste.substring(index, textToPaste.indexOf('"', textToPaste.indexOf('"', index)) + 1) , "");
        index = textToPaste.indexOf(thingToRemove);
    }

    tinyMCE.activeEditor.setContent(textToPaste);
    innerText = undefined;
    textToPaste = undefined;
    //index = undefined;
}


//Удаляет тег внутри определённого тега
function tagWithinTagRemover(thingToRemove, outerTag){
    innerText = tinymce.activeEditor.getContent();
    textToPaste = innerText;

    let indexOuter = textToPaste.indexOf("<" + outerTag);
    let indexOuterClose = textToPaste.indexOf("</" + outerTag, indexOuter);

    while(indexOuter >= 0){
        textToPaste = textToPaste.replace(textToPaste.substring(indexOuter, indexOuterClose), tagRemoverMiddle(textToPaste.substring(indexOuter, indexOuterClose), thingToRemove));
        indexOuter = textToPaste.indexOf("<" + outerTag, indexOuter + 1);
        indexOuterClose = textToPaste.indexOf("</" + outerTag, indexOuter);
    }
    tinyMCE.activeEditor.setContent(textToPaste);
    innerText = undefined;
    textToPaste = undefined;
    //indexOuter = undefined;
    //indexOuterClose = undefined;
}

function findHref(textToAnalyze){
    let indexHrefSt = textToAnalyze.indexOf("href");
    let indexHrefEd = undefined;
    let textToAnalyzeWithHref = undefined;
    if (indexHrefSt > -1){
        indexHrefEd = textToAnalyze.indexOf('"', textToAnalyze.indexOf('"', indexHrefSt) + 1);
        textToAnalyzeWithHref = textToAnalyze.substring(indexHrefSt, indexHrefEd + 1)
        return " " + textToAnalyzeWithHref;
    }
    else {
        return ""
    }

}

//Просто удаляет всё внутри тега, начиная от пробела после наименования тега и до ">"
function allAttrRemover(){
    innerText = tinymce.activeEditor.getContent();
    textToPaste = innerText;
    let indexLeftBr = textToPaste.indexOf("<");
    let indexRightBr = textToPaste.indexOf(">");
    let index = textToPaste.indexOf(" ", indexLeftBr);
    let stringLenght = 0;
    let substring = undefined;
    let stringToSave = undefined;

    while(indexLeftBr >= 0){
        if (index > indexLeftBr && index < indexRightBr){
            substring = textToPaste.substring(index, indexRightBr)
            stringToSave = findHref(substring);
            stringLenght = [...substring].length - [...stringToSave].length;
            textToPaste = textToPaste.replace(substring, stringToSave);
            indexLeftBr = textToPaste.indexOf("<", indexLeftBr + 1);
            indexRightBr = textToPaste.indexOf(">", indexRightBr - stringLenght + 1);
            index = textToPaste.indexOf(" ", indexLeftBr);
        }
        else{
            indexLeftBr = textToPaste.indexOf("<", indexRightBr);
            indexRightBr = textToPaste.indexOf(">", indexLeftBr);
            index = textToPaste.indexOf(" ", indexLeftBr);
        }

    }

    tinyMCE.activeEditor.setContent(textToPaste);
    innerText = undefined;
    textToPaste = undefined;
    //index = undefined;
    //stringLenght = undefined;
    //substring = undefined;
}

function paste(){
    innerText = tinymce.activeEditor.getContent();
    htmlViewElement.value = innerText;
}

function allInOneFunction(){
    tagRemover("strong");
    tagRemover("span");
    wordRemover("&nbsp;");
    attributeRemover("dir");
    tagRemover("i");
    tagRemover("b");
    tagRemover("em");
    tagWithinTagRemover("p", "li");
    tagWithinTagRemover("p", "td");
    attributeRemover("style");
    allAttrRemover();
    wordRemover("<p></p>");
    wordRemover("<p>&nbsp;</p>");
    paste();
}

strongDeleteButton.onclick = () => {tagRemover("strong"); paste()};
spanDeleteButton.onclick = () => {tagRemover("span"); paste()};
nbspDeleteButton.onclick = () => {wordRemover("&nbsp;");
    wordRemover("<p></p>"); wordRemover("<p>&nbsp;</p>"); paste()};
nbspWDotDeleteButton.onclick = () => {wordRemover(".&nbsp;", ".");
    wordRemover("<p></p>"); wordRemover("<p>&nbsp;</p>"); paste()};
dirDeleteButton.onclick = () => {attributeRemover("dir"); paste()};
iDeleteButton.onclick = () => {tagRemover("i"); paste()};
bDeleteButton.onclick = () => {tagRemover("b"); paste()};
emDeleteButton.onclick = () => {tagRemover("em"); paste()};
pInLiDeleteButton.onclick = () => {tagWithinTagRemover("p", "li"); paste()};
pInTdtDeleteButton.onclick = () => {tagWithinTagRemover("p", "td"); paste()};
styleDeleteButton.onclick = () => {attributeRemover("style"); paste()};
allAttrDeleteButton.onclick = () => {allAttrRemover(); paste()};
almightyButton.onclick = () => {
    allInOneFunction()
}


//meta-part
const metaTagInputElement = document.getElementById("metaTagInputPanel");
let metaTagInputValue = undefined
let metaTagInputArray = undefined;


metaTagInputElement.addEventListener('input', metaTagCounter)

function metaTagCounter(){
    metaTagInputValue = metaTagInputElement.value;
    metaTagInputValue = metaTagInputValue.replace(/[^\sа-яёА-ЯЁa-zA-Z]/gui, '').replace(/ +/g, ' ').replace(/[\r\n]+/g, '');
    metaTagInputArray = metaTagInputValue.split(" ");
    console.log(metaTagInputArray)

}




