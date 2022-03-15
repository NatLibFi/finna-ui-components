// Copies assets from dependencies.

const fs = require('fs-extra');

// CSS
fs.copySync('node_modules/easymde/dist/easymde.min.css', 'source/css/vendor/easymde.min.css');

// JavaScript
fs.copySync('../NDL-VuFind2/themes/bootstrap3/js/truncate.js', 'source/js/styleguide/vendor/truncate.js');
fs.copySync('../NDL-VuFind2/themes/bootstrap3/js/vendor/bootstrap.min.js', 'source/js/styleguide/vendor/bootstrap.min.js');
fs.copySync('../NDL-VuFind2/themes/bootstrap3/js/vendor/jquery.min.js', 'source/js/styleguide/vendor/jquery.min.js');
fs.copySync('node_modules/easymde/dist/easymde.min.js', 'source/js/vendor/easymde.min.js');
fs.copySync('node_modules/jquery/dist/jquery.min.js', 'source/js/styleguide/vendor/jquery.min.js');
fs.copySync('node_modules/jquery-mockjax/dist/jquery.mockjax.min.js', 'source/js/styleguide/vendor/jquery.mockjax.min.js');

// Fonts
fs.copySync('../NDL-VuFind2/themes/bootstrap3/css/fonts', 'source/fonts/styleguide');
fs.copySync('../NDL-VuFind2/themes/finna2/css/fonts', 'source/fonts/styleguide');
