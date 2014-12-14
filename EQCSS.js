/*
 * addEventListener polyfill 1.0 / Eirik Backer, Maxime Euzière / MIT Licence
 * Forked from http://css-tricks.com/snippets/javascript/addeventlistner-polyfill/
 * Adds the native DOM2 function addEventListener on IE6 - 8.
 */

(function(win, doc){

  // If the function already exists, no need to polyfill
	if(win.addEventListener)return;

	function docHijack(p){
    var old = doc[p];
    doc[p] = function(v){
      return addListen(old(v))
    }
  }
	function addEvent(on, fn, self){
		return (self = this).attachEvent('on' + on, function(e){
			var e = e || win.event;
			e.preventDefault  = e.preventDefault  || function(){e.returnValue = false}
			e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true}
			fn.call(self, e);
		});
	}
	function addListen(obj, i){
		if(i = obj.length)while(i--)obj[i].addEventListener = addEvent;
		else obj.addEventListener = addEvent;
		return obj;
	}
	addListen([doc, win]);
	if('Element' in win)win.Element.prototype.addEventListener = addEvent;			// IE8
	else{																			                                  // IE < 8
		doc.attachEvent('onreadystatechange', function(){addListen(doc.all)});		// Make sure we also init at domReady
		docHijack('getElementsByTagName');
		docHijack('getElementById');
		docHijack('createElement');
		addListen(doc.all);	
	}
})(window, document);


/*
 * getComputedStyle and getPropertyValue polyfill / Jonathan Neal, Maxime EUZIERE / License CC0
 * Forked from: https://github.com/Financial-Times/polyfill-service/tree/master/polyfills/getComputedStyle
 * Allows to measure a CSS property of any element on IE6-8.
 * Dimensions (width, height...) are converted and returned in pixels, like modern browsers do.
 */

(function(win){

  // If the function already exists, no need to polyfill
	if(win.getComputedStyle)return;
  
	function getComputedStylePixel(element, property, fontSize) {
		var
    
		// Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.
		value = element.document && element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
		size = value[1],
		suffix = value[2],
		rootSize;

		fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
		rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

		return suffix == '%' ? size / 100 * rootSize :
		       suffix == 'cm' ? size * 0.3937 * 96 :
		       suffix == 'em' ? size * fontSize :
		       suffix == 'in' ? size * 96 :
		       suffix == 'mm' ? size * 0.3937 * 96 / 10 :
		       suffix == 'pc' ? size * 12 * 96 / 72 :
		       suffix == 'pt' ? size * 96 / 72 :
		       size;
	}

	function setShortStyleProperty(style, property) {
		var
		borderSuffix = property == 'border' ? 'Width' : '',
		t = property + 'Top' + borderSuffix,
		r = property + 'Right' + borderSuffix,
		b = property + 'Bottom' + borderSuffix,
		l = property + 'Left' + borderSuffix;

		style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [ style[t] ] :
		                   style[t] == style[b] && style[l] == style[r] ? [ style[t], style[r] ] :
		                   style[l] == style[r] ? [ style[t], style[r], style[b] ] :
		                   [ style[t], style[r], style[b], style[l] ]).join(' ');
	}

	// <CSSStyleDeclaration>
	function CSSStyleDeclaration(element) {
		var
		style = this,
		currentStyle = element.currentStyle,
		fontSize = getComputedStylePixel(element, 'fontSize'),
		unCamelCase = function (match) {
			return '-' + match.toLowerCase();
		},
		property;

		for (property in currentStyle) {
			Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

			if (property == 'width') {
				style[property] = element.offsetWidth + 'px';
			} else if (property == 'height') {
				style[property] = element.offsetHeight + 'px';
			} else if (property == 'styleFloat') {
				style.float = currentStyle[property];
			} else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
				style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
			} else if (/^outline/.test(property)) {
				
        // errors on checking outline
				try {
					style[property] = currentStyle[property];
				} catch (error) {
					style.outlineColor = currentStyle.color;
					style.outlineStyle = style.outlineStyle || 'none';
					style.outlineWidth = style.outlineWidth || '0px';
					style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
				}
			} else {
				style[property] = currentStyle[property];
			}
		}

		setShortStyleProperty(style, 'margin');
		setShortStyleProperty(style, 'padding');
		setShortStyleProperty(style, 'border');

		style.fontSize = Math.round(fontSize) + 'px';
	}

	CSSStyleDeclaration.prototype = {
		constructor: CSSStyleDeclaration,
		
    // <CSSStyleDeclaration>.getPropertyPriority
		getPropertyPriority: function () {
			throw new Error('NotSupportedError: DOM Exception 9');
		},
		
    // <CSSStyleDeclaration>.getPropertyValue
		getPropertyValue: function (property) {
			return this[property.replace(/-\w/g, function (match) {
				return match[1].toUpperCase();
			})];
		},
		
    // <CSSStyleDeclaration>.item
		item: function (index) {
			return this[index];
		},
		
    // <CSSStyleDeclaration>.removeProperty
		removeProperty: function () {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		
    // <CSSStyleDeclaration>.setProperty
		setProperty: function () {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		
    // <CSSStyleDeclaration>.getPropertyCSSValue
		getPropertyCSSValue: function () {
			throw new Error('NotSupportedError: DOM Exception 9');
		}
	};

	// <win>.getComputedStyle
	win.getComputedStyle = function getComputedStyle(element) {
		return new CSSStyleDeclaration(element);
	};
})(window);


