var collectContentPre = function(hook, context){
  var cls = context.cls;
  var tname = context.tname;
  var state = context.state; 
  var lineAttributes = state.lineAttributes

  if(cls !== null) {
    var tagIndex = cls.indexOf("checkbox-not-done");
    if(tagIndex === 0){
      lineAttributes['checkbox-not-done'] = tags[tagIndex];
    }

    var tagIndex = cls.indexOf("checkbox-done");
    if(tagIndex !== -1){
      lineAttributes['checkbox-done'] = 'checkbox-done';
    }

    if(tname === "div" || tname === "p"){
      delete lineAttributes['checkbox-done'];
      delete lineAttributes['checkbox-not-done'];
    }
  }
};

var collectContentPost = function(hook, context){
  var cls = context.cls;
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes

  var tagIndex = cls.indexOf("checkbox-not-done");
  if(tagIndex >= 0){
    delete lineAttributes['checkbox-not-done'];
  }

  var tagIndex = cls.indexOf("checkbox-done");       
  if(tagIndex >= 0){
    delete lineAttributes['checkbox-done'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
