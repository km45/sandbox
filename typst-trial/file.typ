= table

#table(
	columns: (auto,auto),
	[*key*],[*value*],
	[a],[12345],
	[b],[67890]
)

= math

== inline math

// NOT `$ a $`
$a$

$z in bold(C)$

== block-level math

// NOT `$a$`
$ a $

$ z in bold(C) $

$ cos z &= (e^(i z) + e^(-i z)) / 2, \
  sin z &= (e^(i z) - e^(-i z)) / (2 i) $

$ upright(d)/(upright(d) z) cos z &= -sin z, \
  upright(d)/(upright(d) z) sin z &=  cos z $

= code

== Makefile

```makefile
all:
	g++ main.cpp
```

== rust (embed  external file)

#let code_hello = read("hello.rs")
#raw(code_hello, lang: "rust")
