import 'undom/register';
global.document.createDocumentFragment = () => global.document.createElement('#fragment');
global.wait = ms => new Promise(resolve => setTimeout(resolve, ms));