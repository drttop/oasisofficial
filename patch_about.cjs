const fs = require('fs');
let code = fs.readFileSync('src/components/sections/AboutSection.tsx', 'utf-8');

code = code.replace('className="grid grid-cols-1 sm:grid-cols-3 gap-4"', 'className="grid grid-cols-3 gap-2 sm:gap-4"');

// Fix paddings
code = code.replace(/className="p-7 sm:p-8 rounded-3xl /g, 'className="p-3 sm:p-8 rounded-2xl sm:rounded-3xl ');

// Fix icon container
code = code.replace(/className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl /g, 'className="w-10 h-10 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl ');

// Fix icons
code = code.replace(/className="w-8 h-8 sm:w-9 sm:h-9 /g, 'className="w-5 h-5 sm:w-9 sm:h-9 ');

// Fix Main texts
code = code.replace(/text-xl sm:text-2xl font-black/g, 'text-sm sm:text-2xl font-black');

// Fix Sub texts
code = code.replace(/text-xs sm:text-sm text-white font-bold block mt-1.5/g, 'text-[9px] sm:text-sm text-white font-bold block mt-1 sm:mt-1.5 tracking-tighter sm:tracking-normal');

// Fix badge container
code = code.replace(/className="mt-4 pt-3 border-t /g, 'className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t ');

// Fix badge text
code = code.replace(/className="text-\[11px\] text-emerald-400/g, 'className="text-[8px] sm:text-[11px] text-emerald-400 whitespace-nowrap tracking-tighter px-1.5 sm:px-3 ');

fs.writeFileSync('src/components/sections/AboutSection.tsx', code);
console.log('done');
