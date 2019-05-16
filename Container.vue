<script>
  import { DEFAULT_OPTIONS, DEFAULT_OPTIONS_KEYS } from './defaults';

  export default {
    name: 'popover-container',
    props: {
      name: {
        type: String,
        default: DEFAULT_OPTIONS.containerName
      },
      namespace: {
        type: String,
        default: DEFAULT_OPTIONS.namespace
      },
      // Since we want to be able to detect undefined passed, we
      // don't want to define overlayClose (or escClose) as Boolean.
      overlayClose: {},
      escClose: {},
      noExtraRootClass: {},
      overlayTransition: {
        type: String
      },
      baseClass: {
        type: String
      },
      rootClass: {
        type: String
      },
      overlayClass: {
        type: String
      },
      popoverClass: {
        type: String
      },
      popoverRole: {
        type: String
      },
      footerClass: {
        type: String
      },
      headerClass: {
        type: String
      }
    },
    data() {
      return {
        options: {},
        popovers: {},
        current: ''
      }
    },
    methods: {
      addPopover({ name, instance }) {
        if (this.popovers[name]) {
          console.warn('Popover with this name already added!');
          return;
        }

        this.popovers[name] = instance;

        if (instance.force || (instance.default && !this.current)) {
          this.open(name);
        }
      },
      removePopover(name) {
        if (this.current === name) this.close();

        delete this.popovers[name];
      },
      update(name) {
        // Since containers aren't reactive to popovers content since they
        // are decoupled from the containers, we need to manually trigger
        // an update for the containers to rerender when a popover updates.
        // Which is only needed whenever it is the active one of course.
        if (this.current === name) this.$forceUpdate();
      },
      open(name, options) {
        const instance = this.popovers[name];
        
        if (!instance) {
          console.warn(name + ` doesn't exist as popover!`);
          return;
        }

        if (this.current === name) {
          console.warn(name + ` is already open!`);
          return;
        }
        
        this.updateOptions(options, instance);
        this.current = name;
        this.$emit('open');
      },
      close(name) {
        if (name && this.current !== name) return;

        this.current = '';
        this.$emit('close');
      },
      // Set options. Are set in the following priority order:
      // 1. Passed as argument
      // 2. Instance level
      // 3. Container level
      // 4. Install level
      // 5. Fallback/default
      updateOptions(passedOptions = {}, instanceOptions) {
        const $base = this[this.namespace];

        DEFAULT_OPTIONS_KEYS.forEach((key) => {
          // in => proper way of checking if property exist, even if set to to undefined
          if (key in passedOptions) {
            this.options[key] = passedOptions[key];
            return;
          }

          // Since all props are defined, but set to the undefined value
          if (typeof instanceOptions[key] !== 'undefined') {
            this.options[key] = instanceOptions[key];
            return;
          }

          // Since all props are defined, but set to the undefined value
          if (typeof this[key] !== 'undefined') {
            this.options[key] = this[key];
            return;
          }

          if (key in $base.options) {
            this.options[key] = $base.options[key];
            return;
          }

          this.options[key] = DEFAULT_OPTIONS[key];
        });
      },
      keydown(event) {
        // ESCAPE key pressed
        if (event.keyCode === 27 && this.current && this.options.escClose) {
          this.close();
        }
      }
    },
    created() {
      const $base = this[this.namespace];
      
      $base.addContainer(this.name, this);
    },
    mounted() {
      document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.keydown);

      const $base = this[this.namespace];

      $base.removeContainer(this.name);
    },
    render(createElement) {
      if (!this.current && !this.$slots.default) return;

      const $base = this[this.namespace];

      let popovers = [];
      let mainContent = [];

      if (this.$slots.default) {
        popovers = this.$slots.default.filter(vnode => vnode.componentOptions && vnode.componentOptions.tag === $base.options.popoverComponentName);
      }

      if (this.current) {
        let header = [];
        let footer = [];

        const popover = this.popovers[this.current];

        if (popover.$scopedSlots.header || this.$scopedSlots.header) {
          header = [createElement('div', {
            class: this.options.baseClass + this.options.headerClass
          }, popover.$scopedSlots.header ? popover.$scopedSlots.header({ $container: this }) : this.$scopedSlots.header({ $container: this }))];
        }

        if (popover.$scopedSlots.footer || this.$scopedSlots.footer) {
          header = [createElement('div', {
            class: this.options.baseClass + this.options.footerClass
          }, popover.$scopedSlots.footer ? popover.$scopedSlots.footer({ $container: this }) : this.$scopedSlots.footer({ $container: this }))];
        }

        mainContent = header.concat(popover.$slots.default || []).concat(footer)
      }

      return createElement('div', {
        class: this.options.baseClass + this.options.rootClass + (this.options.noExtraRootClass ? '' : (' ' + this.options.baseClass + '-' + this.name))
      }, popovers.concat(!this.current ? [] : [
          createElement('transition', {
            props: {
              name: this.options.overlayTransition
            }
          }, [
              createElement('div', {
                class: this.options.baseClass + this.options.containerClass
              }, [
                  createElement('div', {
                    class: this.options.baseClass + this.options.overlayClass,
                    on: Object.assign({},
                      this.options.overlayClose ? {
                        'click': this.close
                      } : {}
                    )
                  }),
                  createElement('div', {
                    class: this.options.baseClass + this.options.popoverClass,
                    domProps: {
                      role: this.options.popoverRole
                    }
                  },
                    mainContent
                  )
                ])
            ])
        ]));

      // TODO: I'm not fully up-to-date with above render code - FIXME
      // Corresponding Template
      //  <transition :name="overlayTransition">
      //  <div :class="baseClass">
      //    <div :class="overlayClass"></div>
      //    <div :class="popoverClass" :role="popoverRole">
      //      Dynamic part here
      //    </div>
      //  </div>
      //</transition>
    }
  }
</script>
