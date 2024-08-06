'use strict';

chrome.action.onClicked.addListener(() =>
    chrome.tabs.create({url: "extPage.html"}));

console.log('hello?')