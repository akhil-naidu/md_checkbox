/*** 
*
* Most of the logic for task lists are done here
*
*/

if(typeof exports == 'undefined'){
  var exports = this['mymodule'] = {};
}

var underscore = require('md_mudoc-lite/static/js/underscore');
var padeditor = require('md_mudoc-lite/static/js/pad_editor').padeditor;
var tags = ['checkbox-not-done', 'checkbox-done'];
var padEditor;

exports.checkbox = {

  /***
  *
  *  Add button to the editbar and bind a listener
  *
  ***/

  init: function(context){ // Write the button to the dom
    var buttonHTML = '<li class="acl-write" id="checkbox"><a class="grouped-middle" data-l10n-id="pad.toolbar.checkbox.title" title="Task list Checkbox"><span class="icon-check"></span></a></li>';
    $(buttonHTML).insertBefore($('.buttonicon-indent').parent().parent());
    $('#checkbox').click(function(){ // apply attribtes when we click the editbar button

      context.ace.callWithAce(function(ace){ // call the function to apply the attribute inside ACE
        ace.ace_doInsertcheckbox();
      }, 'checkbox', true); // TODO what's the second attribute do here?
      padeditor.ace.focus();

    });
    context.ace.callWithAce(function(ace){
      var doc = ace.ace_getDocument();
      $(doc).find('#innerdocbody').on("click", underscore(exports.checkbox.doUpdatecheckbox).bind(ace));
    }, 'checkbox', true);
  },


  /***
  *
  *  Toggle if some text is or aren't a task list
  *
  ***/

  doInsertcheckbox: function(){
    var rep = this.rep;
    var documentAttributeManager = this.documentAttributeManager;
    if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position
    var firstLine = rep.selStart[0]; // Get the first line
    var lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0)); // Get the last line
    underscore(underscore.range(firstLine, lastLine + 1)).each(function(i){ // For each line, either turn on or off task list
      var ischeckbox = documentAttributeManager.getAttributeOnLine(i, 'checkbox-not-done');
      if(!ischeckbox){ // if its already a checkbox item
        documentAttributeManager.setAttributeOnLine(i, 'checkbox-not-done', 'checkbox-not-done'); // make the line a task list
      }else{
        documentAttributeManager.removeAttributeOnLine(i, 'checkbox-not-done'); // remove the task list from the line
      }
    });
  },


  /***
  *
  *  Toggle a task as done/not done -- called by ace_inner.js
  *
  ***/

  doTogglecheckboxItem: function(lineNumber){
    var rep = this.rep;
    var documentAttributeManager = this.documentAttributeManager;
    var isDone = documentAttributeManager.getAttributeOnLine(lineNumber, 'checkbox-done');
    if(isDone){
      documentAttributeManager.removeAttributeOnLine(lineNumber, 'checkbox-done'); // remove the task list from the line
      documentAttributeManager.setAttributeOnLine(lineNumber, 'checkbox-not-done', 'checkbox-not-done'); // make it undone
    }else{
      documentAttributeManager.removeAttributeOnLine(lineNumber, 'checkbox-not-done'); // remove the task list from the line
      documentAttributeManager.setAttributeOnLine(lineNumber, 'checkbox-done', 'checkbox-done'); // make it done
    }

  },


  /***
  *
  *  Is it a task list item and has the checkbox been clicked?
  *
  ***/

  doUpdatecheckbox: function(event){ // This is in the wrong context to access doc attr manager
    var ace = this;
    var target = event.target;
    var ischeckbox = ($(target).hasClass("checkbox-not-done") || $(target).hasClass("checkbox-done"));
    var parent = $(target).parent();
    var lineNumber = parent.prevAll().length;
    var targetRight = event.target.offsetLeft + 14; // The right hand side of the checkbox -- remember the checkbox can be indented
    var isCheckbox = (event.pageX < targetRight); // was the click to the left of the checkbox
    if(!ischeckbox || !isCheckbox){ return; } // Dont continue if we're not clicking a checkbox of a checkbox
    padEditor.callWithAce(function(ace){ // call the function to apply the attribute inside ACE
      ace.ace_doTogglecheckboxItem(lineNumber);
    }, 'checkbox', true); // TODO what's the second attribute do here?
  }
}


/***
 * 
 *  Once ace is initialized, we bind the functions to the context
 * 
 ***/

function aceInitialized(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertcheckbox = underscore(exports.checkbox.doInsertcheckbox).bind(context); // What does underscore do here?
  editorInfo.ace_doTogglecheckboxItem = underscore(exports.checkbox.doTogglecheckboxItem).bind(context); // TODO
  padEditor = context.editorInfo.editor;
}


/***
 * 
 *  Add the Javascript to Ace inner head, this is for the onClick listener
 * 
 ***/
var aceDomLineProcessLineAttributes = function(name, context){
  if( context.cls.indexOf("checkbox-not-done") !== -1) { var type="checkbox-not-done"; }
  if( context.cls.indexOf("checkbox-done") !== -1)     { var type="checkbox-done";}
  var tagIndex = context.cls.indexOf(type);
  if (tagIndex !== undefined && type){
    var tag = tags[tagIndex];
    var modifier = {
      preHtml: '<li class="'+type+'"">',
      postHtml: '</li>',
      processedMarker: true
    };
    return [modifier]; // return the modifier
  }
  return []; // or return nothing
};


/***
 *
 * Turn attributes into classes
 *
 ***/
exports.aceAttribsToClasses = function(hook, context){if(context.key == 'checkbox-not-done' || context.key == 'checkbox-done'){return [context.value];}}


/***
 * 
 *  Export all the hooks
 * 
 ***/
exports.aceInitialized = aceInitialized;
exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.aceEditorCSS = function(hook_name, cb){return ["/ep_checkbox/static/css/checkbox.css"];} // inner pad CSS
exports.postAceInit = function(hook, context){exports.checkbox.init(context);

}
