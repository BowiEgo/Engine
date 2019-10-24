export function insertAfter (el, targetEl) {
  let parent = targetEl.parentNode;
  if ( parent.lastChild === targetEl ){
    parent.appendChild(el);
  } else {
    parent.insertBefore(el, targetEl.nextSibling);
  }
}
