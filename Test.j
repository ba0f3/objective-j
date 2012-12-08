@implementation Animal : CPObject
{
	int _age @accessors(property=age);
    CPString _name @accessors(property=name);

} 

-(id) initWithName:(CPString)aName age:(int)age
{
	self = [super init];
	if(self)
	{
		[self setAge:age];
		[self setName:aName];
	}

	return self; 
	 
}



@end



@implementation Cat : Animal
{


}

-(void) speak
{
	alert("Meow!");
}

@end


@implementation Dog : Animal
{ 
    

}
 
 +(void) initialize
 {
 	console.log("called dog initialize");
 }

-(void) speak
{
	alert("WOOF!");
}

@end

@implementation Dog (Tricks)

-(void) giveMeFive:(CPInteger)times cry:(CPString)cry
{
	alert("High Five Dude, " + times + " times. " + cry + "!");
}

@end
 
var carter = [[Dog alloc] initWithName:@"Carter" age:4];
var kitty = [[Cat alloc] initWithName:@"Kitty" age:10];


console.log([carter name] + " is " + [carter age] + " years old");

[carter performSelector:@selector(giveMeFive:cry:) withObjects:5, @"COWABUNGA"]; 
 

alert([kitty isKindOfClass:[Cat class]]);

