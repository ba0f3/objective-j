var Parser = require("./Parser.js");
var NodeHandler = require("./NodeHandler.js");

var IMPORTED_FILES = {};


module.exports.compile = function(source)
{
	var current_Class = "";
	var insideFunctionBody = false; 

	var classIvars = {};

	var errorLine = 0; 
	var errorNode = null; 

	var tree = Parser.parse(source);	
	
	tree.traverse({
		traversesTextNodes : false,
		enteredNode : function(aNode)
		{
			var name = aNode.name,
				children = aNode.children;

			//console.log(name);
			switch(name)
			{
				case "ClassDeclarationStatement" :
				{
					current_Class =  children[2].innerText();

				}break; 
				case "FunctionBody" :
				{
					insideFunctionBody = true;
				}break;
				 
			}
		},
		exitedNode : function(aNode)
		{ 
		 		var value = "", name = aNode.name,
				children = aNode.children;
				var len = children.length; 
			
				switch(name)
				{
					case "%start" :
					{
						value = children[1].value;	
					}break;
					case "#document" :
					{
						value = children[0].value;
					}break;
					case "_" :
					{
						value = aNode.innerText(); 
					}break;
					case "AccessorsConfiguration" :
					{
						value = children[0].value; 

					}break; 
					case "Accessors" :
					{ 	
						 
						value = children[2].value;

					}break; 
					case "AdditiveOperator" :
					{
						value = aNode.innerText();
					}break; 
					case "ClassElements" :
					{
						value = NodeHandler.handleClassElements(aNode);

					}break;
					case "ClassDeclarationStatement":
					{
						 var ivarInfo = classIvars[current_Class];
						 if(typeof ivarInfo === "undefined")
						 {
						 	ivarInfo = null; 
						 }

						 value = NodeHandler.handleClassDeclaration(aNode, ivarInfo);
						 current_Class = null; 

					}break; 
					case "ClassMethodDeclaration" :
					{
						value = NodeHandler.handleMethodDeclaration(aNode);
					}break;
					case "CompoundIvarDeclaration" :
					{
						value = NodeHandler.handleCompoundIvarDeclaration(aNode);


					}break; 
					case "DecimalIntegerLiteral" : 
					{
						value = aNode.innerText(); 
					}break;
					case "EOS" : //end of statement
					{
						value = ";\n";
					}break; 
					case "FunctionBody" :
					{
						value = NodeHandler.concatChildValues(aNode);
						insideFunctionBody = false; 

					}break;

					case "IdentifierName" :
					{
						value = aNode.innerText(); 

					}break;
					case "ImportStatement" :
					{
						IMPORTED_FILES[children[2].value] = null; 

					}break; 
					case "InstanceMethodDeclaration" :
					{
						
						value = NodeHandler.handleMethodDeclaration(aNode);

					}break; 
					case "IvarDeclaration" :
					{
						 value = NodeHandler.handleIvarDeclaration(aNode); 
						 if(current_Class)
						{
							if(typeof classIvars[current_Class] === "undefined")
							{
								classIvars[current_Class] = [];
							}

							
							classIvars[current_Class].push(value);
						}

					}break;
					case "IvarPropertyName" :
					{
						 
						value = {"property" : children[4].value};

					}break; 
					case "KeywordDeclarator" :
					{
						value = NodeHandler.handleKeywordDeclarator(aNode); 
						
					}break;
					case "KeywordSelector" :
					{	
						value = [];
						for(var i = 0; i < len; i++)
						{
							if(children[i].name === "KeywordDeclarator")
								value.push(children[i].value);
						}

					}break;
					case "KeywordSelectorCall" :
					{
						value = NodeHandler.handleKeywordSelectorCall(aNode);
					}break; 
					case "LocalFilePath" :
					{
						value = aNode.innerText().substring(1, aNode.innerText().length - 1);
					}break;
					case "MessageExpression" :
					{
						value = NodeHandler.handleMessageExpression(aNode);
					}break;
					case "MethodSelector" :
					{
						value = children[0].value; 
					}break;
					case "PrimaryExpression" :
					{
						value = children[0].value; 
						if(current_Class && insideFunctionBody)
						{
							var ivarsInClass = classIvars[current_Class];
							if(typeof ivarsInClass != "undefined")
							{
								var nIvars = ivarsInClass.length; 
								for(var i = 0; i < nIvars; i++)
								{
									if(ivarsInClass[i].Identifier === value)
									{
										value = "self." + value; 
										break; 
									}
								}
							} 
						}

					}break; 
					case "Selector" :
					{	
						 value = children[0].value; 

					}break; 
					case "SelectorLiteral" :
					{
						value = "\"" + children[4].value + "\""; 
					}break; 
					case "StandardFilePath" :
					{
						 value = "Frameworks/" + aNode.innerText().substring(1, aNode.innerText().length - 1);
						  

					}break; 
					case "start" : //start of code 
					{
						value = children[1].value;
					}break;
					case "StringLiteral" :
					{
						value = aNode.innerText()
						if(value.length > 0 && value[0] === "@")
						{
							value = value.substring(1, value.length);
						}

					}break;
					case "SUPER" :
					{
						value =  "{ receiver:self, super_class:objj_getClass(\"" +  
						 current_Class + "\").super_class }";

					}break;
					case "SuperclassDeclaration" :
					{
						value = children[2].value; 

					}break; 
					case "UnarySelector" :
					{
						value = children[0].value ;
					}break; 
					default : 
					{	
						 value = NodeHandler.concatChildValues(aNode);

					}break;

				}
			 
				aNode.value = value;
			  
		} 
		
	});

	return tree.value;  

}
