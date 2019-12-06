function debugCssOverlaps() {
  const aSheets = [];
  const bSheets = [];
  const aRegex = /.*a.css.*/;
  const bRegex = /.*b.css.*/;
  for (let sheetIndex in document.styleSheets) {
    const sheet = document.styleSheets[sheetIndex];
    if (!sheet.href) {
      continue;
    }
    if (sheet.href.match(aRegex)) {
      console.log('Categorizing ', sheet.href, 'as a');
      aSheets.push(sheet);
    } else if (sheet.href.match(bRegex)) {
      console.log('Categorizing ', sheet.href, 'as b');
      bSheets.push(sheet);
    } else {
      console.log('Ignoring ', sheet.href);
    }
  }

  // Based loosely on https://stackoverflow.com/a/22638396/1164871
  function matchingRules(sheets, node) {
    const results = [];
    for (let sheetIndex in sheets) {
      const sheet = sheets[sheetIndex];
      const rules = sheet.cssRules;
      for (let ruleIndex in rules) {
        const rule = rules[ruleIndex];
        console.log(rule);
        const selector = rule.selectorText;
        if (node.matches(selector)) {
          results.push({
            sheet: sheet.href,
            selector: selector,
          });
        }
      }
    }
    return results;
  }

  var collisions = {};

  document.querySelectorAll('*').forEach(function(node) {
    const aMatches = matchingRules(aSheets, node);
    const bMatches = matchingRules(bSheets, node);
    if (aMatches.length > 0 && bMatches.length > 0) {
      const collision = { aMatches, bMatches };
      const collisionKey = JSON.stringify(collision);
      collisions[collisionKey] = collision;
    }
  });

  for (let collisionKey in collisions) {
    const collision = collisions[collisionKey];
    console.warn('');
    console.warn('========================================');
    console.warn('  Colliding selectors!');
    console.warn('  A selectors:');
    for (let i in collision.aMatches) {
      const match = collision.aMatches[i]
      console.log('    ', match.selector, '(from ', match.sheet, ')');
    }
    console.warn('  B selectors:');
    for (let i in collision.bMatches) {
      const match = collision.bMatches[i]
      console.log('    ', match.selector, '(from ', match.sheet, ')');
    }
    console.warn('========================================');
    console.warn('');
  }
}
