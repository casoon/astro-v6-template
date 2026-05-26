import { visit } from 'unist-util-visit';

export function rehypeCheckboxLabel() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'input' && node.properties?.type === 'checkbox') {
        node.properties.ariaLabel ??= 'Task';
      }
    });
  };
}
