 


@implementation Animal : CPObject
{
	int age; 
    CPString _name @accssors(property=name);
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
 
-(void) setAge:(int)z
{
		age = z;  
}

-(int) age{
	return age; 
}


@end
 
