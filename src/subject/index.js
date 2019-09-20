import subject from 'courses-md/dist/client';
import * as GitMemoir from 'git-memoir';

window.gitMemoir = GitMemoir;
window.subject = subject;

import { GitMemoirController } from './git-memoir';
import { RunkitController } from './runkit';

import 'font-awesome/css/font-awesome.css';

import './assets/bootstrap-btn.css';
import 'tippy.js/dist/tippy.css';
import './assets/fonts/DroidSerif/DroidSerif.css';
import './assets/fonts/UbuntuMono/UbuntuMono.css';
import './assets/fonts/YanoneKaffeesatz/YanoneKaffeesatz.css';
import './assets/slides.css';
import './assets/git-memoir.css';
import './assets/micromodal.css';
import './assets/runkit.css';

import heigLogo from './assets/heig.png';

subject.setLogo({
  url: 'https://heig-vd.ch',
  imageUrl: heigLogo,
  height: 60
});

subject
  .afterStart(() => GitMemoirController.start())
  .afterStart(() => RunkitController.start())
  .start();
