{var the_class = objj_allocateClassPair(Nil,"CPObject"),
meta_class = the_class.isa;class_addIvars(the_class, [new objj_ivar("isa")]);objj_registerClassPair(the_class);
class_addMethods(the_class, [new objj_method(sel_getUid("load"), function(self, _cmd)
{

})
, new objj_method(sel_getUid("initialize"), function(self, _cmd)
{

})
, new objj_method(sel_getUid("new"), function(self, _cmd)
{
return _$(_$(self, "alloc"), "init");

})
, new objj_method(sel_getUid("alloc"), function(self, _cmd)
{
return class_createInstance(self);

})
, new objj_method(sel_getUid("allocWithCoder:"), function(self, _cmd, aCoder)
{
return _$(self, "alloc");

})
, new objj_method(sel_getUid("init"), function(self, _cmd)
{
return self;

})
, new objj_method(sel_getUid("copy"), function(self, _cmd)
{
return self;

})
, new objj_method(sel_getUid("mutableCopy"), function(self, _cmd)
{
return _$(self, "copy");

})
, new objj_method(sel_getUid("class"), function(self, _cmd)
{
return self;

})
, new objj_method(sel_getUid("class"), function(self, _cmd)
{
return self.isa;

})
, new objj_method(sel_getUid("superclass"), function(self, _cmd)
{
return super_class;

})
, new objj_method(sel_getUid("isSubclassOfClass:"), function(self, _cmd, aClass)
{
var theClass=self.isa;
for(;theClass;theClass=theClass.super_class)if(theClass===aClass)return YES;
return NO;

})
, new objj_method(sel_getUid("isKindOfClass:"), function(self, _cmd, aClass)
{
return _$(self.isa,"isSubclassOfClass:",aClass);

})
, new objj_method(sel_getUid("isKindOfClass:"), function(self, _cmd, aClass)
{
return _$(self,"isSubclassOfClass:",aClass);

})
, new objj_method(sel_getUid("isMemberOfClass:"), function(self, _cmd, aClass)
{
return self.isa===aClass;

})
, new objj_method(sel_getUid("isMemberOfClass:"), function(self, _cmd, aClass)
{
return self===aClass;

})
, new objj_method(sel_getUid("isProxy"), function(self, _cmd)
{
return NO;

})
, new objj_method(sel_getUid("instancesRespondToSelector:"), function(self, _cmd, aSelector)
{
return !!class_getInstanceMethod(self,aSelector);

})
, new objj_method(sel_getUid("respondsToSelector:"), function(self, _cmd, aSelector)
{
return !!class_getInstanceMethod(self.isa,aSelector);

})
, new objj_method(sel_getUid("implementsSelector:"), function(self, _cmd, aSelector)
{
var methods=class_copyMethodList(self.isa),count=methods.length;
while(count--)if(method_getName(methods[count])===aSelector)return YES;
return NO;

})
, new objj_method(sel_getUid("methodForSelector:"), function(self, _cmd, aSelector)
{
return class_getMethodImplementation(self.isa,aSelector);

})
, new objj_method(sel_getUid("instanceMethodForSelector:"), function(self, _cmd, aSelector)
{
return class_getMethodImplementation(self,aSelector);

})
, new objj_method(sel_getUid("methodSignatureForSelector:"), function(self, _cmd, aSelector)
{
return nil;

})
, new objj_method(sel_getUid("description"), function(self, _cmd)
{
return "<"+self.isa.name+" 0x"+_$(CPString,"stringWithHash:",_$(self, "UID"))+">";

})
, new objj_method(sel_getUid("description"), function(self, _cmd)
{
return self.isa.name;

})
, new objj_method(sel_getUid("performSelector:"), function(self, _cmd, aSelector)
{
return objj_msgSend(self,aSelector);

})
, new objj_method(sel_getUid("performSelector:withObject:"), function(self, _cmd, aSelector, anObject)
{
return objj_msgSend(self,aSelector,anObject);

})
, new objj_method(sel_getUid("performSelector:withObject:withObject:"), function(self, _cmd, aSelector, anObject, anotherObject)
{
return objj_msgSend(self,aSelector,anObject,anotherObject);

})
, new objj_method(sel_getUid("performSelector:withObjects:"), function(self, _cmd, aSelector, anObject)
{
var params=[self,aSelector].concat(Array.prototype.slice.apply(arguments,[3]));
return objj_msgSend.apply(this,params);

})
, new objj_method(sel_getUid("forwardingTargetForSelector:"), function(self, _cmd, aSelector)
{
return nil;

})
, new objj_method(sel_getUid("forwardInvocation:"), function(self, _cmd, anInvocation)
{
_$(self,"doesNotRecognizeSelector:",_$(anInvocation, "selector"));

})
, new objj_method(sel_getUid("doesNotRecognizeSelector:"), function(self, _cmd, aSelector)
{
console.error(self.isa.name+"does not recognize selector "+aSelector);

})
, new objj_method(sel_getUid("className"), function(self, _cmd)
{
return self.isa.name;

})
, new objj_method(sel_getUid("hash"), function(self, _cmd)
{
return _$(self, "UID");

})
, new objj_method(sel_getUid("UID"), function(self, _cmd)
{
if(typeof self._UID==="undefined")self._UID=objj_generateObjectUID();
return self._UID+"";

})
, new objj_method(sel_getUid("isEqual:"), function(self, _cmd, anObject)
{
return self===anObject||_$(self, "UID")===_$(anObject, "UID");

})
, new objj_method(sel_getUid("retain"), function(self, _cmd)
{
return self;

})
, new objj_method(sel_getUid("self"), function(self, _cmd)
{
return self;

})
, new objj_method(sel_getUid("superclass"), function(self, _cmd)
{
return self.isa.super_class;

})
]);}

function CPDescriptionOfObject(anObject){if(anObject.isa){if(_$(anObject,"isKindOfClass:",CPString))return '@"'+_$(anObject, "description")+'"';
return _$(anObject, "description");
}if(typeof undefined!=="object")return String(anObject);
var desc="JSObject\n{\n";
for(var property in anObject){if(anObject.hasOwnProperty(property))desc+="   "+property+": "+CPDescriptionOfObject(anObject[property])+"\n";
}desc+="}";
return desc.split('\n').join("\n\t");
}
