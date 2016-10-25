![](http://i.imgur.com/OUQzoiA.png)
# EQCSS
**A CSS Extension for Element Queries & More**

[![Join the chat at https://gitter.im/eqcss/eqcss](https://badges.gitter.im/eqcss/eqcss.svg)](https://gitter.im/eqcss/eqcss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What are Element Queries?

Element queries are a new way of thinking about responsive web design in CSS where the responsive conditions apply to individual elements on the page instead of the width or height of the browser.

Unlike CSS `@media` queries, `@element` queries can be based on more than just the width or height of the browser as well, you can change styles in a number of different situations, like how many lines of text or child elements an element contains.

Another concept that element queries brings to CSS is the idea of 'scoping' your styles to one element in the same way that JavaScript functions define a new scope for the variables they contain.

## How to use EQCSS

EQCSS is a JavaScript plugin that lets you write element queries inside CSS today. With performance in mind, this plugin is written in pure JavaScript, so it doesn't require jQuery or any other libraries on your page in order to function - add EQCSS.js to your HTML and you're ready to get started!

#### [Download EQCSS Zip](https://github.com/eqcss/eqcss/archive/gh-pages.zip)

    git clone https://github.com/eqcss/eqcss/archive/gh-pages.zip

Once you have downloaded a copy of EQCSS you will need to add it to every HTML page where you will be using element queries. It's best to add a `<script>` after your content, before the end of your `<body>` tag.

    <script src=EQCSS.js></script>

If you need to support IE8 there is an optional polyfill available that adds `@media` queries and `@element` queries to IE8. Add this file to your HTML before where you added EQCSS:

    <!--[if lt IE 9]><script src="EQCSS-polyfills.js"></script><![endif]-->

Alternatively, you can also grab [EQCSS from NPM](https://www.npmjs.com/package/eqcss) with the following command:

    npm install eqcss

Or from Yarn via

    yarn add eqcss

### CDN Hosted Links

EQCSS is also hosted on CDNjs and you can use the version hosted there for your projects: [https://cdnjs.com/libraries/eqcss](https://cdnjs.com/libraries/eqcss):

```
https://cdnjs.cloudflare.com/ajax/libs/eqcss/1.4.0/EQCSS-polyfills.min.js
```

```
https://cdnjs.cloudflare.com/ajax/libs/eqcss/1.4.0/EQCSS.min.js
```

## Writing Element Queries

Now that you have EQCSS added to your HTML you're ready to write element queries. There are two ways you can add EQCSS to your site: the easiest way is by writing them inside your CSS either in a `<style>` or `<link>` in your HTML, or by isolating your EQCSS styles in a custom script type.

You can also link to EQCSS hosted in external files with either `.css` or `.eqcss` extensions.

## Using the EQCSS script type

While not necessary, if you choose to isolate your EQCSS from your CSS you can store it in external `.eqcss` files and link them using a `<script>` tag like this:

    <script type=text/eqcss src=styles.eqcss></script>

And you can include EQCSS scripts inline in your page like this as well:

    <script type=text/eqcss>
    
      /* EQCSS goes here */
    
    </script>

## Running EQCSS

By default the plugin execute once when the content loads, and also whenever it detects browser resize (similar to `@media` queries). The `EQCSS.apply()` function can be called manually on other events too, like keyup or clicks, or even when specific elements are interacted with.

## Designing with Element Queries

Element Queries have the following syntax:

**element_query** = @element `selector_list` `[ condition_list ]` { `css_code` }

**selector_list** = " `css_selector` `[ "," css_selector ]*` "

**condition_list** = and ( `query_condition` : `value` ) `[ "and (" query_condition ":" value ")" ]*`

**value** = `number` `[ css_unit ]`

**query_condition** = min-height | max-height | min-width | max-width | min-characters | max-characters | min-lines | max-lines | min-children | max-children | min-scroll-y | max-scroll-y | min-scroll-x | max-scroll-x

**css_unit** = % | px | pt | em | cm | mm | rem | ex | ch | pc | vw | vh | vmin | vmax

An EQCSS element query is a container query that begins with "@element", followed by one or more CSS selectors (comma-separated) in quotes (either single or double quotes), followed by one or more optional responsive conditions comprised of a query condition and a value separated by a colon, followed by one or more optional CSS rules wrapped in curly brackets.

For more info, view more about EQCSS syntax here: [https://gist.github.com/tomhodgins/6237039fa07c2e4b7acd1c8b0f9549a9](https://gist.github.com/tomhodgins/6237039fa07c2e4b7acd1c8b0f9549a9)

## Element Query Conditions

### Width-based Conditions

- `min-width` [min-width in px](http://codepen.io/tomhodgins/pen/MeKwaY), [min-width in %](http://codepen.io/tomhodgins/pen/ezJNpp)
- `max-width` [max-width in px](http://codepen.io/tomhodgins/pen/EyPjVg), [max-width in %](http://codepen.io/tomhodgins/pen/oLbXzG)

### Height-based Conditions

- `min-height` [min-height in px](http://codepen.io/tomhodgins/pen/PzZqPd), [min-height in %](http://codepen.io/tomhodgins/pen/KMVpdO)
- `max-height` [max-height in px](http://codepen.io/tomhodgins/pen/EyPjPg), [max-height in %](http://codepen.io/tomhodgins/pen/xOZGZg)

### Count-based Conditions

- `min-characters` [on block elements](http://codepen.io/tomhodgins/pen/vKLOLd), [on form inputs](http://codepen.io/tomhodgins/pen/OXMVMB)
- `max-characters` [on block elements](http://codepen.io/tomhodgins/pen/pbgJyz), [on form inputs](http://codepen.io/tomhodgins/pen/MeKwyY)
- `min-lines` [min-lines demo](http://codepen.io/tomhodgins/pen/JKGdXN)
- `max-lines` [max-lines demo](http://codepen.io/tomhodgins/pen/oLbXxG)
- `min-children` [min-children demo](http://codepen.io/tomhodgins/pen/dXGoMZ)
- `max-children` [max-children demo](http://codepen.io/tomhodgins/pen/mEVJPK)

### Scroll-based Conditions

- `min-scroll-y` [min-scroll-y demo](http://codepen.io/tomhodgins/pen/OXMVNa)
- `max-scroll-y` [max-scroll-y demo](http://codepen.io/tomhodgins/pen/beEdpZ)
- `min-scroll-x` [min-scroll-x demo](http://codepen.io/tomhodgins/pen/ZOQGOb)
- `max-scroll-x` [max-scroll-x demo](http://codepen.io/tomhodgins/pen/ezJNzJ)

### Aspect-based Conditions

- `orientation` [orientation demo](http://codepen.io/tomhodgins/pen/wzmyYQ)
- `min-aspect-ratio` [min-aspect-ratio demo](http://codepen.io/tomhodgins/pen/EgEQZy)
- `max-aspect-ratio` [max-aspect-ratio demo](http://codepen.io/tomhodgins/pen/kkEZAY)

### Meta-Selectors

- `$this` [$this demo](http://codepen.io/tomhodgins/pen/xOZGOq)
- `$parent` [$parent demo](http://codepen.io/tomhodgins/pen/VjeLjy)
- `$root` [$root demo](http://codepen.io/tomhodgins/pen/RRrPRy)
- `$prev` [$prev demo](http://codepen.io/tomhodgins/pen/gMPpMd)
- `$next` [$next demo](http://codepen.io/tomhodgins/pen/PzZqzy)

(Alternatively, for SCSS compatibility you can also use meta-selectors prefixed by `eq_` instead of a `$`. These are `eq_this`, `eq_parent`, `eq_root`, `eq_prev`, and `eq_next`)

### CSS Functions

- `eval('')` [eval('') demo](http://codepen.io/tomhodgins/pen/WxrvxB)

### CSS Units

- `ew` element width [ew demo](http://codepen.io/tomhodgins/pen/kkqjZB)
- `eh` element height [eh demo](http://codepen.io/tomhodgins/pen/YGgLrW)
- `emin` element minimum [emin demo](http://codepen.io/tomhodgins/pen/YGgLrW)
- `emax` element maximum [emax demo](http://codepen.io/tomhodgins/pen/YGgLrW)

## Element Query Demos

- [Responsive Aspect Ratio](http://elementqueries.com/demos/aspect-ratio.html)
- [Sticky Scroll Header](http://elementqueries.com/demos/scroll-header.html)
- [Blockquote Style](http://elementqueries.com/demos/blockquote-style.html)
- [Calendar](http://elementqueries.com/demos/calendar.html)
- [Content Demo](http://elementqueries.com/demos/content-blocks.html)
- [Counting Children Demo](http://elementqueries.com/demos/counting-children.html)
- [Date Demo](http://elementqueries.com/demos/date.html)
- [Zastrow-style Element Query Demo Demo](http://elementqueries.com/demos/element-query-demo.html)
- [Flyout Demo](http://elementqueries.com/demos/flyout.html)
- [Headline Demo](http://elementqueries.com/demos/headline.html)
- [Media Player Demo](http://elementqueries.com/demos/media-player.html)
- [Message Style Demo](http://elementqueries.com/demos/message-style.html)
- [Modal Demo](http://elementqueries.com/demos/modal.html)
- [Nav Demo](http://elementqueries.com/demos/nav.html)
- [Parent Selector Demo](http://elementqueries.com/demos/parent.html)
- [Pricing Chart Demo](http://elementqueries.com/demos/pricing-chart.html)
- [Responsive Tables Demo](http://elementqueries.com/demos/responsive-table.html)
- [Scroll-triggered Blocker Demo](http://elementqueries.com/demos/blocker.html)
- [Signup Form Demo](http://elementqueries.com/demos/signup-form.html)
- [Testimonials Block Demo](http://elementqueries.com/demos/testimonial.html)
- [Tweet-Counter Demo](http://elementqueries.com/demos/tweet-counter.html)
- [JS Variables Demo](http://elementqueries.com/demos/variables.html)
- [Responsive Scaling Demo](http://elementqueries.com/demos/video-scaling.html)
- [Geometric Design Demo](http://elementqueries.com/demos/geometric.html)
- [Responsive Order Form](http://elementqueries.com/demos/order-form.html)
- [Element Query Grid](http://elementqueries.com/demos/element-query-grid.html)
- [JS Functions in CSS](http://elementqueries.com/demos/js-functions-demo.html)
- [Responsive Content Waterfall](http://elementqueries.com/demos/responsive-waterfall.html)

And view many more EQCSS demos on Codepen: [EQCSS pens on Codepen](http://codepen.io/search/pens?q=eqcss&limit=all&order=newest&depth=everything&show_forks=true)

## Documentation & Tutorials

- **[The Search For The Holy Grail: How I Ended Up With Element Queries, And How You Can Use Them Today](https://www.smashingmagazine.com/2016/07/how-i-ended-up-with-element-queries-and-how-you-can-use-them-today/)**
- [How to Build a Responsive UI Component Using Element Queries](http://webdesign.tutsplus.com/tutorials/how-to-build-a-responsive-ui-component-using-element-queries--cms-27118)
- [Element Queries: the Future of Responsive Web Design](http://webdesign.tutsplus.com/tutorials/element-queries-the-future-of-responsive-web-design--cms-26945)
- [Element Queries For CSS](http://elementqueries.com/notes/element-queries-for-css.html)
- [EQCSS v1.0.0 Technical Documentation](http://elementqueries.com/notes/technical-documentation.html)
- [A Parent Selector for CSS](http://elementqueries.com/notes/a-parent-selector-for-css.html)
- [It's Time to Think 'Element-First'](http://elementqueries.com/notes/its-time-to-think-element-first.html)

## Try it Live

Here's a link to the EQCSS REPL where you can try writing EQCSS-enhance CSS live in your browser and share a custom link with others: [http://elementqueries.com/repl.html](http://elementqueries.com/repl.html)

### More Demos @ the EQCSS Website: [http://elementqueries.com](http://elementqueries.com)