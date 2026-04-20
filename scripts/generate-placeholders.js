const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '..', 'public', 'projects');

if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

const colors = [
  '#d4a574', '#78716c', '#a8a29e', '#e8c9a3', '#57534e',
  '#c4b5a0', '#9ca3af', '#6b7280', '#d1d5db', '#f3f4f6'
];

for (let i = 1; i <= 9; i++) {
  const color = colors[i - 1] || colors[0];
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">
    Project ${i}
  </text>
</svg>`;
  
  fs.writeFileSync(path.join(projectsDir, `project-${i}.svg`), svgContent);
}

console.log('✓ Generated 9 placeholder images');
