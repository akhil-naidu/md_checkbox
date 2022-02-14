var eejs = require('md_mudoc-lite/node/eejs/');

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  // args.content += eejs.require('md_checklist/static/js/checklist.js');
  args.content = args.content + '<script src="../static/plugins/md_checklist/static/js/checklist.js" type="text/css"></script>';
  return cb();
}

exports.eejsBlock_styles = function (hook_name, args, cb) {
  // args.content += eejs.require('md_checklist/static/css/fontello.css');
  args.content = args.content + '<link rel="stylesheet" href="../static/plugins/md_checklist/static/css/fontello.css" type="text/css" />';
  return cb();
}

