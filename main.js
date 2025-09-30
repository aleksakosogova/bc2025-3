#!/usr/bin/env node
const fs = require('fs');
const { program } = require('commander');

// Визначаємо параметри, але не робимо їх обовʼязковими
program
  .option('-i, --input <file>', 'input JSON file')
  .option('-o, --output <file>', 'output file')
  .option('-d, --display', 'display result in console')
  .option('-c, --cylinders', 'show number of cylinders')
  .option('-m, --mpg <value>', 'show cars with mpg below value');

program.parse(process.argv);
const options = program.opts();

// Перевірка обовʼязкового параметра вручну
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Читання файлу
let data;
try {
  const raw = fs.readFileSync(options.input, 'utf8');
  data = raw.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
} catch (err) {
  console.error('Cannot find input file');
  process.exit(1);
}

// Фільтрація за mpg
if (options.mpg) {
  const mpgValue = parseFloat(options.mpg);
  data = data.filter(car => car.mpg < mpgValue);
}

// Підготовка результату для виводу
const outputLines = data.map(car => {
  let line = car.model;
  if (options.cylinders) line += ` ${car.cyl}`;
  if (options.mpg) line += ` ${car.mpg}`;
  return line;
}).join('\n');

// Вивід у консоль
if (options.display) console.log(outputLines);

// Запис у файл
if (options.output) {
  try {
    fs.writeFileSync(options.output, outputLines);
  } catch (err) {
    console.error('Error writing to file');
  }
}
