
/*
 * EQCSS
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
  this.code = this.code.replace(/\s+/g," ");
  this.code = this.code.replace(/^ | $/g,"");
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

  var i, j;                         // Iterators
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
      if(!css_block){
        document.body.insertAdjacentHTML("beforeEnd", "<style id='" + css_block_id + "'></style>");
        css_block = document.querySelector("#" + css_block_id);
      }
      
      // Reset query test result
      test = false;
      
      // Check the query's condition for this element
      switch(EQCSS.conditions[i][0].measure){
      
        // Min-width 
        case "min-width":
        
          // Min-width in px
          if(EQCSS.conditions[i][0].value.indexOf("px") != -1){
            element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
            if(element_width >= parseInt(EQCSS.conditions[i][0].value)){
              test = true;
            }
          }
        
          // Min-width in %
          if(EQCSS.conditions[i][0].value.indexOf("%") != -1){
            element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
            parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("width"));
            if(parent_width / element_width <= 100 / parseInt(EQCSS.conditions[i][0].value)){
              test = true;
            }
          }
          
        break;
        
        // Max-width
        case "max-width":
        
          // Max-width in px
          if(EQCSS.conditions[i][0].value.indexOf("px") != -1){
            element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
            if(element_width <= parseInt(EQCSS.conditions[i][0].value)){
              test = true;
            }
          }
        
          // Max-width in %
          if(EQCSS.conditions[i][0].value.indexOf("%") != -1){
            element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
            parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("width"));
            if(parent_width / element_width >= 100 / parseInt(EQCSS.conditions[i][0].value)){
              test = true;
            }
          }
        
        break;
      }

      // Update CSS block:
      // If condition is met: copy the CSS code from the query to the CSS block
      if(test){
        css_block.innerHTML = EQCSS.styles[i];
      }
      
      // If condition is not met: empty the CSS block
      else {
        css_block.innerHTML = "";
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
function l(a){Array.isArray(a) ? console.dir(a) : console.log(a)}