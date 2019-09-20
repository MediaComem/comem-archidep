import subject from 'courses-md/dist/client';
import $ from 'jquery';
import tippy from 'tippy.js';

const MODES = [
  // The memoir starts in its initial state and starts drawing 1 second after the slide is displayed.
  //
  // If the memoir is not drawn and not currently drawing when entering this mode,
  // drawing automatically starts 1 second later.
  'autoplay',
  // The memoir starts in its initial state and is only drawn when manually clicking the play button.
  'manual',
  // The memoir starts in its end state and can be reset to its initial state by clicking the backward button,
  // or reset to its initial state and automatically drawn by clicking the play button.
  //
  // If the memoir is not drawn and not currently drawing when entering this mode,
  // it is instantly drawn to display the end state.
  'visualization'
];

subject.gitMemoirs = {};

export class GitMemoirController {

  static start() {
    this.startGitMemoirs();
    subject.slideshow.on('afterShowSlide', this.startGitMemoirs);
    subject.slideshow.on('beforeHideSlide', this.destroyGitMemoirs);
  }

  static startGitMemoirs() {
    $('.remark-visible .remark-slide-content git-memoir').each(function() {
      new GitMemoirController(this).start();
    });
  }

  static destroyGitMemoirs() {
    $('.remark-visible .remark-slide-content git-memoir').each(function() {
      const memoirController = $(this).data('controller');
      if (memoirController) {
        memoirController.destroy();
      }
    });
  }

  constructor(element) {

    this.$element = $(element);
    this.$element.data('controller', this);

    this.name = this.$element.attr('name');
    if (!this.name) {
      throw new Error('<git-memoir> must have a "name" attribute');
    }

    this.svgHeight = this.$element.attr('svg-height');
    if (!this.svgHeight) {
      throw new Error('<git-memoir> must have an "svg-height" attribute');
    }

    this.chapter = this.$element.attr('chapter');

    this.chapters = parseInt(this.$element.attr('chapters'), 10);
    if (isNaN(this.chapters) || this.chapters <= 0) {
      this.chapters = 1;
    }

    this.controlsEnabled = !this.$element.attr('controls') || this.$element.attr('controls').match(/^(1|y|yes|t|true)$/i);

    this.memoirFactory = subject.gitMemoirs[this.name];
    if (!this.memoirFactory) {
      throw new Error(`No memoir found named "${this.name}"; assign a factory function to "subject.gitMemoirs.${this.name}"`);
    } else if (typeof(this.memoirFactory) != 'function') {
      throw new Error(`Memoir named "${this.name}" must be a function, got ${typeof(this.memoirFactory)}`);
    }
  }

  get mode() {
    return isLocalStorageAvailable() ? localStorage.gitMemoirMode || 'autoplay' : 'visualization';
  }

  start() {
    if (this.started) {
      this.destroy();
    }

    this.started = true;
    this.playing = false;
    this.played = false;

    const memoir = this.memoirFactory();

    const $svg = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
      .attr('width', '100%')
      .attr('height', this.svgHeight)
      .appendTo(this.$element);

    if (this.controlsEnabled) {

      const $controls = $('<div class="controls" />').appendTo(this.$element);
      this.$playButton = $('<button type="button" class="play tooltip" title="Play"><i class="fa fa-play" /></button>').appendTo($controls);

      this.$modeButton = $('<button type="button" class="mode tooltip" data-dynamictitle="true"><i class="fa" /></button>');
      if (isLocalStorageAvailable()) {
        this.$modeButton.appendTo($controls);
      }

      this.$backButton = $('<button type="button" class="back tooltip" title="Back"><i class="fa fa-backward" /></button>"').appendTo($controls);

      this.updateControls();
      this.createTooltips();
    }

    this.drawer = new gitMemoir.Drawer(memoir, {
      svg: $svg[0]
    });
    //this.drawer.setDebugging(true);

    const drawingPromise = this.drawInitialStep();

    if (this.controlsEnabled && this.mode == 'autoplay') {
      drawingPromise.then(() => {
        this.drawNextSteps();
      });
    }

    if (this.controlsEnabled) {
      this.$playButton.on('click', () => this.drawNextSteps());
      this.$modeButton.on('click', () => this.cycleMode());
      this.$backButton.on('click', () => this.undraw());
    }
  }

  drawInitialStep() {

    const drawOptions = {
      immediate: true,
      stepDuration: 0
    };

    if (!this.played && (this.mode == 'visualization' || !this.controlsEnabled)) {
      drawOptions.chapter = this.chapter;
      this.played = true;
    } else {
      this.played = false;
      drawOptions.until = this.chapter;
    }

    const done = () => {
      this.updateControls();
    };

    return this.draw(drawOptions).then(done, done);
  }

  drawNextSteps(instant) {
    if ((this.$playButton && this.$playButton.is('.disabled')) || this.playing) {
      return;
    }

    this.playing = true;
    this.updateControls();

    if (this.played) {
      this.drawer.clear();
      this.drawInitialStep();
    }

    const done = () => {
      this.played = true;
      this.updateControls();
    };

    const drawOptions = {
      immediate: !!instant,
      chapters: 1,
      initialDelay: instant ? 0 : 1000,
      stepDuration: instant ? 0 : 1000
    };

    this.draw(drawOptions).then(done, done);
  }

  undraw() {
    if (this.$backButton.is('.disabled') || this.playing || !this.played) {
      return;
    }

    this.drawer.clear();
    return this.drawInitialStep();
  }

  draw(options) {

    const done = () => {
      this.playing = false;
    };

    this.drawingPromise = (this.drawingPromise || Promise.resolve())
      .then(() => {
        this.playing = true;
        return this.drawer.draw(options);
      })
      .then(done)
      .catch(err => {
        console.warn(err);
        done();
        throw err;
      });

    return this.drawingPromise;
  }

  cycleMode() {

    const index = MODES.indexOf(this.mode);
    this.setMode(index < MODES.length - 1 ? MODES[index + 1] : MODES[0]);

    if ((this.mode == 'autoplay' || this.mode == 'visualization') && !this.playing && !this.played) {
      this.drawNextSteps(this.mode == 'visualization');
    }
  }

  setMode(mode) {
    localStorage.gitMemoirMode = mode;
    this.updateModeButton();
  }

  updateControls() {
    if (this.controlsEnabled) {
      this.$playButton[this.playing ? 'addClass' : 'removeClass']('disabled');
      this.$backButton[this.playing || !this.played ? 'addClass' : 'removeClass']('disabled');
      this.updateModeButton();
    }
  }

  updateModeButton() {

    let icon = 'play-circle-o';
    let title = 'Autoplay mode';

    if (this.mode == 'manual') {
      icon = 'pause-circle-o';
      title = 'Manual mode';
    } else if (this.mode == 'visualization') {
      icon = 'check-circle-o';
      title = 'Visualization mode';
    }

    this.$modeButton
      .attr('title', title)
      .find('i')
      .removeClass('fa-play-circle-o fa-pause-circle-o fa-check-circle-o')
      .addClass(`fa-${icon}`);
  }

  createTooltips() {
    this.tooltips = tippy('git-memoir .tooltip[title]', {
      hideOnClick: false
    });
  }

  destroy() {

    if (this.drawer) {
      this.drawer.clear();
    }

    if (this.tooltips) {
      this.tooltips.destroyAll();
    }

    this.$element.children().remove();
  }
}

function isLocalStorageAvailable() {
  return typeof(Storage) != 'undefined';
}
