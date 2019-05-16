# vue-ontop
An extremely light-weight and flexible library for adding content on top of content; overlay, modal, dialog, lightbox, popup, slidein, etc.

## Vision
Provide base structure for any type of content dynamically shown on top of page content;
* Modals
* Popups
* Dialogs
* Toasts
* Slide-ins
* Side-panels
* ...

## Principles
* Light-weight, no cruft
* Simple and sane defaults, easily overriden
* All styling and effects (transitions) customizable
* Simple (and simple-to-use) API following common conventions and best practices
* No/minimal programming in attributes, meaning no templating, no styling in attributes
* No/minimal amount of dependencies

## Features
- [x] Global default options
- [x] Container and popovers (instances) decoupled (enables container to be placed in root while each popover can be placed where it belong, to be able to better follow the [SRP](https://en.wikipedia.org/wiki/Single_responsibility_principle))
- [x] Container slots for global frame
- [x] Everything over-rideable at popover level
- [ ] Esc => Close
- [x] Click on overlay background => Close
- [ ] Global and simple yet fully encompassing JS API (methods) for handling; events, methods; open, close, ...
  - [ ] Access to API via scoped slots
  - [ ] Events
- [x] Transition between popover instances without re-animating close/open
- [x] Fully SSR compatible
- [x] Multiple container support (e.g. if having multiple types of popovers in the same app)
- [ ] Possible to use as single component (popover as slot content directly in container)

## Future ideas
- [ ] Library of ready-made styling sets for different types of popovers and styling
- [ ] Library of ready-made components for creating different types of popovers - should go hand in hand with styling?

## Design
* Global installer with global options overriding global defaults
* Global container component where modal will actually show up in the code
* Popover registration component, usable anywhere, for adding a popover which can be shown in the container

## Inspiration
For good and bad design, and features, virtually all libraries in awesome-vue in the overlay section
