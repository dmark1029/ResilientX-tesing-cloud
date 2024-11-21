import type { Directive, DirectiveHook } from 'vue';

const onUpdate: DirectiveHook = (el, binding) => {
  let isSelectingText = false;

  const handleMouseDown = () => {
    isSelectingText = false;
  };

  const handleMouseUp = () => {
    const selection = window.getSelection().toString();
    if (selection.length > 0) {
      isSelectingText = true;
    }
  };

  const handleClick = (event) => {
    if (!isSelectingText && typeof binding.value === 'function') {
      binding.value(event);
    }
  };

  el.__handleMouseDown__ = handleMouseDown;
  el.__handleMouseUp__ = handleMouseUp;
  el.__handleClick__ = handleClick;

  el.addEventListener('mousedown', handleMouseDown);
  el.addEventListener('mouseup', handleMouseUp);
  el.addEventListener('click', handleClick);
};

export const vTableClick: Directive = {
  getSSRProps() {
    return {};
  },
  updated: onUpdate,
  mounted: onUpdate,
  unmounted(el) {
    el.removeEventListener('mousedown', el.__handleMouseDown__);
    el.removeEventListener('mouseup', el.__handleMouseUp__);
    el.removeEventListener('click', el.__handleClick__);

    delete el.__handleMouseDown__;
    delete el.__handleMouseUp__;
    delete el.__handleClick__;
  },
};