var parser = require("./Parser.js");
var NodeHandler = require("./NodeHandler.js");


module.exports.compile = function(source)
{
	var current_Class = "";
	var insideFunctionBody = false; 

	var classIvars = {};

	var errorLine = 0; 
	var errorNode = null; 

	var tree = parser.parse(source);	
	tree.traverse({
		traversesTextNodes : false,
		enteredNode : function(aNode)
		{
			var name = aNode.name,
				children = aNode.children;

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
				case "IvarDeclaration" :
				{
					if(current_Class)
					{
						if(typeof classIvars[current_Class] === "undefined")
						{
							classIvars[current_Class] = [];
						}

						var ivarName = aNode.innerText();
						classIvars[current_Class].push(ivarName);
					}

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
					case "_":
					{
						value = ""; 
					}break;
					case "%_" :
					{
						 errorNode = aNode; 
					}break;
					case "%LineTerminator" :
					{ 
						 errorLine++; 
						 
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
					case "ClassElements" :
					{
						value = NodeHandler.handleClassElements(aNode);

					}break;
					case "ClassDeclarationStatement":
					{
						 value = NodeHandler.handleClassDeclaration(aNode);
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
					case "FUNCTION" :
					{
						value = "function ";
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
					case "InstanceMethodDeclaration" :
					{
						
						value = NodeHandler.handleMethodDeclaration(aNode);

					}break; 
					case "IvarDeclaration" :
					{
						 value = children[0].value; 
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
									if(ivarsInClass[i] === value)
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

	return tree.value; 

}
