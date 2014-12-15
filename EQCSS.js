/*
 * EQCSS / Tommy Hodgins, Maxime Euzière / MIT licence
 * Global object
 */

EQCSS = {
  code: "",                       // All the EQCSS code (concatenated)
  scripts: [],                    // All the <script type="text/eqcss"> blocks (be they internal or external)
  queries: [],                    // All the @element queries
  selectors: [],                  // All the queries' selectors
  conditions: [],                 // All the queries' conditions
  styles: [],                     // All the queries' CSS code
  xhr: new XMLHttpRequest         // AJAX handler
}

/*
 * EQCSS.load()
 * Called automatically on page load.
 * Call it manually after adding EQCSS code in the page.
 * Loads and parses all the EQCSS code.
 */

EQCSS.load = function(){

  // Retrieve all scripts with type="text/eqcss"
  var scripts = document.querySelectorAll("script[type='text/eqcss']");

  for(var i = 0; i < scripts.length; i++){

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
  this.code = this.code.replace(/\/\*[\w\W]*?\*\//g,""); // remove comments
  this.code = this.code.replace(/ *@element/g,"\n@element"); // One element query per line
  
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
      if(!css_block){
        css_block = document.createElement("STYLE");
        css_block.id = css_block_id;
        document.querySelector("head").appendChild(css_block);
      }
      css_block = document.querySelector("#" + css_block_id);
      
      // Reset the query test's result (first, we assume that the selector is matched, then we verify it)
      test = true;
      
      // Loop on the conditions
      test_conditions: for(k = 0; k < EQCSS.conditions[i].length; k++){
      
        // Check each condition for this query and this element
        // If at least one condition is false, the element selector is not matched
        switch(EQCSS.conditions[i][k].measure){
        
          // Min-width 
          case "min-width":
          
            // Min-width in px
            if(EQCSS.conditions[i][k].value.indexOf("px") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
              if(!(element_width >= parseInt(EQCSS.conditions[i][k].value))){
                test = false;
                break test_conditions;
              }
            }
          
            // Min-width in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("width"));
              if(!(parent_width / element_width <= 100 / parseInt(EQCSS.conditions[i][k].value))){
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
              if(!(element_width <= parseInt(EQCSS.conditions[i][k].value))){
                test = false;
                break test_conditions;
              }
            }
          
            // Max-width in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("width"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("width"));
              if(!(parent_width / element_width >= 100 / parseInt(EQCSS.conditions[i][k].value))){
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
              if(!(element_width >= parseInt(EQCSS.conditions[i][k].value))){
                test = false;
                break test_conditions;
              }
            }
          
            // Min-height in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("height"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("height"));
              if(!(parent_width / element_width <= 100 / parseInt(EQCSS.conditions[i][k].value))){
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
              if(!(element_width <= parseInt(EQCSS.conditions[i][k].value))){
                test = false;
                break test_conditions;
              }
            }
          
            // Max-height in %
            if(EQCSS.conditions[i][k].value.indexOf("%") != -1){
              element_width = parseInt(window.getComputedStyle(elements[j],null).getPropertyValue("height"));
              parent_width = parseInt(window.getComputedStyle(elements[j].parentNode,null).getPropertyValue("height"));
              if(!(parent_width / element_width >= 100 / parseInt(EQCSS.conditions[i][k].value))){
                test = false;
                break test_conditions;
              }
            }
          
          break;
          
          // Min-characters 
          case "min-characters":
          
            if(!(elements[j].innerHTML.length >= parseInt(EQCSS.conditions[i][k].value))){
              test = false;
              break test_conditions;
            }
            
          break;
          
          // Max-characters
          case "max-characters":
          
            if(!(elements[j].textContent.length <= parseInt(EQCSS.conditions[i][k].value))){
              test = false;
              break test_conditions;
            }
          
          break;
          
          
          // Min-children 
          case "min-children":
          
            if(!(elements[j].childNodes.length >= parseInt(EQCSS.conditions[i][k].value))){
              test = false;
              break test_conditions;
            }
            
          break;
          
          // Max-children
          case "max-children":
          
            if(!(elements[j].childNodes.length <= parseInt(EQCSS.conditions[i][k].value))){
              test = false;
              break test_conditions;
            }
          
          break;

        }
      }

      // Update CSS block:
      // If all conditions are met: copy the CSS code from the query to the corresponding CSS block (or rewrite it in the HEAD on IE < 9)
      if(test === true){
        
        // good browsers
        try {
          css_block.innerHTML = EQCSS.styles[i];
        }
        
        // IE8
        catch(e){
          css_block.styleSheet.cssText = EQCSS.styles[i];
        }
      }
      
      // If condition is not met: empty the CSS block (or remove it on IE < 9)
      else {
        try{
          css_block.innerHTML = "";
        }
        catch(e){
          css_block.styleSheet.cssText = "";
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