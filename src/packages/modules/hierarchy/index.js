export default function hierarchy (data, children) {
  let root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;
  
  if (children == null) children = defaultChildren;

  while ((node = nodes.pop())) {
    if (valued) node.value = +node.data.value;
    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  console.log(root);
}

hierarchy({value: '0', name: 'haha', children: [
  {
    value: 1,
    name: 'a',
    children: [
      {
        value: 11,
        name: 'aa'
      },
      {
        value: 12,
        name: 'ab'
      }
    ]
  },
  {
    value: 2,
    name: 'b',
    children: [
      {
        value: 22,
        name: 'bb'
      }
    ]
  }
]});

function defaultChildren (d) {
  return d.children
}

export function Node (data) {
  this.data = data;
  this.depth =
  this.height = 0;
  this.parent = null;
}

Node.prototype = hierarchy.prototype = {
  constructor: Node,
  // count: node_count,
  // each: node_each,
  // eachAfter: node_eachAfter,
  // eachBefore: node_eachBefore,
  // sum: node_sum,
  // sort: node_sort,
  // path: node_path,
  // ancestors: node_ancestors,
  // descendants: node_descendants,
  // leaves: node_leaves,
  // links: node_links,
  // copy: node_copy
};
