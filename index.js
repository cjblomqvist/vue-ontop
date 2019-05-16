import { DEFAULT_OPTIONS } from './defaults'
import Container from './Container.vue'
import Popover from './Popover.vue'

// Simple base object added to Vue prototype. Should only be added once.
// Have the following purpose:
// - Global access to Containers´ API
// - Holding global options
// - Registration of containers
// - Convenience API for default namespace
class Base {
  constructor(options) {
    this.options = options;
    this.popoversToBeAdded = {};
    this.containers = [];
  }
  addContainer(name, container) {
    if (this[name]) {
      console.warn('Container already added with this namespace!');
      return;
    }

    this[name] = container;
    this.containers.push(container);

    // Add previously (if any) added popovers
    if (this.popoversToBeAdded[name]) {
      this.popoversToBeAdded[name].forEach(({ name, instance, containerName }) => {
        container.addPopover({ name, instance, containerName });
      });
    }
  }
  removeContainer(name) {
    delete this[name];
    this.containers = this.containers.filter((container) => container.name !== name);
    delete this.popoversToBeAdded[name];
  }
  closeAll(name) {
    this.containers.forEach((container) => {
      container.close(name);
    });
  }
  addPopover({ name, instance, containerName = DEFAULT_OPTIONS.containerName }) {
    if (!this[containerName]) {
      // Container hasn't been added yet, save for container to be added
      this.popoversToBeAdded[containerName] = this.popoversToBeAdded[containerName] || [];
      this.popoversToBeAdded[containerName].push({ name, instance, containerName });
      return;
    }

    this[containerName].addPopover({ name, instance });
  }
  // Below are only a convenient API for accessing the default namespace
  // and maps to the container API.
  removePopover(name) {
    this[DEFAULT_OPTIONS.containerName].removePopover(name);
  }
  update(name) {
    this[DEFAULT_OPTIONS.containerName].update(name);
  }
  open(name, options) {
    this[DEFAULT_OPTIONS.containerName].open(name, options);
  }
  close(name) {
    this[DEFAULT_OPTIONS.containerName].close(name);
  }
}

let installed = false;

const Plugin = {
  install(Vue, options = {}) {
    // Never install twice
    if (installed) return;

    installed = true;

    options = Object.assign({}, DEFAULT_OPTIONS, options);

    // Create new instance, and make globally accessible
    const popover = new Base(options);

    if (Vue.prototype[options.namespace]) return;

    Vue.prototype[options.namespace] = popover;

    // Add components
    Vue.component(options.containerComponentName, Container);
    Vue.component(options.popoverComponentName, Popover);
  }
};

export default Plugin
