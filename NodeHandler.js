getChildNodeWithName = function(aNode, aName)
{
	var children = aNode.children;
	var len = children.length;
	for(var i = 0; i < len; i++)
	{
		if(children[i].name === aName)
			return children[i];
	}

	return null; 

};


module.exports.concatChildValues = function(aNode)
{
	var value = "", children = aNode.children; 
	 
	for(var i = 0; i < children.length; i++)
	{
	    if(typeof children[i] === "string")
		{
			value+=children[i];
		}
		else
		{
		 	value+=children[i].value; 
		} 
	}
	
	return value; 
};



module.exports.handleClassDeclaration = function(aNode, ivarInfo)
{

	var value = "", children = aNode.children; 


	if(getChildNodeWithName(aNode, "CategoryDeclaration")) //a category
	{
		value = "{var the_class = objj_getClass(\"" + children[2].value + "\");\n" 
			+ "if(!the_class) throw new SyntaxError(\"*** Could not find definition for class \\\"CPArray\\\"\");\n"
			+ "var meta_class = the_class.isa; ";

		var classBody = getChildNodeWithName(aNode, "ClassBody");

		value+=(classBody.value + "}\n\n"); 


	}
	else
	{
		var superClass = children[4].value;
		if(superClass === "")
			superClass = "Nil";

		value = "{var the_class = objj_allocateClassPair("
				+ superClass + ",\"" + children[2].value + "\"),\n" 
				+ "meta_class = the_class.isa;" ; 

		var ivarStart = false; 
		var len = children.length; 	
		for(var i = 0; i < len; i++)
		{

			if(children[i].name === "CompoundIvarDeclaration")
	    	{
	    		if(!ivarStart)
	    		{
	    			value+="class_addIvars(the_class, [";
	    			value+=(children[i].value);
	    			ivarStart = true; 
	    		}
	    		else
	    		{
	    			value+=("," + children[i].value);
	    		} 
	    	}
	    	else if(children[i].name === "ClassBody")
	    	{
	    		if(ivarStart)
	    			value+="]);";

	    		value+="objj_registerClassPair(the_class);\n" + children[i].value;
	    	}
	    	

		}

		if(ivarInfo) //add in accessors getters and setters 
		{
			var ivarLen = ivarInfo.length; 
			var startAddMethod = false; 
			for(var i =0; i < ivarLen; i++)
			{
				var iVar = ivarInfo[i];
				if(iVar.Accessors && typeof iVar.Accessors.property != "undefined")
				{
					var propertyName = iVar.Accessors.property;
					var capPropertyName = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
					if(!startAddMethod)
					{
						value+="class_addMethods(the_class, [";
						value+="new objj_method(sel_getUid(\"" + propertyName + "\"), function(self, _cmd)\n{ return self." + iVar.Identifier + "}),\n";
						value+="new objj_method(sel_getUid(\"set" + capPropertyName + ":\"), function(self, _cmd, z)\n{ self." + iVar.Identifier + "=z})\n";
						startAddMethod = true; 
					}
					else
					{

						value+=", new objj_method(sel_getUid(\"" + propertyName + "\"), function(self, _cmd)\n{ return self." + iVar.Identifier + "})\n,";
						value+="new objj_method(sel_getUid(\"set" + capPropertyName + ":\"), function(self, _cmd, z)\n{ self." + iVar.Identifier + "=z}\n)";

					}
					
				}
			}

			if(startAddMethod)
			{
				value+="]);"
			}	

		}

		value+="}\n\n";


	}
	 

	return value; 
};

module.exports.handleClassElements = function(aNode)
{
	var value = "", children = aNode.children; 
	var len = children.length; 

	var methodStart = false; 
	for(var i = 0; i < len; i++)
	{
		var classElement = children[i];

		if(classElement.children[0].name === "InstanceMethodDeclaration" ||
			classElement.children[0].name === "ClassMethodDeclaration")
    	{
    		 
    		if(!methodStart)
    		{
    			value+="class_addMethods(the_class, ["; 
    			value+=("new objj_method(" + classElement.children[0].value + ")\n"); 
    			methodStart = true; 	
			}		
			else{
				value+=(", new objj_method(" + classElement.children[0].value + ")\n");
			}
    		
    	}

	}

	value+="]);";


	return value; 
};

module.exports.handleCompoundIvarDeclaration = function(aNode)
{
	var value = "", children = aNode.children;

	value = "new objj_ivar(\"" + children[2].value.Identifier + "\")"

	return value; 
};

module.exports.handleIvarDeclaration = function(aNode)
{ 	
	var ivarName = getChildNodeWithName(aNode, "Identifier").value; 
	var accessor = getChildNodeWithName(aNode, "Accessors");
	if(accessor)
	{

		accessor = accessor.value; 

	}
	 
	return {"Identifier" : ivarName, "Accessors" : accessor};
}



module.exports.handleKeywordDeclarator = function(aNode)
{
	var children = aNode.children; 
	return {"selector" : children[0].value, "identifier" : getChildNodeWithName(aNode, "Identifier").value};

};


module.exports.handleKeywordSelectorCall = function(aNode)
{
	  var value = "", children = aNode.children; 
	  var sel ="",  args = [];
	
	  for(var i = 0; i < children.length; i++)
	  {
		 if(children[i].name === "KeywordCall")
		 {
			sel+=(children[i].children[0].value + ":");
			args.push(children[i].children[4].value);
		 }
	  }
	
	  value = "\"" + sel + "\",";
	  for(var i = 0; i < args.length; i++)
	  {
			if(i > 0)
				value+=",";
				
			value+=args[i];		
	  }
	
	  return value; 
};


module.exports.handleMessageExpression = function (aNode)
{
		var value = "", children = aNode.children; 
		var target = children[2];
		if(target.name === "SUPER")
		{
			value = "objj_msgSendSuper(";
		}
		else
		{
			value = "objj_msgSend(";
		}


		var selectorCall = getChildNodeWithName(aNode, "SelectorCall");
		if(getChildNodeWithName(selectorCall, "UnarySelector"))
		{
			value+=(target.value + ", \"" + selectorCall.value + "\")") ; 
		} 
		else
		{
			value+=(target.value + "," + selectorCall.value + ")");
		}
		
		return value; 
};

module.exports.handleMethodDeclaration = function(aNode)
{
	var value = "", children = aNode.children;

	var selector = getChildNodeWithName(aNode, "MethodSelector");

	if(typeof selector.value === "string") //uniary selector
	{
		value = "sel_getUid(\"" + selector.value + "\"), function(self, _cmd)"; 

	}
	else  //keyword selector
	{
		var nkeywords = selector.value.length;
		var sname = "";
		var fnset = "function(self, _cmd"; 
		for(var i = 0; i < nkeywords; i++)
		{
			var s = selector.value[i]; 
			sname+=(s.selector + ":");
 
			fnset+=(", " + s.identifier);


		}

		fnset+=")"

		value = "sel_getUid(\"" + sname + "\"), " + fnset; 
	}
 	
	var fbody = getChildNodeWithName(aNode, "FunctionBody");
	value+=("\n{\n" + fbody.value + "\n}");
 
	return value;
};


 
 
 