/*
 * document.querySelector and querySelectorAll polyfill / Maxime Euzière / public domain
 * Forked from: http://xem.github.io/Lazy/
 * For IE6-8
 */

(function(doc){

  // If the function already exists, no need to polyfill
	if(doc.querySelectorAll)return;
  
  doc.querySelectorAll = function(a){
    if("#"==a.charAt(0))return [doc.getElementById(a.substr(1))];
    if("."==a.charAt(0))return doc.getElementsByClassName(a.substr(1));
    return doc.getElementsByTagName(a);
  }
  
  doc.querySelector = function(a){
    return querySelectorAll(a)[0];
  }
})(document);

/*
 * EQCSS / Tommy Hidgins, Maxime Euzière / MIT licence
 * Global object
 */

EQCSS = {
  code: "",                       // All the EQCSS code (concatenated)
  scripts: [],                    // All the <script type="text/eqcss"> blocks (internal or external)
  queries: [],                    // All the @element queries
  selectors: [],                  // All the queries selectors
  conditions: [],                 // All the queries conditions
  styles: [],                     // All the queries CSS code
  xhr: new XMLHttpRequest         // AJAX handler
}

/*
 * EQCSS.load()
 * Called on load, on resize and manually on DOM update
 * Load and parse all the EQCSS code.
 */

EQCSS.load = function(){

  var i;

  // Retrieve all scripts with type="text/eqcss"
  scripts = document.querySelectorAll("script[type='text/eqcss']");

  for(i = 0; i < scripts.length; i++){

    // If the script embeds EQCSS code, add its content into the code
    if(scripts[i].innerHTML != ""){
      this.code += scripts[i].innerHTML;
    }
    
    // If the script is external, retrieve it with synchronous AJAX and add its content to the code
    if(scripts[i].src){
      this.xhr.open("GET", scripts[i].src, false);                             
      this.xhr.send(null);
      this.code += this.xhr.responseText;                   
    }
    
    // Mark the script as read
    scripts[i].type = "text/eqcss-read";
  }
  
  // Cleanup
  this.code = this.code.replace(/\s+/g," "); // reduce spaces
  this.code = this.code.replace(/^ | $/g,""); // trim
  this.code = this.code.replace(/\/\*[^¤]*?\*\//g,""); // remove comments
  this.code = this.code.replace(/ *@element/g,"\n@element");
  
  // Parse
  
  // Separate the queries
  this.code.replace(/(@element.*(?!@element))/g, function(string, match){
    EQCSS.queries.push(match);
  });
  
  // Extract the selectors
  for(i = 0; i < this.queries.length; i++){
    this.queries[i].replace(/@element ?["']([^"']*)["']/g, function(string, match){
      EQCSS.selectors[i] = match;
    })
  }
  
  // Extract the conditions
  for(i = 0; i < this.queries.length; i++){
    this.conditions[i] = [];
    this.queries[i].replace(/and ?\( ?([^:]*) ?: ?([^)]*) ?\)/g, function(string, match1, match2){
      EQCSS.conditions[i].push({measure: match1, value: match2});
    })
  }
  
  // Extract the styles
  for(i = 0; i < this.queries.length; i++){
    this.queries[i].replace(/{(.*)}/g, function(string, match){
      EQCSS.styles[i] = match;
    })
  }
  
  //l(EQCSS.queries);
  //l(EQCSS.selectors);
  //l(EQCSS.conditions);
  //l(EQCSS.styles);
}

/*
 * EQCSS.apply()
 * Called on load, on resize and manually on DOM update
 * Enable the Element Queries in which the conditions are true
 */

