20 July 2020

### I caused a bug the other day by assuming the answer to this question was yes, surely 2 must be true, I mean it clearly isn't false is it?

---

The offending C code was along the lines of this:
```c
uint8_t foo = someStuffThatReturnsaNumber();

if ((foo & 0b0010) == true)
{
	/* Do stuff */
}
```

I was *hoping* this would take `foo`, bitwise-and it with the binary number `0010`
using the [handy GCC extension](https://gcc.gnu.org/onlinedocs/gcc/Binary-constants.html)
to write binary constants, and if the result of that was non-zero, do the stuff in the if statement. Blissfully
unaware of what I had actually written at this point, I was rather surprised that this didn't work.

Distraught, I began debugging. Printing out the value of `foo`, it had the value I was expecting,
`foo` and'ed with `0010` was indeed 2. So why then was it not entering this if statement? Time
to look into what `true` actually is.

Typically, any C program these days will get `true` from a header file called `stdbool.h`
which contains (among other things) the following:

```c
#define true 1
#define false 0
```

So, as you can imagine the compiler will come along and change all of the instances of `true` to
`1`. Knowing what we know now about the values in question, let's reassess that if statement.

```c
if (2 == 1)
{
	/* Do stuff */
}
```

Well, no shit it doesn't enter the if statement.


So, what could we do to get the result we're after? That brings us to one of the other things in that
`stdbool.h` file:
```c
#define bool _Bool
```


`_Bool` is the actual boolean type introduced in C99. The odd name is because there had been 27 years of
C where people made their own boolean types by doing something like `typedef int bool;`. So if we tried
reserving the word `bool` for the new type, a massive chunk of existing code would no longer compile.


This new boolean type can only store either 1 or 0, so anything larger will just be changed to 1. You could write
`_Bool foo = 42;` but `foo` would still be 1. So knowing that, we could cast our expression to
a `bool`, our 2 would be changed to a 1, and problem solved:
```c
if ((bool)(foo & 0b0010) == true)
{
	/* Do stuff */
}
```


Given that that doesn't look particularly friendly, the C99 specification also says that our if statement will be
entered if *"the expression compares unequal to 0"*. Which means that we could just use the 2 from our
bitwise-and to enter the if statement and be done with it:
```c
if (foo & 0b0010)
{
	/* Do stuff */
}
```


However, coding standards such as MISRA C are not fond of if statements like this as the expression is not
*"essentially Boolean"* because the result of this expression is an integer, not a boolean, which could be
implied as a type cast. Although as we've just seen an if statement doesn't *actually* use the boolean type,
it only cares whether the integer result is 0 or not.


Probably the best thing to do in this particular case is to compare against an explicit numerical value and forget
about `true` and `false`. So in the end I went for:
```c
if ((foo & 0b0010) == 2)
{
	/* Do stuff */
}
```

On a lower level the `==` operator works by subtracting the right-hand variable from the left-hand
variable, and a flag is set if the result of that subtraction is 0. The state of that flag can then be checked to
either jump to a specific piece of code or set a variable to `true` or `false`. In x86
assembly our if statement looks like:

```asm
; Boring stuff that moves foo into the eax register
and	eax, 2 		; Does a bitwise-and of foo, and 2
cmp	eax, 2 		; Subtracts 2 from the result, and sets the equal flag if that's 0
jne	.L2 		; jne = Jump Not Equal, if the equal flag was not set, jumps to .L2
;
; Do stuff
;
.L2:
; Carry on with the rest of the program
; ...

```



As you can see, assembly doesn't really have any concept of types, or booleans for that matter, it's just concerned
with numerical values. This question of whether booleans are just integers is common to pretty much all higher-level
languages as well; JavaScript uses a dedicated boolean type for `true` and `false` although it
can type cast to integers `1` and `0`, so you get the following behaviour:

```js
console.log(2 == true)
// false, (Number 2) == (Boolean true --> Number 1)
console.log(1 === true)
// false, (Number 1) === (Boolean true)
console.log(1 == true)
// true,  (Number 1) == (Boolean true --> Number 1)
if (2) console.log("true"); else console.log("false");
// true,  (Number 2 --> Boolean true)

```


Python is very similar to C where `True` and `False` are simply integer values `1` and `0`, although they
can also be cast to strings as `"True"` and `"False"`, so the behaviour is:

```python
print(2 == True)
# False, (int 2) == (bool True --> int 1)
print(1 == True)
# True,  (int 1) == (bool True --> int 1)
print("True") if (2) else print("False")
# True,  (int 2 --> bool true)
```


The situation can get a little spicier than this in dynamically typed languages, because it may not be immediately
obvious whether a function can return things like empty arrays or stringifyed values, and indeed what the truthiness
of those might be. For example, Perl, Bash, and PHP generally don't differentiate between strings and integers, so
`0 == "false"`. Here's a few more examples of JavaScript and Python behaviour:

```js
console.log("" == false)
// true,  (String "" --> Number 0) == (Boolean false --> Number 0)
console.log(null == false)
// false, because null is only equal to undefined
console.log([] == true)
// false, (Object [] --> String "" --> Number 0) == (Boolean true --> Number 1)
if ([]) console.log("true"); else console.log("false");
// true,  (Object [] --> Boolean true)
```

```python
print("" == False)
# False, (String "") == (bool True)
print(bool("") == False)
# True,  (String "" --> len("") --> int 0) == (bool False --> int 0)
print(None == False)
# False, (None) == (bool False)
print(bool([]))
# False, (List [] --> len([]) --> int 0 --> bool False)
print("True") if [] else print("False")
# False, (List [] --> len([]) --> int 0 --> bool False)
```


There are of course better ways to write a lot of these comparisons, and many languages include a more strict
`===` equality check that generally does not type-cast to remove a lot of the ambiguity I've shown here,
but none the less it's well worth learning about the different approaches and implementations of boolean logic that
exist in different languages, as bugs can easily creep in from well-meaning but unintended boolean comparisons. If
you'd like to learn more there's an enormous amount of material on this subject out there in language specifications
and standards documents that I haven't covered here.



But in summary, is 2 true? 

### 2 is not *equal* to true, but often behaves like true in boolean contexts.
