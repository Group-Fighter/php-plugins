# HOT Reload For Framework Codeigniter, Laravel etc

## Installation
- Run `npm install` to install from NPM.

## Configuration
```
Modify this config at bs-config.js
// modify proxy dev based on the php script to run it either using php spark serve or php artisan serve
proxy: "localhost:8080", 
// modify files for triggered reload, in this case example for codeigniter 4
files: [
    "public/assets/css/**/*.css",
    "public/assets/js/**/*.js",
    "public/**/*.html",
    "app/**/**/*.php",
    "app/**/*.php, app/*.php",
],
```

## Usage
- Run `npm run dev` to running 