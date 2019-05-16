<script>
  import { DEFAULT_OPTIONS } from './defaults';
  import Container from './Container.vue';
  
  export default {
    name: 'popover',
    props: Object.assign({}, Container.props, {
      name: {
        type: String,
        required: true
      },
      container: {
        type: String,
        default: DEFAULT_OPTIONS.containerName
      },
      default: {
        type: Boolean,
        default: false
      },
      force: {
        type: Boolean,
        default: false
      }
    }),
    created() {
      const $base = this[this.namespace];

      $base.addPopover({
        name: this.name,
        instance: this,
        containerName: this.container
      });
    },
    beforeDestroy() {
      const $container = this[this.namespace][this.container];

      if($container) $container.removePopover(this.name);
    },
    beforeUpdate() {
      const $container = this[this.namespace][this.container];

      if (!$container) return;

      $container.update(this.name);
    },
    render() {
      return '';
    }
  }
</script>
