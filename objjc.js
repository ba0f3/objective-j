#!/usr/bin/env node

var Compiler = require("./Compiler.js");
var FILE = require("fs");

var fileName = process.argv[2];
var source = FILE.readFileSync(fileName, "UTF-8");
 
var value = Compiler.compile(source);


if(value.error.node)
{
	console.log("error starting on line " + value.error.line);
}
else
	console.log(value.code);
