const config = require('./patternlab-config.json');
const pa11y = require('pa11y');
const path = require('path');

const testAccessibility = async () => {
  try {
    const results = await pa11y(`${path.resolve(config.paths.public.patterns + 'atoms/index.html')}`);

    console.log(results);
  } catch (error) {
    console.log(error);
  }
};

testAccessibility();
