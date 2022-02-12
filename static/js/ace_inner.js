// This is a hack to get around ACEs brain-dead limit on onClick on
// links inside the ACE domlines...

$(document).ready(function () {
  $("body").mousedown(function (event) {
    parent.parent.exports.tasklist.doUpdateTaskList(1);
  });
});