EQCSS.apply = function(){

  var i, j, k;                      // Iterators
  var elements;                     // Elements targeted by each query
  var css_block_id, css_block;      // CSS block corresponding to each targeter element
  var element_width, parent_width;  // Computed widths
  var test;                         // Query's condition test result
  
  // Loop on all element queries
  for(i = 0; i < EQCSS.queries.length; i++){
  
    // Find all the elements targeted by the query
    elements = document.querySelectorAll(EQCSS.selectors[i]);
    
    // Loop on all the elements
    for(j = 0; j < elements.length; j++){
    
      // Get the corresponding CSS block (or create one if it doesn't exist)
      css_block_id = "EQCSS_css_block_" + i + "_" + j;
      css_block = document.querySelector("#" + css_block_id);
      //l(0);
      if(!css_block){
        css_block = document.createElement("STYLE");
        css_block.id = css_block_id;
        document.body.appendChild(css_block);
        //l(document.body.innerHTML.slice(-100));
      }
      css_block = document.querySelector("#" + css_block_id);
      
      // Reset query test result (assume that the selector is matched)
      test = true;
      
      // Loop on the conditions
      test_conditions: for(k = 0; k < EQCSS.conditions[i].length; k++){
      
        //l(EQCSS.conditions[i][k].measure)
        //l(EQCSS.conditions[i][k].value)
      
        // Check each condition for this query and this element
        // If at least one condition is false, the element selector is not matched
        switch(EQCSS.conditions[i][k].measure){
        
          // Min-width 
          case "min-width":
          
            // Min-width in px
            if(EQCSS.conditions[i][k].value.indexOf("px") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
              if(element_width >= parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
          
            // Min-width in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("width"));
              if(parent_width / element_width <= 100 / parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
            
          break;
          
          // Max-width
          case "max-width":
          
            // Max-width in px
            if(EQCSS.conditions[i][k].value.indexOf("px") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
              if(element_width <= parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
          
            // Max-width in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("width"));
              if(parent_width / element_width >= 100 / parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
          
          break;
          
          // Min-height 
          case "min-height":
          
            // Min-height in px
            if(EQCSS.conditions[i][k].value.indexOf("px") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("height"));
              if(element_width >= parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
          
            // Min-height in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("height"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("height"));
              if(parent_width / element_width <= 100 / parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
            
          break;
          
          // Max-height
          case "max-height":
          
            // Max-height in px
            if(EQCSS.conditions[i][k].value.indexOf("px") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("height"));
              if(element_width <= parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
          
            // Max-height in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("height"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("height"));
              if(parent_width / element_width >= 100 / parseInt(EQCSS.conditions[i][k].value)){
                test = true;
              }
              else{
                test = false;
                break test_conditions;
              }
            }
          
          break;
          
          // Min-characters 
          case "min-characters":
          
            // if(elements[j].textContent.length >= parseInt(EQCSS.conditions[i][k].value)){
            if(elements[j].innerHTML.length >= parseInt(EQCSS.conditions[i][k].value)){
                test = true;
            }
            else{
              test = false;
              break test_conditions;
            }
            
          break;
          
          // Max-characters
          case "max-characters":
          
            //if(elements[j].textContent.length <= parseInt(EQCSS.conditions[i][k].value)){
            if(elements[j].innerHTML.length <= parseInt(EQCSS.conditions[i][k].value)){
              test = true;
            }
            else{
              test = false;
              break test_conditions;
            }

          
          break;
          
          
          // Min-children 
          case "min-children":
          
            if(elements[j].childNodes.length >= parseInt(EQCSS.conditions[i][k].value)){
                test = true;
            }
            else{
              test = false;
              break test_conditions;
            }
            
          break;
          
          // Max-children
          case "max-children":
          
            if(elements[j].childNodes.length <= parseInt(EQCSS.conditions[i][k].value)){
              test = true;
            }
            else{
              test = false;
              break test_conditions;
            }
          
          break;

        }
      }

      // Update CSS block:
      // If all conditions are met: copy the CSS code from the query to the CSS block (or rewrite it in the HEAD on IE < 9)
      if(test === true){
        try {
          css_block.innerHTML = EQCSS.styles[i];
        }
        catch(e){
          var head = document.head || document.getElementsByTagName('head')[0],
              style = document.createElement('style');

          style.type = 'text/css';
          style.id = css_block_id;
          if (style.styleSheet){
            style.styleSheet.cssText = EQCSS.styles[i];
          } else {
            style.appendChild(document.createTextNode(EQCSS.styles[i]));
          }
          head.appendChild(style);
        }
      }
      
      // If condition is not met: empty the CSS block (or remove it on IE < 9)
      else {
        try{
          css_block.innerHTML = "";
        }
        catch(e){
          css_block.parentNode.removeChild(css_block);
        }
      }
    }
  }
}

// Call load and apply on page load
window.addEventListener("load", function(){
  EQCSS.load();
  EQCSS.apply();
});

// Call apply on resize
window.addEventListener("resize", function(){
  EQCSS.apply();
});



// Temp: shortcut for console.log
function l(a){console.log(a)}