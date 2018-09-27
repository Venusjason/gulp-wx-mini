// html写法 转换为wxml 匹配规则 https://github.com/imingyu/wxml-transformer/blob/master/src/options.js
export const defaultTransformOptions = {
  mapping: {
    block: 'div',
    page: 'div',
    view: 'div',
    'scroll-view': 'div',
    swiper: 'div',
    'swiper-item': 'div',
    'movable-view': 'div',
    icon: 'i',
    text: 'span',
    progress: 'div',
    button: 'button',
    'checkbox-group': 'div',
    checkbox: (element, helper) => {
      return `<input type="checkbox"${helper.propsStringify(element.props)} />` + (element.children && element.children.length > 0 ? `${helper.childrenStringify(element.children)}` : '');
    },
    form: 'form',
    input: 'input',
    label: 'label',
    picker: 'div',
    'picker-view': 'div',
    radio: (element, helper) => {
      return `<input type="radio"${helper.propsStringify(element.props)} />` + (element.children && element.children.length > 0 ? `${helper.childrenStringify(element.children)}` : '');
    },
    slider: 'div',
    switch: (element, helper) => {
      return `<input type="checkbox"${helper.propsStringify(element.props)} />` + (element.children && element.children.length > 0 ? `${helper.childrenStringify(element.children)}` : '');
    },
    textarea: 'textarea',
    audio: 'object',
    image: 'img',
    video: 'object',
    map: 'div',
    canvas: 'canvas',
    'contact-button': 'button'
  }
};

const Tags = {
  view: ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  text: ['span', 'em', 'i']
}

export const transformToWxml = (htmlContent) {
  const regsView = /<(div|p)[^>]*>[\s\S]*?<\/[^>]*(div|p)>/g
  const regsText = /<(span|i|em)[^>]*>[\s\S]*?<\/[^>]*(span|i|em)>/g
  htmlContent.replace(regsView, 'view')
}