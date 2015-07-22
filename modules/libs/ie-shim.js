if (navigator.userAgent.match(/msie|firefox/i)) {
  Node.prototype.getComputedCSSText = function() {
    var s = [];
    var cssTranslation = { "cssFloat": "float" }
    var computedStyle = document.defaultView.getComputedStyle(this);
    for (var propertyName in computedStyle) {
      if ("string" == typeof(computedStyle[propertyName]) &&
       computedStyle[propertyName] != "") {
        var translatedName = cssTranslation[propertyName] || propertyName;
        s[s.length] = (translatedName.replace(/[A-Z]/g, function(x) {
              return "-" + (x.toLowerCase())
            })) + ": " + computedStyle[propertyName];
      }
    }

    return s.join('; ') + ";";
  };
}
