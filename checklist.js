var eejs = require('md_mudoc-lite/node/eejs/');

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content = args.content + "<script src='../static/plugins/md_checklist/static/js/checklist.js'></script>";
  return cb();
}

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + "<link href='../static/plugins/md_checklist/static/css/fontello.css' rel='stylesheet'>";
  return cb();
}

