const { Command } = require('commander');
const fs = require('fs');

const program = new Command();

// Налаштування програми
program
  .name('car-data-processor')
  .description('CLI program for processing car data from mtcars.json')
  .version('1.0.0');

// Загальні параметри
program
  .option('-i, --input <path>', 'path to input JSON file')
  .option('-o, --output <path>', 'path to output file')
  .option('-d, --display', 'display results in console');

// Додаткові параметри для варіанту 5
program
  .option('-c, --cylinders', 'display number of cylinders')
  .option('-m, --mpg <value>', 'display only cars with fuel economy below specified value', parseFloat);

program.parse();

const options = program.opts();

// Перевірка обов'язкового параметра
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Перевірка існування файлу
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

try {
  // Читання файлу
  const data = fs.readFileSync(options.input, 'utf8');
  
  // Парсинг JSON - кожен рядок окремий JSON об'єкт
  const lines = data.trim().split('\n');
  let cars = lines.map(line => JSON.parse(line));

  // Фільтрація за паливною економністю якщо задано параметр --mpg
  if (options.mpg !== undefined) {
    cars = cars.filter(car => car.mpg < options.mpg);
  }

  // Формування результату
  let results = cars.map(car => {
    let result = car.model;
    
    // Додавання кількості циліндрів якщо задано параметр --cylinders
    if (options.cylinders) {
      result += ' ' + car.cyl;
    }
    
    // Додавання паливної економності (ЗАВЖДИ виводиться)
    result += ' ' + car.mpg;
    
    return result;
  });

  const output = results.join('\n');

  // Виведення результатів
  let shouldOutput = false;

  // Запис у файл якщо задано параметр --output
  if (options.output) {
    fs.writeFileSync(options.output, output);
    shouldOutput = true;
  }

  // Виведення в консоль якщо задано параметр --display
  if (options.display) {
    console.log(output);
    shouldOutput = true;
  }

  // Якщо не задано жодного параметра виводу - не виводимо нічого
  if (!shouldOutput && !options.output && !options.display) {
    // Програма не виводить нічого
  }

} catch (error) {
  console.error('Error processing file:', error.message);
  process.exit(1);
}