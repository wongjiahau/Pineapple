# Naming rules

Naming rules in Pineapple is rather strict, so that the codebase will be consistent without the need to follow any specific style guide.

## Type name

Every type name in Pineapple must starts with the colon `:` symbol. 

The is to enhance the type discoverability through the aid of IDEs, because in most language, type name start with capital letters, but how do you tell the IDE to show all available type in the current scope? It's quite impossible, because you have to type at least one letter to do that, but by typing one letter, you already filtered out all other types that have name starting with the rest of the 25 letters. Meanwhile, in Pineapple, all you have to type is `:`, and the IDE can gracefully show you all the available types.

For example,

```pine
:number // valid
:nationalFruit // valid
:big_book // invalid, cannot contain underscore
:x // valid, but meaningless
```

## Function name

Every function name must start with the dot symbol. For example,

```pine
.saySomething // valid
.add // valid
yo // invalid, must start with dot
. // valid too! This is useful for implementing look-up functions such as array indexing
```

## Variable name

Every variable name must start with a lowercase letter, and cannot contain underscore. For example,

```pine
x // valid
myName // valid
HisHeight // invalid, cannot start with uppercase letter
```
