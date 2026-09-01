// Source - https://stackoverflow.com/a/2497040
// Posted by Brian McKenna, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-31, License - CC BY-SA 4.0

const fs = require('fs');

fs.writeFile("test.txt", "Hey there!", function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});
