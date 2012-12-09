{var the_class = objj_allocateClassPair(CPObject,"Animal"),
meta_class = the_class.isa;class_addIvars(the_class, [new objj_ivar("age"),new objj_ivar("_name")]);objj_registerClassPair(the_class);
class_addMethods(the_class, [new objj_method(sel_getUid("initWithName:age:"), function(self, _cmd, aName, age)
{
self=_$$({ receiver:self, super_class:objj_getClass("Animal").super_class }, "init");
if(self){_$(self,"setAge:",self.age);
_$(self,"setName:",aName);
}return self;

})
, new objj_method(sel_getUid("setAge:"), function(self, _cmd, z)
{
self.age=z;

})
, new objj_method(sel_getUid("age"), function(self, _cmd)
{
return self.age;

})
]);class_addMethods(the_class, [new objj_method(sel_getUid("name"), function(self, _cmd)
{ return self._name}),
new objj_method(sel_getUid("setName:"), function(self, _cmd, __z__)
{ self._name=__z__;})
]);}

{var the_class = objj_allocateClassPair(Animal,"Cat"),
meta_class = the_class.isa;objj_registerClassPair(the_class);
class_addMethods(the_class, [new objj_method(sel_getUid("speak"), function(self, _cmd)
{
alert("Meow!");

})
]);}

{var the_class = objj_allocateClassPair(Animal,"Dog"),
meta_class = the_class.isa;objj_registerClassPair(the_class);
class_addMethods(the_class, [new objj_method(sel_getUid("initialize"), function(self, _cmd)
{
console.log("called dog initialize");

})
, new objj_method(sel_getUid("speak"), function(self, _cmd)
{
alert("WOOF!");

})
]);}

{var the_class = objj_getClass("Dog");
if(!the_class) throw new SyntaxError("*** Could not find definition for class \"CPArray\"");
var meta_class = the_class.isa; class_addMethods(the_class, [new objj_method(sel_getUid("giveMeFive:cry:"), function(self, _cmd, times, cry)
{
alert("High Five Dude, "+times+" times. "+cry+"!");

})
]);}

var carter=_$(_$(Dog, "alloc"),"initWithName:age:","Carter",4);
var kitty=_$(_$(Cat, "alloc"),"initWithName:age:","Kitty",10);
alert(_$(carter, "name")+" is "+_$(carter, "age")+" years old");
_$(carter,"performSelector:withObjects:","giveMeFive:cry:",5,"COWABUNGA");
alert(_$(kitty,"isKindOfClass:",_$(Cat, "class")));

