# Pineapple documentation website
## What is this README about?
This README is about how to build and publish the Pineapple Language Documentation.

## What documentation generator is used?
This documentation is generated using [MKDocs](https://www.mkdocs.org/).

## How to build and test the doc?

### 1. Install Python 3.6
### 2. Install the following Python modules
```sh
sudo pip3.6 install mkdocs
sudo pip3.6 install mkdocs-material
sudo pip3.6 install pymdown-extensions
sudo pip3.6 install pygments
```

### 3. Enable Pineapple syntax highlighting

1. Symlink `pineapple.py` into `pygments/lexers/pineapple.py`

```sh
sudo ln -s $PINEAPPLE_REPO/pineapple.py $PYTHON/dist-packages/pygments/lexers/pineapple.py

# $PINEAPPLE_REPO is where you git cloned this project
# $PYTHON might be /usr/local/lib/python3.6
# Note that value of $PYTHON will be different on different machine
```

2. Run the mapping script
```sh
cd $PYTHON/dist-packages/pygments/lexers
sudo python3.6 _mapping.py

# Note: you only need to run this once
```

### 4. Serve the page

```sh
mkdocs serve
```

## 5. How to deploy?

```sh
mkdocs gh-deploy
```

## How to update Pineapple's syntax highlighting?
Edit the file `pineapple.py`. (Make sure you completed Step 2).
After that, re-run `mkdocs serve`.

