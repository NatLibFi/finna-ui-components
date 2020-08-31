const config = require('./patternlab-config.json');
const pa11y = require('pa11y');
const path = require('path');

const patterns = [
  `${path.resolve(config.paths.public.patterns + 'atoms/index.html')}`,
  `${path.resolve(config.paths.public.patterns + 'molecules/index.html')}`,
  `${path.resolve(config.paths.public.patterns + 'organisms/index.html')}`
]

const pa11yConfig = {
  runners: ['htmlcs', 'axe'],
  rootElement: '.pl-c-main',
  ignore: ['region']
};

const trackIssues = async () => {
  try {
    const promises = patterns.map(async (path) => await pa11y(path, pa11yConfig));

    const results = await Promise.all(promises);
    const resultIssues = results.filter((result) => result.issues.length);

    const issues = resultIssues.map((result) => result.issues);

    console.log(issues);
  } catch (error) {
    console.log(error);
  }
};

trackIssues();
