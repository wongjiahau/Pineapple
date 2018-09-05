# -*- coding: utf-8 -*-
"""
    pygments.lexers.pineapple
    ~~~~~~~~~~~~~~~~~~~~~~~~~~

    Lexers for Pineapple language.

    :copyright: Copyright 2018 by Wong Jia Hau.
    :license: Apache 2.0
"""
"""
This file is modified from pygments.lexers.javascript
"""

import re

from pygments.lexer import RegexLexer, include, bygroups, default, using, \
    this, words, combined
from pygments.token import Text, Comment, Operator, Keyword, Name, String, \
    Number, Punctuation, Other
from pygments.util import get_bool_opt, iteritems
import pygments.unistring as uni

__all__ = ['PineappleLexer']

class PineappleLexer(RegexLexer):
    """
    For Pineapple source code.
    """

    name = 'Pineapple'
    aliases = ['pine', 'pineapple']
    filenames = ['*.pine', '*.pineapple']

    flags = re.DOTALL | re.UNICODE | re.MULTILINE

    tokens = {
        'commentsandwhitespace': [
            (r'\s+', Text),
            (r'<!--', Comment),
            (r'//.*?\n', Comment.Single),
            (r'/\*.*?\*/', Comment.Multiline)
        ],
        'slashstartsregex': [
            include('commentsandwhitespace'),
            (r'/(\\.|[^[/\\\n]|\[(\\.|[^\]\\\n])*])+/'
             r'([gimuy]+\b|\B)', String.Regex, '#pop'),
            (r'(?=/)', Text, ('#pop', 'badregex')),
            default('#pop')
        ],
        'badregex': [
            (r'\n', Text, '#pop')
        ],
        'root': [
            (r'\A#! ?/.*?\n', Comment.Hashbang),  # recognized by node.js
            (r'^(?=\s|/|<!--)', Text, 'slashstartsregex'),
            include('commentsandwhitespace'),
            (r'0[bB][01]+', Number.Bin),
            (r'0[oO][0-7]+', Number.Oct),
            (r'0[xX][0-9a-fA-F]+', Number.Hex),
            (r'\b([.]([a-zA-Z][a-zA-Z0-9])*)', Number.Integer), # This is actually function name, but I just want to use the color of Number.Integer
            (r'\.\.\.|=>', Punctuation),
            (r'\+\+|--|~|&&|\?|:|\|\||\\(?=\n)|'
             r'(<<|>>>?|==?|!=?|[-<>+*%&|^/])=?', Operator, 'slashstartsregex'),
            (r'[{(\[;,]', Punctuation, 'slashstartsregex'),
            (r'[})\].]', Punctuation),
            (r'(for|in|while|do|break|return|continue|if|else|elif|mutable|'
             r'throw|try|catch|new)\b', Keyword, 'slashstartsregex'),
            (r'(def|let|function|import|pass)\b', Keyword.Declaration, 'slashstartsregex'),
            (r'(and|or|not)\b', Keyword.Reserved),
            (r'[#][a-zA-Z0-9]+\b', Keyword.Constant),
            (r'[0-9]+', Keyword.Constant), # Integer
            (r'(\.\d+|[0-9]+\.[0-9]*)([eE][-+]?[0-9]+)?', Keyword.Constant), # Float
            (r'([A-Z][a-zA-Z0-9]*)\b', Name.Builtin),
            (r'([a-z][a-zA-Z0-9]*)\b', Name.Other), # variable
            (r'"(\\\\|\\"|[^"])*"', String.Double),
            (r"'(\\\\|\\'|[^'])*'", String.Single),
            (r'`', String.Backtick, 'interp'),
        ],
        'interp': [
            # (r'`', String.Backtick, '#pop'),
            (r'\\\\', String.Backtick),
            (r'\\`', String.Backtick),
            (r'\$\{', String.Interpol, 'interp-inside'),
            (r'\$', String.Backtick),
            (r'[^`\\$]+', String.Backtick),
        ],
        'interp-inside': [
            # TODO: should this include single-line comments and allow nesting strings?
            (r'\}', String.Interpol, '#pop'),
            include('root'),
        ],
        # (\\\\|\\`|[^`])*`', String.Backtick),
    }
