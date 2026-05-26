import { visit } from 'unist-util-visit';

export function rehypeCodeLanguage() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre') {
        const codeElement = node.children?.find(
          (child) => child.type === 'element' && child.tagName === 'code'
        );
        if (codeElement) {
          const languageClass = codeElement.properties?.className?.find((cls) =>
            cls.startsWith('language-')
          );
          if (languageClass) {
            node.properties = node.properties || {};
            node.properties.dataLanguage = languageClass.replace('language-', '');
          }
        }
      }
    });
  };
}
