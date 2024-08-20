var icons = [
  'apple','bananas','cherry','grapes','orange','pineapple','strawberry','watermelon'
];

var slots = document.querySelector('.slots');
var cols = document.querySelectorAll('.col');
for(var i in cols) {
  if (!cols.hasOwnProperty(i))
    continue;
  var col = cols[i];
  var str = '';
  var firstThree = '';
  for(var x = 0; x < 30; x++) {
    var part = '<svg class="icon"><use xlink:href="#icon-'+icons[Math.floor(Math.random()*icons.length)]+'"></use></svg>';
    str += part
    if (x < 3) firstThree += part;
  }
  col.innerHTML = str+firstThree;
}

document.querySelector('input').focus();
function spin(elem) {
  elem.setAttribute('disabled', true);
  slots.classList.toggle('spinning', true);
  window.setTimeout(function() {
    for(var i in cols) {
    if (!cols.hasOwnProperty(i))
      continue;
    var col = cols[i];
    
      var icons = [
  'apple','bananas','cherry','grapes','orange','pineapple','strawberry','watermelon'
];
      var results = [
        icons[Math.floor(Math.random()*icons.length)],
        icons[Math.floor(Math.random()*icons.length)],
        icons[Math.floor(Math.random()*icons.length)]
      ];
    var icons = col.querySelectorAll('.icon use');
    for(var x = 0; x < 3; x++) {
      icons[x].setAttribute('xlink:href', '#icon-'+results[x]);
      icons[(icons.length-3)+x].setAttribute('xlink:href', '#icon-'+results[x]);
    }
  }
  }, 1500);
  
  window.setTimeout(function() {
    slots.classList.toggle('spinning', false);
    elem.removeAttribute('disabled');
    elem.focus();
  }.bind(elem), 3500);
}