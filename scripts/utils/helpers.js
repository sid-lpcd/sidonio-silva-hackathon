export const createElement = (className, type, text, parent, id) => {
  const element = document.createElement(type);

  if (typeof className === "object" && className !== null) {
    while (className.length) {
      element.classList.add(className[0]);
      className.shift();
    }
  } else if (typeof className === "string") {
    element.classList.add(className);
  }

  if (text || text === 0) {
    element.innerText = text;
  }

  id ? (element.id = id) : null;

  parent.appendChild(element);

  return element;
};
