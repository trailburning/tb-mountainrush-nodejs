import React from "react";
import ScrollAnimation from 'react-animate-on-scroll';

// mla - override ScrollAnimation to support scroll direction and prevent animateOut when scrolling down.
// works more like DivPeek (https://github.com/davidhalford/DivPeek)
export default class ScrollAnimationCustom extends ScrollAnimation {
  constructor(props) {
    super(props);

    this.scrollTop = 0;
  }

  handleScroll() {
    let bScrollingUp = true;

    if (document.documentElement.scrollTop < this.scrollTop) {
      bScrollingUp = false;
    }

    this.scrollTop = document.documentElement.scrollTop;

    // mla - pulled from base component but with scroll direction testing.
    if (!this.animating) {
      var currentVis = this.getVisibility();
      if (this.visibilityHasChanged(this.visibility, currentVis)) {
        clearTimeout(this.delayedAnimationTimeout);
        if (!currentVis.onScreen) {
          if (!bScrollingUp) {
            this.setState({
              classes: "animated",
              style: {
                animationDuration: this.props.duration + "s",
                opacity: this.props.initiallyVisible ? 1 : 0
              }
            });
          }
        } else if (currentVis.inViewport && this.props.animateIn) {
          this.animateIn(this.props.afterAnimatedIn);
        } else if (currentVis.onScreen && this.visibility.inViewport && this.props.animateOut && this.state.style.opacity === 1) {
          if (!bScrollingUp) {
            this.animateOut(this.props.afterAnimatedOut);
          }
        }
        this.visibility = currentVis;
      }
    }
  }

};
