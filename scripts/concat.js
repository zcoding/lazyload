var fs = require('fs');
var path = require('path');

var source = ['intro.js', 'lazy.js', 'api.js', 'outro.js'];

var join = '\n';

var readFiles = [];

source.forEach(function(file, index) {

  var absPath = path.resolve(__dirname, '../src/',  file);

  readFiles.push(new Promise(function(resolve, reject) {
    fs.readFile(absPath, 'utf8', function(error, buffer) {
      if (error) {
        reject(error);
      }
      resolve(buffer);
    });
  }));

});

Promise.all(readFiles)
  .then(function(buffers) {
    buffers = buffers.join(join);
    var dist = path.resolve(__dirname, '../build/lazy.js');
    return new Promise(function(resolve, reject) {
      fs.writeFile(dist, buffers, 'utf8', function(error) {
        if (error) {
          reject(error);
        }
        resolve('success');
      });
    });
  })
  .then(function(status) {
    console.log('> Concat task success.');
  })
  .catch(function(error) {
    console.error('> Concat task failed for ');
    console.error('> ' + error);
  });
