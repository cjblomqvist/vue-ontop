const DEFAULT_OPTIONS = {
  // General
  namespace: '$popover',
  containerName: 'default',
  containerComponentName: 'popover-container',
  popoverComponentName: 'popover',
  overlayClose: true,
  escClose: true,
  noExtraRootClass: false,
  // Container
  overlayTransition: 'popover-fade',
  baseClass: 'popover',
  rootClass: '',
  containerClass: '__container',
  overlayClass: '__overlay',
  popoverClass: '__popover',
  footerClass: '__footer',
  headerClass: '__header',
  popoverRole: 'popover'
};

const DEFAULT_OPTIONS_KEYS = Object.keys(DEFAULT_OPTIONS);

export { DEFAULT_OPTIONS, DEFAULT_OPTIONS_KEYS };
