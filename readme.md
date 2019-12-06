# css-overlap

This is a quick script I hacked together to aid in resolving rule
overlaps between two sets of stylesheets.  If you want to unify two
sets of style sheets, you might want to be aware of all the ways in
which they interact.

The way this works is by:

1. First categorizing stylesheets into two sets, `A` and `B`.

2. Matching every dom element against the rules in each set. If nodes
   have matching rules in both sets, this is considered a collision.

3. Collisions are deduplicated and logged to the console.

A more complete way of determining stylesheet interactions would involve
a proper intersection of the css selectors. However, this would
take a lot more effort. This would detect css selector overlap
that doesn't occur in practice.

## Usage

If path matching can be used to categorize your CSS files, modify
`aRegex` and `bRegex` in `css-overlap.js` to categorize your CSS files
based on their urls.

Run `css-overlap.js` after your page has been populated with DOM
nodes.

## Example

The example html has 3 divs:

```html
    <div class="overlaps"/>
    <div class="only-a"/>
    <div class="only-b"/
```

Style sheet A:

```css
.only-a {
    color: #f00;
}

.overlaps {
    color: #00f;
}
```

Style sheet B:

```css
.only-b {
    color: #0f0;
}

.overlaps {
    color: #0f0;
}
```

The html then runs `debugCssOverlaps`, which causes the following to
be output to the console:

```
========================================
  Colliding selectors!
  A selectors:
     .overlaps (from  file:///home/mgsloan/proj/css-overlap/a.css )
  B selectors:
     .overlaps (from  file:///home/mgsloan/proj/css-overlap/b.css )
========================================
```

## Dealing with CORS restrictions

You may get the following error in the developer tools console:

> Uncaught DOMException: Failed to read the 'cssRules' property from
> 'CSSStyleSheet': Cannot access rules

This is due to recent chrome CORS restrictions for reading CSS
info from JS. If you serve `css-overlaps.js` from your development
server, it has good chances of working with the CSS from the server.

If you encounter this error, and you are loading local html directly
into chrome, such as with `test.html` in this repo, then you can work
around it by:

1. Completely exiting chrome, perhaps via `killall chrome`

2. Running with the `--allow-file-access-from-files` flag, perhaps via
   `google-chrome --allow-file-access-from-files` or `chromium
   --allow-file-access-from-files`.

If you aren't directly loading an html file into chrome, then you can
use a big dangerous hammer and [disable CORS entirely][] via the
`--disable-web-security` (similarly, after exiting all chrome
windows). You probably shouldn't browse around with this flag enabled,
it allows for a variety of attacks.

[disable CORS entirely]: https://alfilatov.com/posts/run-chrome-without-cors/
