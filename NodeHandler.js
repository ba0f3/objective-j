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


module.exports.handleMessageExpression = function (aNode)
{
		var value = "", children = aNode.children; 
		var target = children[2];
		if(target.name === "SUPER")
		{
			value = "objj_msgSendSuper(" + target.value + "," 
					+ children[4].value + ")";
		}
		else
		{
			value = "objj_msgSend(" + target.value + "," 
					+  children[4].value + ")" ;
		}
		
		return value; 
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

 
 
 