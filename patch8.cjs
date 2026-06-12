const fs = require('fs');
let content = fs.readFileSync('./src/data/schedules.ts', 'utf8');

content = content.replace(
  "participants: ['5', '8', '16', '17', '15', '13', '6', '20', '4'], location: '성수연합차세대\"",
  "participants: ['5', '8', '16', '17', '15', '13', '6', '20', '4', '14'], location: '성수연합차세대\""
);

content = content.replace(
  "participants: ['17', '6', '20'], location: '드림튔즈\"",
  "participants: ['17', '6', '20', '7'], location: '드림튔즈\""
D);

content = content.replace(
  "participants: ['17', '16', '13'], location: '올스타\"",
  "participants: ['17', '16', '13', '14'], location: '올스타\""
);

fs.writeFileSync('./src/data/schedules.ts', content);
