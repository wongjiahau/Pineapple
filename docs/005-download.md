# Download Pineapple

To use Pineapple interpreter, you need to [install Node.js V8.11](https://nodejs.org/en/download/) first.

Then, open command prompt, run the following command:

```sh
npm install --global pineapple-alpha
```

!!! info "Note"
    For Windows users, you might need to open the command prompt in Administrator mode.

    For Linux/Mac users, you might need to prefix the command above with `sudo`.

!!! warning
    The current version of Pineapple is an alpha release, so it is meant for alpha testers only as it might contain a lot of bugs, and not all features are fully implemented yet.

---

### Validation

To ensure that you have installed Pineapple successfully. Type the following command in your command prompt or terminal:

```sh
pine 
```

Then, you should see the following:

```sh
Pineapple 0.0.X
```

If you do not see something similar to the output above, it means that you had not successfully installed Pineapple, so you might need to retry again.

---

## Create a **Hello world!** program

First, create a file called `hello.pine`.

Secondly, open the file in your favourite code editor (for example, Notepad).

Thirdly, copy and paste the following code into `hello.pine`.

```pine

def .main
    "Hello world!".show
```

Fourthly, save the file.

Lastly, type in the following command in your command prompt or terminal.

```sh
pine hello.pine
```

Happy hacking :)

---

Read more about [Pineapple features](./Features/001-BasicProgram.md).