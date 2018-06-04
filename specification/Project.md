# Project
You can create a Pineapple project by creating a file called `pine.project` at the current directory.

Then, after that, you can transpile all the code under the directory with the command
```
pine
```

## Module import
When you use defined `pine.project`, all the import is relative to the directory of `pine.project`.  

For example, let say you have the following directory structure.

```
myProject
    - pine.project
    - source
        - Math
            - add.pine
            - minus.pine
        - App
            - main.pine
```

So, how do you import `add.pine` from `main.pine`?
  
  By using the special variable `$root`.

Let say the following file is `main.pine` :
```
import $root/source/Math/add.pine
```

If you are not using project, you will need to use relative import.
```
import ../Math/add.pine
```

## So, which method should I use?
The project method, as it will make the code looks a lot more cleaner.

## Package manager
Under construction.

## Reference
This feature is inspired by `Go`.