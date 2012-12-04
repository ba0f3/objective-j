var parser = require("./Objective-J.js");
var NodeHandler = require("./NodeHandler.js");
var FILE = require("fs");

var fileName = process.argv[2];
var source = FILE.readFileSync(fileName, "UTF-8");

global.current_Class = "Person";

global.errorLine = 0; 
global.errorNode = null; 

var tree = parser.parse(source);

tree.traverse({
	traversesTextNodes : false,
	exitedNode : function(aNode)
	{ 
	 		var value = "", name = aNode.name,
			children = aNode.children;
		
			switch(name)
			{
				case "_":
				{
					value = ""; 
				}break;
				case "%_" :
				{
					global.errorNode = aNode; 
				}break;
				case "%LineTerminator" :
				{ 
					global.errorLine++; 
					 
				}break;
				case "%start" :
				{
				 
					value = children[1].value;	
				}break;
				case "#document" :
				{
					value = children[0].value;
				}break; 
				case "AdditiveOperator" :
				{
					value = aNode.innerText();
				}break; 
				case "DecimalIntegerLiteral" : 
				{
					value = aNode.innerText(); 
				}break;
				case "EOS" : //end of statement
				{
					value = ";\n";
				}break; 
				case "IdentifierName" :
				{
					value = aNode.innerText(); 
				}break;
				case "KeywordSelectorCall" :
				{
					value = NodeHandler.handleKeywordSelectorCall(aNode);
				}break;
				case "MessageExpression" :
				{
					value = NodeHandler.handleMessageExpression(aNode);
				}break;
				case "start" : //start of code 
				{
					value = children[1].value;
				}break;
				case "SUPER" :
				{
					value =  "{ receiver:self, super_class:objj_getClass(\"" +  
					global.current_Class + "\").super_class }";

				}break;
				case "UnarySelector" :
				{
					value = "\"" + children[0].value + "\"";
				}break;
				case "VAR" :
				{
					value = "var ";
				}break; 
				case "WhiteSpace" :
				{
					value = " ";
				}break;
				default : 
				{	
					 value = NodeHandler.concatChildValues(aNode);

				}break;

			}
		 
			aNode.value = value;
		  
	} 
	
});


if(global.errorNode)
{
	console.log("Compile error on line " + (global.errorLine + 1) + ":");
	console.log(global.errorNode.source.substring(global.errorNode.range.location));
		
		
}
else
{
	console.log(tree.value);
}


 