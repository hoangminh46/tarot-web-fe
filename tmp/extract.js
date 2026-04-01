const fs = require('fs');

const content = fs.readFileSync('tmp/form.js', 'utf8');

// Regex to extract objects
const extractObject = (name) => {
  const regex = new RegExp(`const ${name} = ([\\s\\S]*?);\\n`, 'm');
  const match = content.match(regex);
  return match ? match[1] : null;
};

const mainThemes = extractObject('MAIN_THEMES');
const subThemes = extractObject('SUB_THEMES');
const presetQ = extractObject('PRESET_Q');

let tsContent = `// Auto-generated from form.js\n\n`;

if (mainThemes) {
  tsContent += `export const MAIN_THEMES = ${mainThemes};\n\n`;
}

if (subThemes) {
  tsContent += `export const SUB_THEMES = ${subThemes};\n\n`;
}

if (presetQ) {
  tsContent += `export const PRESET_QUESTIONS = ${presetQ};\n\n`;
}

fs.writeFileSync('src/json/tarot_themes.ts', tsContent, 'utf8');
console.log('Successfully generated src/json/tarot_themes.ts');
